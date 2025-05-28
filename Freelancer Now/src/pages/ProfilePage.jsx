import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useToast } from '@/components/ui/use-toast';
    import { User, Briefcase, Mail, Building, FileText, Edit3, Save, LogOut, ShieldCheck } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';

    const ProfilePage = () => {
      const [userData, setUserData] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      const [formData, setFormData] = useState({});
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        const fetchUserData = async () => {
          const localUser = localStorage.getItem('loggedInUser');
          if (localUser) {
            const parsedUser = JSON.parse(localUser);
            // Fetch fresh data from Supabase to ensure it's up-to-date
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', parsedUser.id)
              .single();

            if (error) {
              console.error("Error fetching user data from Supabase:", error);
              toast({ title: "Erro ao Carregar Perfil", description: "Não foi possível buscar seus dados atualizados.", variant: "destructive" });
              // Fallback to local storage data if Supabase fetch fails but user was logged in
              setUserData(parsedUser);
              setFormData(parsedUser);
            } else if (data) {
              setUserData(data);
              setFormData(data);
              localStorage.setItem('loggedInUser', JSON.stringify(data)); // Update local storage
            } else {
              // User might have been deleted from Supabase or ID mismatch
              localStorage.removeItem('loggedInUser');
              toast({ title: "Sessão Inválida", description: "Sua sessão expirou ou é inválida. Faça login novamente.", variant: "destructive" });
              navigate('/login');
            }
          } else {
            toast({ title: "Acesso Negado", description: "Você precisa estar logado para ver seu perfil.", variant: "destructive" });
            navigate('/login');
          }
        };
        fetchUserData();
      }, [navigate, toast]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSaveChanges = async () => {
        if (!userData || !userData.id) {
          toast({ title: "Erro", description: "ID do usuário não encontrado.", variant: "destructive" });
          return;
        }

        const updateData = {
          nome: formData.nome,
          // Email e senha não devem ser alterados aqui diretamente por segurança.
          // CPF e CNPJ também são identificadores únicos e geralmente não são alterados.
          area_atuacao: formData.area_atuacao,
          experiencia: formData.experiencia,
          // razao_social é o mesmo que nome para PJ
        };
         if (formData.account_type === 'pessoaJuridica') {
          updateData.razao_social = formData.nome;
        }


        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userData.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating profile:", error);
          toast({ title: "Erro ao Atualizar", description: error.message || "Não foi possível salvar as alterações.", variant: "destructive" });
          return;
        }

        setUserData(data);
        setFormData(data);
        localStorage.setItem('loggedInUser', JSON.stringify(data));
        setIsEditing(false);
        toast({ title: "Perfil Atualizado", description: "Suas informações foram salvas com sucesso!", variant: "default" });
      };
      
      const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        // TODO: Idealmente, invalidar a sessão no Supabase Auth se estiver usando.
        toast({ title: "Logout Realizado", description: "Você foi desconectado com sucesso.", variant: "default" });
        navigate('/login');
      };

      if (!userData) {
        return (
          <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
            <p className="text-xl text-gray-600">Carregando perfil...</p>
          </div>
        );
      }
      
      const commonFields = (
        <>
          <div className="space-y-1">
            <Label htmlFor="nome"><User className="inline mr-2 h-4 w-4 text-blue-600" />{userData.account_type === 'pessoaJuridica' ? 'Razão Social' : 'Nome Completo'}</Label>
            {isEditing ? (
              <Input id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} />
            ) : (
              <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.nome}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email"><Mail className="inline mr-2 h-4 w-4 text-blue-600" />Email</Label>
             <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.email} <ShieldCheck className="inline ml-2 h-4 w-4 text-green-500" title="Email (não editável aqui)"/></p>
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
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Meu Perfil</h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              ) : (
                <Button onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {commonFields}

              {userData.account_type === 'pessoaFisica' && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="cpf"><FileText className="inline mr-2 h-4 w-4 text-blue-600" />CPF</Label>
                    <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.cpf} (não editável)</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="area_atuacao"><Briefcase className="inline mr-2 h-4 w-4 text-blue-600" />Área de Atuação</Label>
                    {isEditing ? (
                      <Select name="area_atuacao" onValueChange={(value) => handleSelectChange('area_atuacao', value)} value={formData.area_atuacao || ''}>
                        <SelectTrigger id="area_atuacao" className="w-full">
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
                    ) : (
                      <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.area_atuacao}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="experiencia">Experiência</Label>
                    {isEditing ? (
                      <textarea 
                        id="experiencia" 
                        name="experiencia" 
                        value={formData.experiencia || ''} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800 p-2 bg-gray-50 rounded-md min-h-[50px] whitespace-pre-wrap">{userData.experiencia || 'Não informado'}</p>
                    )}
                  </div>
                </>
              )}

              {userData.account_type === 'pessoaJuridica' && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="cnpj"><FileText className="inline mr-2 h-4 w-4 text-blue-600" />CNPJ</Label>
                     <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.cnpj} (não editável)</p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="area_atuacao">Tipo de Estabelecimento</Label>
                     {isEditing ? (
                        <Select name="area_atuacao" onValueChange={(value) => handleSelectChange('area_atuacao', value)} value={formData.area_atuacao || ''}>
                          <SelectTrigger id="area_atuacao" className="w-full">
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
                      ) : (
                        <p className="text-gray-800 p-2 bg-gray-50 rounded-md">{userData.area_atuacao}</p>
                      )}
                  </div>
                </>
              )}
            </div>
            <Button onClick={handleLogout} variant="destructive" className="w-full mt-10">
              <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
            </Button>
          </div>
        </motion.div>
      );
    };

    export default ProfilePage;