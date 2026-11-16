import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
let client = null;
let configurationError = '';

// A failed connection should produce an error state instead of an endless spinner.
async function fetchWithTimeout(input, options = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const externalSignal = options.signal;
  if (externalSignal?.aborted) abort();
  externalSignal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 15000);
  try {
    return await fetch(input, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener('abort', abort);
  }
}

try {
  if (!url || !key || url.includes('YOUR_') || key.includes('YOUR_')) {
    throw new Error('Backend not configured. Follow docs/SUPABASE_SETUP.md and restart the development server.');
  }
  if (new URL(url).protocol !== 'https:') throw new Error('The Supabase URL must use HTTPS.');
  if (key.startsWith('sb_secret_')) throw new Error('Use the publishable key, never a secret key.');
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    global: { fetch: fetchWithTimeout },
  });
} catch (error) {
  configurationError = error.message;
}

export const supabase = client;
export const setupError = configurationError;
export function getClient() {
  if (!client) throw new Error(configurationError);
  return client;
}
