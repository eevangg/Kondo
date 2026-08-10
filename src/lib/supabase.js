import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from env or local storage configuration
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('homesync_supabase_url');
  const localKey = localStorage.getItem('homesync_supabase_anon_key');

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isConfigured = Boolean(url && key && url.includes('supabase.co'));

  return { url, key, isConfigured };
}

export function initSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return { supabase: null, isConfigured: false };
  }

  try {
    const supabase = createClient(url, key);
    return { supabase, isConfigured: true };
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return { supabase: null, isConfigured: false };
  }
}

export const { supabase, isConfigured: isSupabaseConnected } = initSupabaseClient();
