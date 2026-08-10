import { createClient } from '@supabase/supabase-js';

export function getSupabaseCredentials() {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('homesync_supabase_url') || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('homesync_supabase_key') || '';
  const isConfigured = Boolean(url && key && !url.includes('your-project'));
  return { url, key, isConfigured };
}

const { url, key, isConfigured } = getSupabaseCredentials();

export const supabase = isConfigured
  ? createClient(url, key)
  : null;

export const isSupabaseConnected = isConfigured;
