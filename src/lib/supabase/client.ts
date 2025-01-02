import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase config:', {
  url: supabaseUrl,
  anonKey: supabaseAnonKey?.substring(0, 8) + '...' // On ne montre que le début de la clé pour la sécurité
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
