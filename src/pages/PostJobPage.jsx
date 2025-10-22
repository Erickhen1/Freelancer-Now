import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Briefcase, MapPin, DollarSign, CalendarDays, AlignLeft, Building, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: '',
    salary: '',
    description: '',
    requirements: '',
    applicationDeadline: ''
  });

  const [authUser, setAuthUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // pega sessão do Supabase e aplica regras de acesso
  useEffect(() => {
    let active = true;

    const init = async () => {
      // 1) sessão pelo Supabase
      const { data: { user } } = await supabase.auth.getUser();

      // 2) fallback pro seu localStorage (mantém compatibilidade)
      const ls = localStorage.getItem('loggedInUser');
      const lsUser = ls ? JSON.parse(ls) : null;

      // Se não está logado em nenhum dos dois -> bloqueia
      if (!user && !lsUser) {
        toast({ title: 'Acesso negado', description: 'Faça login como empresa para publicar vagas.', variant: 'destructive' });
        navigate('/login');
        return;
      }

      // Descobre tipo de conta
      const accountType =
        user?.user_metadata?.account_type ||
        lsUser?.account_type ||
        'pessoaFisica'; // assume PF se não vier

      if (accountType === 'pessoaFisica') {
        toast({ title: 'Acesso negado', description: 'Apenas empresas podem publicar vagas.', variant: 'destructive' });
        navigate('/');
        return;
      }

      // Prefill nome da empresa
      const empresaFromMeta =
        user?.user_metadata?.razao_social ||
        user?.user_metadata?.nome ||
        lsUser?.razao_social ||
        lsUser?.nome ||
        '';

      if (!active) return;
      setAuthUser(user || lsUser); // guarda user (preferência Supabase)
      setFormData(prev => ({ ...prev, companyName: empresaFromMeta }));
    };

    init();

    // escuta mudanças de auth (opcional)
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user || null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // segurança: precisa estar logado pelo Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Sessão expirada', description: 'Faça login novamente para publicar.', variant: 'destructive' });
      navigate('/login');
      return;
    }

    // validações mínimas
    if (!formData.title || !formData.location || !formData.jobType || !formData.description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título, localização, tipo de vaga e descrição.',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    // normaliza deadline (date -> ISO) ou null
    const deadlineISO = formData.applicationDeadline
      ? new Date(formData.applicationDeadline).toISOString()
      : null;

    const jobData = {
      // campos do seu schema
      title: formData.title,
      company_name: formData.companyName,
      location: formData.location,
      job_type: formData.jobType,
      salary: formData.salary || null,
      description: formData.description,
      requirements: formData.requirements || null,
      application_deadline: deadlineISO,
      date_posted: new Date().toISOString(),

      // ESSENCIAL para RLS:
      created_by: user.id,     // dono da vaga (usa as policies)
      user_id: user.id ?? null // mantém se sua tabela já tinha essa coluna
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error('Error posting job:', error);
      toast({
        title: 'Erro ao publicar',
        description: error.message || 'Não foi possível publicar a vaga.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Vaga publicada!',
      description: `A vaga "${data.title}" foi publicada com sucesso.`,
    });

    navigate('/buscar-vagas');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-blue-100">
        <header className="mb-10 text-center">
          <PlusCircle className="mx-auto text-blue-600 h-16 w-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Publique uma Nova Vaga</h1>
          <p className="text-gray-600 mt-2">Descreva a oportunidade e encontre o freelancer ideal.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="title"><Briefcase className="inline mr-2 h-4 w-4 text-blue-600" />Título da Vaga</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Garçom para Fim de Semana" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="companyName"><Building className="inline mr-2 h-4 w-4 text-blue-600" />Nome da Empresa</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nome do seu estabelecimento"
                required
                disabled={!!formData.companyName} // bloqueia se já veio dos metadados
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="location"><MapPin className="inline mr-2 h-4 w-4 text-blue-600" />Localização</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Cidade, Estado" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="jobType"><Briefcase className="inline mr-2 h-4 w-4 text-blue-600" />Tipo de Vaga</Label>
              <Select name="jobType" onValueChange={(value) => handleSelectChange('jobType', value)} value={formData.jobType} required>
                <SelectTrigger id="jobType" className="w-full">
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="garcom">Garçom/Garçonete</SelectItem>
                  <SelectItem value="cozinheiro">Cozinheiro(a)</SelectItem>
                  <SelectItem value="bartender">Bartender</SelectItem>
                  <SelectItem value="auxiliarCozinha">Auxiliar de Cozinha</SelectItem>
                  <SelectItem value="auxiliarServicosGerais">Auxiliar de Serviços Gerais</SelectItem>
                  <SelectItem value="recepcionista">Recepcionista</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="salary"><DollarSign className="inline mr-2 h-4 w-4 text-green-500" />Salário/Remuneração (opcional)</Label>
              <Input id="salary" name="salary" value={formData.salary} onChange={handleChange} placeholder="Ex: R$ 150/dia ou R$ 2000/mês" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description"><AlignLeft className="inline mr-2 h-4 w-4 text-blue-600" />Descrição da Vaga</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detalhes sobre a vaga, responsabilidades, etc." required className="min-h-[120px]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="requirements"><AlignLeft className="inline mr-2 h-4 w-4 text-blue-600" />Requisitos (opcional)</Label>
            <Textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Habilidades, experiência desejada, certificações, etc." className="min-h-[100px]" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="applicationDeadline"><CalendarDays className="inline mr-2 h-4 w-4 text-blue-600" />Prazo para Candidatura (opcional)</Label>
            <Input id="applicationDeadline" name="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={handleChange} />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500 text-lg py-3 mt-6 font-semibold transition-transform transform hover:scale-105"
          >
            {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
            {submitting ? 'Publicando…' : 'Publicar Vaga'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default PostJobPage;
