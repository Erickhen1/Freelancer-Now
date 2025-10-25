import { createClient } from '@supabase/supabase-js';

// Lê as variáveis de ambiente configuradas no Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as chaves foram carregadas (para debug local)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não carregadas. Verifique .env ou Netlify.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
