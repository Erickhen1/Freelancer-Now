import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vutjlolwnfxnnmjtmidr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dGpsb2x3bmZ4bm5tanRtaWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjE5NTUsImV4cCI6MjA2NDAzNzk1NX0.6CgCO_PCSEo6YBhnetjS5IO0tFVpzynMf_uMAXVaDGA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
