import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const supabaseConfigured = Boolean(url && key);

// Untuk server (baca konten publik): tanpa sesi.
export function publicClient(): SupabaseClient {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Untuk browser (form dan admin): satu instance, sesi login disimpan di browser.
let browser: SupabaseClient | null = null;
export function browserClient(): SupabaseClient {
  if (!browser) browser = createClient(url, key);
  return browser;
}
