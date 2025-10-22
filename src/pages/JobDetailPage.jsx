import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, MapPin, Briefcase, DollarSign, CalendarDays } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const JobDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = location.state?.job;
  const employer_id = location.state?.employer_id;

  const handleChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para enviar mensagens.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    navigate('/chat', {
      state: {
        sender_id: user.id,
        recipient_id: employer_id,
        job_title: job.title,
        company: job.company_name
      }
    });
  };

  if (!job) {
    return <p className="text-center py-10 text-gray-600">Vaga não encontrada.</p>;
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Card className="shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700">{job.title}</CardTitle>
          <p className="text-gray-500">{job.company_name}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-blue-500" />{job.location}</p>
          <p className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-blue-500" />{job.job_type}</p>
          {job.salary && <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-green-500" />{job.salary}</p>}
          <p className="text-gray-700"><strong>Descrição:</strong> {job.description}</p>
          {job.requirements && <p className="text-gray-700"><strong>Requisitos:</strong> {job.requirements}</p>}
          {job.application_deadline && (
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-blue-500" /> Prazo:{" "}
              {new Date(job.application_deadline).toLocaleDateString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleChat}
        className="mt-8 w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3"
      >
        <MessageCircle className="mr-2 h-5 w-5" /> Conversar com o contratante
      </Button>
    </div>
  );
};

export default JobDetailPage;
