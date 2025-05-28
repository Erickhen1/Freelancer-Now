import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';

    const LoginPage = () => {
      const [formData, setFormData] = useState({ email: '', senha: '' });
      const { toast } = useToast();
      const navigate = useNavigate();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.senha) {
          toast({ title: "Erro de Login", description: "Por favor, preencha email e senha.", variant: "destructive" });
          return;
        }
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', formData.email)
          .eq('senha', formData.senha) // ATENÇÃO: Comparação de senha em plain text. NÃO FAÇA ISSO EM PRODUÇÃO. Use Supabase Auth.
          .single();

        if (error || !data) {
          console.error("Login error:", error);
          toast({ title: "Erro de Login", description: "Email ou senha incorretos.", variant: "destructive" });
          return;
        }
        
        toast({ title: "Login Bem-sucedido!", description: `Bem-vindo(a) de volta, ${data.nome}!`, variant: "default" });
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        navigate('/perfil');
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
                <Label htmlFor="email"><Mail className="inline mr-2 h-4 w-4" />Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required 
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha"><Lock className="inline mr-2 h-4 w-4" />Senha</Label>
                <Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Sua senha" required 
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div className="flex items-center justify-between">
                <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</Link>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 font-semibold transition-transform transform hover:scale-105">
                <LogIn className="mr-2 h-5 w-5" /> Entrar
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-8">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="font-medium text-blue-600 hover:underline">
                <UserPlus className="inline mr-1 h-4 w-4" />Cadastre-se
              </Link>
            </p>
          </div>
        </motion.div>
      );
    };

    export default LoginPage;