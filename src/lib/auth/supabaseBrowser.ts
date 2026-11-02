import { createBrowserClient } from "@supabase/ssr";
import { cleanEnv } from "./supabaseServer";

let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client using @supabase/ssr.
 * Authenticates user requests from the browser, syncing session cookies with Next.js server.
 */
export function createBrowserSupabaseClient() {
  const supabaseUrl =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://placeholder-url.supabase.co";
  const supabaseAnonKey =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "placeholder-anon-key";

  if (typeof window === "undefined") {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (browserClientInstance) {
    return browserClientInstance;
  }

  browserClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClientInstance;
}


