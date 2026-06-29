import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
  throw new Error('Variables d\'environnement Supabase manquantes');
}

// Client Supabase pour le frontend (utilisé dans les composants React)
export const getSupabaseClient = () => {
  const client = createClient(supabaseUrl, supabaseKey);
  
  // Log pour débogage (optionnel)
  console.log('Supabase client créé avec:', {
    url: supabaseUrl,
    hasKey: !!supabaseKey,
  });
  
  return client;
};
