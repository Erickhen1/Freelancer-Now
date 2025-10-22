import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sender_id, recipient_id, job_title, company } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Função para buscar usuário logado (Supabase ou localStorage)
  const getLoggedUser = async () => {
    try {
      let { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const local = localStorage.getItem('loggedInUser');
        user = local ? JSON.parse(local) : null;
      }
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário logado:', error);
      return null;
    }
  };

  // Busca mensagens entre dois usuários
  const fetchMessages = async () => {
    const currentUser = await getLoggedUser();
    if (!currentUser || !recipient_id) {
      toast({
        title: 'Faça login',
        description: 'Você precisa estar logado para ver mensagens.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    const currentId = currentUser.id || currentUser.user?.id;
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentId},recipient_id.eq.${recipient_id}),and(sender_id.eq.${recipient_id},recipient_id.eq.${currentId})`)
      .order('created_at', { ascending: true });

    if (error) console.error('Erro ao carregar mensagens:', error);
    else setMessages(data || []);
    setLoading(false);
  };

  // Enviar nova mensagem
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const currentUser = await getLoggedUser();
    if (!currentUser) {
      toast({
        title: 'Faça login',
        description: 'Você precisa estar logado para enviar mensagens.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    const currentId = currentUser.id || currentUser.user?.id;

    const { error } = await supabase
      .from('messages')
      .insert([{ sender_id: currentId, recipient_id, content: newMessage }]);

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [recipient_id]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col h-[70vh]">
        <h1 className="text-xl font-bold text-blue-700 mb-2">
          Conversa sobre: {job_title}
        </h1>
        <p className="text-gray-500 mb-4">Empresa: {company}</p>

        <div className="flex-grow overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
          {loading ? (
            <p className="text-gray-500 text-center">Carregando mensagens...</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`my-2 p-2 rounded-lg max-w-[70%] ${
                  msg.sender_id === (JSON.parse(localStorage.getItem('loggedInUser'))?.id)
                    ? 'bg-blue-100 ml-auto text-right'
                    : 'bg-gray-200'
                }`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Nenhuma mensagem ainda.</p>
          )}
        </div>

        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
