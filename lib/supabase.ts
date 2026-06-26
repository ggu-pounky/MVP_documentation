import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client Supabase pour le frontend (utilisé dans les composants React)
export const createClient = () => {
  return createClient(supabaseUrl, supabaseKey);
};
