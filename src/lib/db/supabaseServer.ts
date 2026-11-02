import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverClientInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClientInstance) {
    return serverClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("mock-xyz") || supabaseUrl.includes("placeholder")) {
    // If not properly configured, create a client with fallback to prevent import crashes,
    // but individual service operations will check and fall back gracefully to local store.
    serverClientInstance = createClient(
      supabaseUrl || "https://placeholder-url.supabase.co",
      serviceRoleKey || "placeholder-key"
    );
    return serverClientInstance;
  }

  serverClientInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClientInstance;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && !url.includes("mock-xyz") && !url.includes("placeholder") && !key.includes("mock-key"));
}

