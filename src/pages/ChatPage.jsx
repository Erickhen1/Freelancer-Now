import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const ChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [input, setInput] = useState('');
  const [me, setMe] = useState(null);
  const listRef = useRef(null);

  // carrega sessão e chat
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setMe(u?.user?.id || null);

      const { data: c, error: cErr } = await supabase
        .from('chats')
        .select('id, user_a, user_b, job_id')
        .eq('id', chatId)
        .single();
      if (!cErr) setChat(c);
    })();
  }, [chatId]);

  // carrega mensagens iniciais
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender, content, created_at')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      if (!error) setMessages(data || []);
    })();
  }, [chatId]);

  // subscribe realtime
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:messages:${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
        payload => {
          setMessages(prev => [...prev, payload.new]);
          // scroll bottom
          setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !me) return;
    const { error } = await supabase
      .from('messages')
      .insert([{ chat_id: Number(chatId), sender: me, content: trimmed }]);
    if (!error) setInput('');
  };

  return (
    <div className="container mx-auto max-w-3xl p-6 flex flex-col h-[80vh]">
      <h1 className="text-xl font-semibold mb-4">Chat</h1>

      <div ref={listRef} className="flex-1 overflow-y-auto border rounded p-4 space-y-3">
        {messages.map(m => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded px-3 py-2 ${
              m.sender === me ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            title={new Date(m.created_at).toLocaleString()}
          >
            {m.content}
          </div>
        ))}
        {messages.length === 0 && <div className="text-gray-500">Sem mensagens ainda.</div>}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escreva uma mensagem…"
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">Enviar</Button>
      </div>
    </div>
  );
};

export default ChatPage;
