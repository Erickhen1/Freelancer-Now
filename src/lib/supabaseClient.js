import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucxoxkgjiesocvkhkrhg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjeG94a2dqaWVzb2N2a2hrcmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNjE5MjgsImV4cCI6MjA3NTYzNzkyOH0._CIZ-dmno4u3T3loyvDW3FNAtJqXDy7rjPVE_gWFg3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
