import { createClient } from '@supabase/supabase-js';

export function getSupabaseCredentials() {
  const url = localStorage.getItem('homesync_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem('homesync_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const isConfigured = Boolean(url && key);
  return { url, key, isConfigured };
}

export function saveSupabaseCredentials(url, key) {
  localStorage.setItem('homesync_supabase_url', url.trim());
  localStorage.setItem('homesync_supabase_key', key.trim());
}

export function clearSupabaseCredentials() {
  localStorage.removeItem('homesync_supabase_url');
  localStorage.removeItem('homesync_supabase_key');
}

const { url, key, isConfigured } = getSupabaseCredentials();

export const supabase = isConfigured
  ? createClient(url, key)
  : null;

export const isSupabaseConnected = isConfigured;
