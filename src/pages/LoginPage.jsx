import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.senha) {
      toast({
        title: 'Erro de login',
        description: 'Informe e-mail e senha.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // 🔐 Login oficial no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.senha,
      });

      if (error) {
        // mensagens comuns
        const friendly =
          error.message?.includes('Invalid login credentials') ? 'Credenciais inválidas.' :
          error.message?.includes('Email not confirmed') ? 'E-mail ainda não confirmado.' :
          error.message || 'Não foi possível entrar.';
        toast({ title: 'Erro de login', description: friendly, variant: 'destructive' });
        return;
      }

      // data.session contém user + tokens; sessão fica ativa neste domínio
      const user = data.user;

      // ✅ compatibilidade com sua Navbar (usa localStorage)
      localStorage.setItem('usuarioLogado', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.id,
        email: user.email,
        // metadados úteis pro restante do app
        ...user.user_metadata,
      }));

      toast({
        title: 'Bem-vindo(a)!',
        description: `Login realizado com ${user.email}.`,
      });

      // redirecione para a ação mais comum pós-login
      navigate('/publicar-vaga');
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-blue-100">
        <div className="text-center mb-8">
          <LogIn className="mx-auto text-blue-600 h-16 w-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Acessar Conta</h1>
          <p className="text-gray-600 mt-2">Bem-vindo(a) de volta! Faça login para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              <Mail className="inline mr-2 h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">
              <Lock className="inline mr-2 h-4 w-4" />
              Senha
            </Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Sua senha"
              required
              disabled={loading}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 font-semibold transition-transform transform hover:scale-105 disabled:opacity-70"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-blue-600 hover:underline">
            <UserPlus className="inline mr-1 h-4 w-4" />
            Cadastre-se
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
