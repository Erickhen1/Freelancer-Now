import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, CalendarDays, AlignLeft, Building, Loader2, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { supabase } from '@/lib/supabaseClient';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Erro ao buscar vaga:', error);
        setError('Vaga não encontrada ou erro ao carregar.');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os detalhes da vaga.',
          variant: 'destructive'
        });
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();
  }, [jobId, toast]);

  const handleChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Login Necessário',
        description: 'Você precisa estar logado para iniciar um chat.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (user.id === job.created_by) {
      toast({
        title: 'Ação Inválida',
        description: 'Você não pode iniciar um chat consigo mesmo. Acesse a página de chats para ver suas conversas.',
        variant: 'destructive'
      });
      return;
    }

    // 1. Verificar se já existe um chat entre os dois usuários para esta vaga
    // O chat pode ser (user.id, job.created_by) OU (job.created_by, user.id)
    const userA = user.id;
    const userB = job.created_by;
    const isOwner = userA === userB;

    if (isOwner) {
      toast({
        title: 'Ação Inválida',
        description: 'Você não pode iniciar um chat consigo mesmo. Acesse a página de chats para ver suas conversas.',
        variant: 'destructive'
      });
      return;
    }

    // Tenta encontrar um chat existente
    let { data: chat, error: fetchError } = await supabase
      .from('chats')
      .select('id')
      .eq('job_id', jobId)
      .or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
      console.error('Erro ao buscar chat existente:', fetchError);
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar chats existentes.',
        variant: 'destructive'
      });
      return;
    }

    let chatId;

    if (chat) {
      // Chat existente
      chatId = chat.id;
    } else {
      // 2. Criar novo chat se não existir
      // Para manter a unicidade, sempre ordenamos os IDs
      const [u1, u2] = [userA, userB].sort();

      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert({
          job_id: jobId,
          user_a: u1,
          user_b: u2,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Erro ao criar novo chat:', insertError);
        toast({
          title: 'Erro',
          description: 'Não foi possível criar um novo chat.',
          variant: 'destructive'
        });
        return;
      }
      chatId = newChat.id;
    }

    // 3. Redirecionar para a página do chat
    navigate(`/chat/${chatId}`);
  };


  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Loader2 className="mx-auto h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Carregando detalhes da vaga...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Erro ao Carregar</h1>
        <p className="mt-4 text-gray-600">{error}</p>
        <Button onClick={() => navigate('/buscar-vagas')} className="mt-6">Voltar para a Busca</Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Vaga Não Encontrada</h1>
        <p className="mt-4 text-gray-600">A vaga que você está procurando não existe ou foi removida.</p>
        <Button onClick={() => navigate('/buscar-vagas')} className="mt-6">Voltar para a Busca</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-blue-100">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">{job.title}</h1>
          <p className="text-xl text-gray-600 mt-1 flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-500" />
            {job.company_name}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-semibold">Localização:</span> {job.location}
          </div>
          <div className="flex items-center text-gray-700">
            <Briefcase className="h-5 w-5 mr-3 text-blue-600" />
            <span className="font-semibold">Tipo:</span> {job.job_type}
          </div>
          <div className="flex items-center text-gray-700">
            <DollarSign className="h-5 w-5 mr-3 text-green-600" />
            <span className="font-semibold">Salário/Remuneração:</span> {job.salary || 'A combinar'}
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-2">
              <AlignLeft className="h-5 w-5 mr-2 text-blue-600" /> Descrição
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-2">
                <AlignLeft className="h-5 w-5 mr-2 text-blue-600" /> Requisitos
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {job.application_deadline && (
            <div className="flex items-center text-gray-700">
              <CalendarDays className="h-5 w-5 mr-3 text-blue-600" />
              <span className="font-semibold">Prazo para Candidatura:</span> {new Date(job.application_deadline).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4 border-t">
          <Button
            onClick={handleChat}
            className="bg-green-500 hover:bg-green-600 text-white text-lg py-3 px-8 font-semibold transition-transform transform hover:scale-105 flex items-center"
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            Iniciar Chat com o Empregador
          </Button>
        </div>

      </div>
    </motion.div>
  );
};

export default JobDetailPage;
