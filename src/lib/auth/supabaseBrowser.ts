import { createBrowserClient } from "@supabase/ssr";

let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client using @supabase/ssr.
 * Authenticates user requests from the browser, syncing session cookies with Next.js server.
 */
export function createBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    // In server rendering fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (browserClientInstance) {
    return browserClientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  browserClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClientInstance;
}

