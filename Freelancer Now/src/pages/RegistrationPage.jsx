import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { useToast } from '@/components/ui/use-toast';
    import { User, Briefcase, Mail, Lock, FileText, Building, Users, UserPlus as UserPlusIcon } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';
    import { useNavigate } from 'react-router-dom';

    const RegistrationPage = () => {
      const [accountType, setAccountType] = useState('pessoaFisica');
      const [formData, setFormData] = useState({
        nome: '', // Usado para Nome Completo (PF) ou Razão Social (PJ)
        email: '',
        senha: '',
        confirmarSenha: '',
        cpf: '',
        areaAtuacao: '',
        experiencia: '',
        // razaoSocial: '', // Removido, usaremos 'nome' para PJ
        cnpj: '',
        termos: false,
      });
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        // Limpar campos específicos ao trocar tipo de conta
        if (accountType === 'pessoaFisica') {
          setFormData(prev => ({ ...prev, cnpj: ''}));
        } else {
          setFormData(prev => ({ ...prev, cpf: '', experiencia: '' }));
        }
      }, [accountType]);

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const validateForm = async () => {
        if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
          toast({ title: "Erro de Validação", description: "Por favor, preencha todos os campos obrigatórios.", variant: "destructive" });
          return false;
        }
        if (formData.senha.length < 6) {
          toast({ title: "Erro de Validação", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
          return false;
        }
        if (formData.senha !== formData.confirmarSenha) {
          toast({ title: "Erro de Validação", description: "As senhas não coincidem.", variant: "destructive" });
          return false;
        }
        
        const { data: emailCheck, error: emailError } = await supabase
          .from('users')
          .select('email')
          .eq('email', formData.email)
          .single();

        if (emailCheck) {
          toast({ title: "Erro de Cadastro", description: "Este email já está cadastrado.", variant: "destructive" });
          return false;
        }
        if (emailError && emailError.code !== 'PGRST116') { 
            toast({ title: "Erro no Servidor", description: "Não foi possível verificar o email. Tente novamente.", variant: "destructive" });
            console.error("Email check error:", emailError);
            return false;
        }

        if (accountType === 'pessoaFisica') {
          if (!formData.cpf || !formData.areaAtuacao) {
            toast({ title: "Erro de Validação", description: "CPF e Área de Atuação são obrigatórios para Pessoa Física.", variant: "destructive" });
            return false;
          }
          if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
             toast({ title: "Erro de Validação", description: "Formato de CPF inválido. Use XXX.XXX.XXX-XX.", variant: "destructive" });
             return false;
          }
          const { data: cpfCheck, error: cpfError } = await supabase
            .from('users')
            .select('cpf')
            .eq('cpf', formData.cpf)
            .single();
          
          if (cpfCheck) {
            toast({ title: "Erro de Cadastro", description: "Este CPF já está cadastrado.", variant: "destructive" });
            return false;
          }
          if (cpfError && cpfError.code !== 'PGRST116') {
            toast({ title: "Erro no Servidor", description: "Não foi possível verificar o CPF. Tente novamente.", variant: "destructive" });
            console.error("CPF check error:", cpfError);
            return false;
          }
        }

        if (accountType === 'pessoaJuridica') {
          // 'nome' é usado para Razão Social, então já é validado acima.
          if (!formData.cnpj || !formData.areaAtuacao) { // Adicionado areaAtuacao para PJ
            toast({ title: "Erro de Validação", description: "CNPJ e Tipo de Estabelecimento são obrigatórios para Pessoa Jurídica.", variant: "destructive" });
            return false;
          }
          if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
            toast({ title: "Erro de Validação", description: "Formato de CNPJ inválido. Use XX.XXX.XXX/XXXX-XX.", variant: "destructive" });
            return false;
          }
          const { data: cnpjCheck, error: cnpjError } = await supabase
            .from('users')
            .select('cnpj')
            .eq('cnpj', formData.cnpj)
            .single();

          if (cnpjCheck) {
            toast({ title: "Erro de Cadastro", description: "Este CNPJ já está cadastrado.", variant: "destructive" });
            return false;
          }
          if (cnpjError && cnpjError.code !== 'PGRST116') {
            toast({ title: "Erro no Servidor", description: "Não foi possível verificar o CNPJ. Tente novamente.", variant: "destructive" });
            console.error("CNPJ check error:", cnpjError);
            return false;
          }
        }

        if (!formData.termos) {
          toast({ title: "Erro de Validação", description: "Você deve aceitar os termos e condições.", variant: "destructive" });
          return false;
        }
        return true;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (!isValid) return;

        const userData = {
          account_type: accountType,
          nome: formData.nome, // Para PF é nome, para PJ é Razão Social
          email: formData.email,
          senha: formData.senha, 
          cpf: accountType === 'pessoaFisica' ? formData.cpf : null,
          area_atuacao: formData.areaAtuacao,
          experiencia: accountType === 'pessoaFisica' ? formData.experiencia : null,
          razao_social: accountType === 'pessoaJuridica' ? formData.nome : null, // Razão Social é o mesmo que 'nome' para PJ
          cnpj: accountType === 'pessoaJuridica' ? formData.cnpj : null,
        };

        const { data, error } = await supabase.from('users').insert([userData]).select().single();

        if (error) {
          console.error("Supabase registration error:", error);
          toast({ title: "Erro no Cadastro", description: error.message || "Não foi possível criar sua conta. Tente novamente.", variant: "destructive" });
          return;
        }
        
        toast({
          title: "Cadastro Realizado com Sucesso!",
          description: `Bem-vindo(a) ${data.nome}! Sua conta foi criada.`,
          variant: "default"
        });
        
        localStorage.setItem('loggedInUser', JSON.stringify(data)); 
        navigate('/perfil'); 
        
        setFormData({
          nome: '', email: '', senha: '', confirmarSenha: '', cpf: '', areaAtuacao: '', experiencia: '', cnpj: '', termos: false,
        });
      };

      const commonFields = (
        <>
          <div className="space-y-2">
            <Label htmlFor="nome"><User className="inline mr-2 h-4 w-4" />{accountType === 'pessoaFisica' ? 'Nome Completo' : 'Razão Social'}</Label>
            <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder={accountType === 'pessoaFisica' ? "Seu nome completo" : "Nome da sua empresa"} required className="focus:ring-2 focus:ring-sky-500"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email"><Mail className="inline mr-2 h-4 w-4" />Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required className="focus:ring-2 focus:ring-sky-500"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senha"><Lock className="inline mr-2 h-4 w-4" />Senha</Label>
              <Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" required className="focus:ring-2 focus:ring-sky-500"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha"><Lock className="inline mr-2 h-4 w-4" />Confirmar Senha</Label>
              <Input id="confirmarSenha" name="confirmarSenha" type="password" value={formData.confirmarSenha} onChange={handleChange} placeholder="Confirme sua senha" required className="focus:ring-2 focus:ring-sky-500"/>
            </div>
          </div>
        </>
      );

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-12 px-4"
        >
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-sky-100">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-sky-700 mb-8">Crie sua Conta</h1>
            
            <div className="flex justify-center mb-8 space-x-2">
              <Button 
                onClick={() => setAccountType('pessoaFisica')} 
                variant={accountType === 'pessoaFisica' ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${accountType === 'pessoaFisica' ? 'bg-sky-600 text-white shadow-lg' : 'text-sky-600 border-sky-600 hover:bg-sky-50'}`}
              >
                <User className="mr-2 h-5 w-5" /> Pessoa Física
              </Button>
              <Button 
                onClick={() => setAccountType('pessoaJuridica')} 
                variant={accountType === 'pessoaJuridica' ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${accountType === 'pessoaJuridica' ? 'bg-sky-600 text-white shadow-lg' : 'text-sky-600 border-sky-600 hover:bg-sky-50'}`}
              >
                <Building className="mr-2 h-5 w-5" /> Pessoa Jurídica
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {commonFields}

              {accountType === 'pessoaFisica' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cpf"><FileText className="inline mr-2 h-4 w-4" />CPF</Label>
                    <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required={accountType === 'pessoaFisica'} className="focus:ring-2 focus:ring-sky-500"/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaAtuacaoPF"><Briefcase className="inline mr-2 h-4 w-4" />Área de Atuação</Label>
                    <Select name="areaAtuacao" onValueChange={(value) => handleSelectChange('areaAtuacao', value)} value={formData.areaAtuacao} required={accountType === 'pessoaFisica'}>
                      <SelectTrigger id="areaAtuacaoPF" className="w-full focus:ring-2 focus:ring-sky-500">
                        <SelectValue placeholder="Selecione sua área" />
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
                  <div className="space-y-2">
                    <Label htmlFor="experiencia">Experiência (opcional)</Label>
                    <textarea 
                      id="experiencia" 
                      name="experiencia" 
                      value={formData.experiencia} 
                      onChange={handleChange} 
                      placeholder="Descreva brevemente sua experiência..." 
                      className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
                    />
                  </div>
                </>
              )}

              {accountType === 'pessoaJuridica' && (
                <>
                  {/* O campo Razão Social é o campo "nome" comum */}
                  <div className="space-y-2">
                    <Label htmlFor="cnpj"><FileText className="inline mr-2 h-4 w-4" />CNPJ</Label>
                    <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" required={accountType === 'pessoaJuridica'} className="focus:ring-2 focus:ring-sky-500"/>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="areaAtuacaoEmpresa"><Users className="inline mr-2 h-4 w-4" />Tipo de Estabelecimento</Label>
                    <Select name="areaAtuacao" onValueChange={(value) => handleSelectChange('areaAtuacao', value)} value={formData.areaAtuacao} required={accountType === 'pessoaJuridica'}>
                      <SelectTrigger id="areaAtuacaoEmpresa" className="w-full focus:ring-2 focus:ring-sky-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="evento">Empresa de Eventos</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox id="termos" name="termos" checked={formData.termos} onCheckedChange={(checked) => handleSelectChange('termos', checked)} />
                <Label htmlFor="termos" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Eu li e aceito os <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">termos e condições</a>.
                </Label>
              </div>

              <Button type="submit" className="w-full bg-amber-400 text-sky-800 hover:bg-amber-500 text-lg py-3 mt-6 font-semibold transition-transform transform hover:scale-105">
                <UserPlusIcon className="mr-2 h-5 w-5" /> Criar Conta
              </Button>
            </form>
          </div>
        </motion.div>
      );
    };

    export default RegistrationPage;