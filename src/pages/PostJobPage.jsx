import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; // se não tiver, troque por uma <div>
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega os detalhes da vaga (inclui created_by!)
  const loadJob = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, description, location, job_type, salary, company_name, created_by')
      .eq('id', jobId)
      .single();

    setLoading(false);
    if (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Não foi possível carregar a vaga.', variant: 'destructive' });
      return;
    }
    setJob(data);
  }, [jobId, toast]);

  useEffect(() => { loadJob(); }, [loadJob]);

  // Abre (ou cria) um chat entre usuário atual e o contratante (job.created_by)
  const handleStartChat = async () => {
    const { data: u } = await supabase.auth.getUser();
    const me = u?.user?.id;
    if (!me) {
      toast({ title: 'Faça login', description: 'Você precisa estar logado para conversar.', variant: 'destructive' });
      navigate('/login');
      return;
    }
    if (!job?.created_by) {
      toast({ title: 'Erro', description: 'Vaga sem contratante válido.', variant: 'destructive' });
      return;
    }
    if (job.created_by === me) {
      toast({ title: 'Ops', description: 'Você é o criador desta vaga.', variant: 'default' });
      return;
    }

    const [a, b] = [me, job.created_by].sort(); // ordena para respeitar a UNIQUE (user_a,user_b)

    // Tenta achar chat existente
    const { data: existing, error: findErr } = await supabase
      .from('chats')
      .select('id')
      .eq('user_a', a)
      .eq('user_b', b)
      .maybeSingle();

    if (findErr) {
      console.error(findErr);
      toast({ title: 'Erro', description: 'Falha ao abrir o chat.', variant: 'destructive' });
      return;
    }

    let chatId = existing?.id;

    // Se não existe, cria
    if (!chatId) {
      const { data: created, error: insErr } = await supabase
        .from('chats')
        .insert([{ user_a: a, user_b: b, job_id: job.id }])
        .select('id')
        .single();

      if (insErr) {
        console.error(insErr);
        toast({ title: 'Erro', description: 'Não foi possível criar o chat.', variant: 'destructive' });
        return;
      }
      chatId = created.id;
    }

    navigate(`/chat/${chatId}`);
  };

  if (loading) return <div className="p-6">Carregando…</div>;
  if (!job) return <div className="p-6">Vaga não encontrada.</div>;

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <p className="text-gray-600 mb-1"><b>Empresa:</b> {job.company_name || '-'}</p>
        <p className="text-gray-600 mb-1"><b>Local:</b> {job.location}</p>
        <p className="text-gray-600 mb-1"><b>Tipo:</b> {job.job_type}</p>
        {job.salary && <p className="text-gray-600 mb-1"><b>Salário:</b> {job.salary}</p>}
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Descrição</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleStartChat} className="bg-blue-600 hover:bg-blue-700">
            Conversar com o contratante
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JobDetails;
