import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, MapPin, Briefcase, DollarSign, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

// Supabase -> fallback localStorage
const getLoggedUser = async () => {
  try {
    let { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const local = localStorage.getItem('loggedInUser');
      user = local ? JSON.parse(local) : null;
    }
    return user;
  } catch (e) {
    console.error('Erro ao obter usuário logado:', e);
    return null;
  }
};

const JobDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // pode vir da lista via state
  const [job, setJob] = useState(location.state?.job || null);
  const [employer_id, setEmployerId] = useState(
    // se a lista já mandou pronto, usa
    location.state?.employer_id ??
      location.state?.job?.user_id ??
      location.state?.job?.created_by ??
      null
  );
  const [loading, setLoading] = useState(false);

  // Se entrou direto pela URL, busca do banco
  useEffect(() => {
    const fetchJob = async () => {
      if (!job && id) {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*') // podemos selecionar tudo; o importante é user_id/created_by virem
          .eq('id', id)
          .single();

        if (error || !data) {
          toast({
            title: 'Erro ao carregar vaga',
            description: 'Não foi possível encontrar esta vaga.',
            variant: 'destructive',
          });
          navigate('/');
        } else {
          setJob(data);
          // resolve o dono (preferindo user_id)
          setEmployerId(data.user_id || data.created_by || null);
        }
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, job, navigate, toast]);

  // Se veio job via state mas employer_id não, tenta resolver a partir do job
  useEffect(() => {
    if (job && !employer_id) {
      setEmployerId(job.user_id || job.created_by || null);
    }
  }, [job, employer_id]);

  const handleChat = async () => {
    const user = await getLoggedUser();

    if (!user) {
      toast({
        title: 'Faça login',
        description: 'Você precisa estar logado para enviar mensagens.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const senderId = user.id || user.user?.id;
    if (!senderId) {
      toast({
        title: 'Erro de sessão',
        description: 'Seu ID de usuário não foi identificado.',
        variant: 'destructive',
      });
      return;
    }

    if (!employer_id) {
      toast({
        title: 'Erro',
        description: 'O ID do contratante não foi encontrado nesta vaga.',
        variant: 'destructive',
      });
      console.warn('Vaga sem user_id/created_by:', job);
      return;
    }

    navigate('/chat', {
      state: {
        sender_id: senderId,
        recipient_id: employer_id,
        job_title: job?.title || '',
        company: job?.company_name || '',
      },
    });
  };

  if (loading || !job) {
    return <p className="text-center py-10 text-gray-600">Carregando vaga...</p>;
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card className="shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700">{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {job.company_name && (
            <p className="text-gray-500">{job.company_name}</p>
          )}

          <p className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-blue-500" />
            {job.location || '—'}
          </p>

          <p className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
            {job.job_type || '—'}
          </p>

          {job.salary && (
            <p className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              {job.salary}
            </p>
          )}

          {job.description && (
            <p className="text-gray-700">
              <strong>Descrição:</strong> {job.description}
            </p>
          )}

          {job.requirements && (
            <p className="text-gray-700">
              <strong>Requisitos:</strong> {job.requirements}
            </p>
          )}

          {job.application_deadline && (
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
              Prazo:{' '}
              {new Date(job.application_deadline).toLocaleDateString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleChat}
        className="mt-8 w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Conversar com o contratante
      </Button>
    </div>
  );
};

export default JobDetailPage;
