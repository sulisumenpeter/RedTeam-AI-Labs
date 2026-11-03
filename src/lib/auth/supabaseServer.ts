import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { extractUserFromCookies } from "./supabaseCookie";

/**
 * Strips surrounding whitespace and double/single quotes from environment variables.
 */
export function cleanEnv(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

/**
 * Server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Manages authenticated user sessions using secure HTTP-only cookies.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  const supabaseUrl =
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://placeholder-url.supabase.co";

  // Use NEXT_PUBLIC_SUPABASE_ANON_KEY if valid, otherwise fallback securely to SUPABASE_SERVICE_ROLE_KEY on the server
  const rawAnon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const rawService = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabaseKey =
    rawAnon && !rawAnon.includes("placeholder")
      ? rawAnon
      : rawService || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Never delete auth cookies during read-only session lookups or transient 429 rate limits.
            // Explicit sign out is handled unconditionally by /api/auth/logout via cookieStore.delete().
            if ((!value || options?.maxAge === 0) && name.includes("-auth-token")) {
              return;
            }
            cookieStore.set(name, value, options as CookieOptions);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // Ignored because middleware will refresh cookies.
        }
      },
    },
  });
}

