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
        // 1ª ordenação por date_posted (nulos por último)
        .order('date_posted', { ascending: false, nullsFirst: false })
        // 2ª ordenação por created_at (fallback)
        .order('created_at', { ascending: false, nullsFirst: false });

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

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let current = [...jobs];
    const term = (searchTerm || '').toLowerCase();
    const loc = (locationFilter || '').toLowerCase();

    if (term) {
      current = current.filter(
        (j) =>
          (j.title || '').toLowerCase().includes(term) ||
          (j.company_name || '').toLowerCase().includes(term)
      );
    }
    if (loc) {
      current = current.filter((j) => (j.location || '').toLowerCase().includes(loc));
    }
    if (jobTypeFilter !== 'all') {
      current = current.filter((j) => j.job_type === jobTypeFilter);
    }
    setFilteredJobs(current);
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <header className="mb-10 text-center">
        <Search className="mx-auto text-blue-600 h-16 w-16 mb-4" />
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Encontre sua Próxima Oportunidade
