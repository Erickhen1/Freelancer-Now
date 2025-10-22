import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Search, MapPin, Briefcase, Filter, DollarSign, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const JobSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(
        'id, title, company_name, location, job_type, salary, description, created_by, date_posted, created_at'
      )
      // ordena por date_posted se existir; senão, por created_at
      .order('date_posted', { ascending: false, nullsLast: true })
      .order('created_at', { ascending: false, nullsLast: true });

    if (error) throw error;
    setJobs(data || []);
  } catch (err) {
    console.error('Erro ao buscar vagas:', err);
    toast({
      title: 'Erro ao Carregar Vagas',
      description: err.message || 'Não foi possível buscar as vagas.',
      variant: 'destructive',
    });
    setJobs([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetchJobs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let current = [...jobs];
    const term = searchTerm.toLowerCase();
    const loc = locationFilter.toLowerCase();

    if (term) {
      current = current.filter(j =>
        (j.title || '').toLowerCase().includes(term) ||
        (j.company_name || '').toLowerCase().includes(term)
      );
    }
    if (loc) {
      current = current.filter(j => (j.location || '').toLowerCase().includes(loc));
    }
    if (jobTypeFilter !== 'all') {
      current = current.filter(j => j.job_type === jobTypeFilter);
    }
    setFilteredJobs(current);
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <Search className="mx-auto text-blue-600 h-16 w-16 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Encontre sua Próxima Oportunidade</h1>
        <p className="text-lg text-gray-600">Milhares de vagas esperando por você. Filtre e encontre a ideal!</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <Label htmlFor="searchTerm"><Filter className="inline mr-2 h-4 w-4" />Palavra-chave</Label>
            <Input id="searchTerm" placeholder="Cargo, empresa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="locationFilter"><MapPin className="inline mr-2 h-4 w-4" />Localização</Label>
            <Input id="locationFilter" placeholder="Cidade, estado..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="jobTypeFilter"><Briefcase className="inline mr-2 h-4 w-4" />Tipo de Vaga</Label>
            <Select onValueChange={setJobTypeFilter} value={jobTypeFilter}>
              <SelectTrigger id="jobTypeFilter" className="w-full focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
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
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white md:mt-0 mt-4" onClick={fetchJobs} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
            {loading ? 'Buscando...' : 'Buscar Vagas'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="ml-4 text-xl text-gray-600">Carregando vagas...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const canChat = Boolean(job.created_by);
            const detailsState = { jobId: job.id, jobTitle: job.title, companyName: job.company_name };
            return (
              <motion.div key={job.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <Card className="hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-gray-600">{job.company_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm flex-grow">
                    <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-blue-500" /> {job.location || '—'}</p>
                    <p className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-blue-500" /> {job.job_type ? job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace(/([A-Z])/g, ' $1').trim() : '—'}</p>
                    {job.salary && <p className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-green-500" /> {job.salary}</p>}
                    <p className="text-gray-700 pt-2 line-clamp-3">{job.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-xs text-gray-500 pt-4">
                    <p className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {' '}Postado em: {job.date_posted ? new Date(job.date_posted).toLocaleDateString('pt-BR') : '—'}
                    </p>
                    <Button variant="link" asChild className="text-blue-600 hover:text-blue-800 p-0 h-auto">
                      <Link
                        to={canChat ? `/chat/${job.created_by}` : `/vaga/${job.id}`}
                        state={detailsState}
                      >
                        Ver Detalhes
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <img className="mx-auto mb-4 w-48 h-48 opacity-70" alt="Nenhuma vaga encontrada" src="https://images.unsplash.com/photo-1682624400764-d2c9eaeae972" />
          <p className="text-xl text-gray-600">Nenhuma vaga encontrada com os filtros atuais.</p>
          <p className="text-gray-500">Tente ajustar sua busca ou ampliar os critérios.</p>
        </div>
      )}
    </motion.div>
  );
};

export default JobSearchPage;
