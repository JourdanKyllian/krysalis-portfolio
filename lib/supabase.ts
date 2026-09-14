import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Initialisation de l'instance client Supabase publique (Singleton).
 */
export const supabase = supabaseUrl && supabasePublishableKey 
  ? createClient(supabaseUrl, supabasePublishableKey)
  : (null as unknown as ReturnType<typeof createClient>);
