// Browser-side Supabase client (safe: uses the public anon key + RLS).
"use client";
import { createClient } from "@supabase/supabase-js";

let client = null;

export function supabaseBrowser() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: true, detectSessionInUrl: true } }
    );
  }
  return client;
}

export async function getToken() {
  const { data } = await supabaseBrowser().auth.getSession();
  return data.session?.access_token || null;
}
