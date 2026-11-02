import { isSupabaseConfigured } from "./supabaseServer";

export function isExplicitDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true";
}

/**
 * Determines whether the application should operate in in-memory demo mode
 * or strictly require persistent database storage.
 *
 * Rules:
 * 1. If Supabase is configured and demo mode is NOT forced, persistence is strictly required.
 * 2. If Supabase is configured and demo mode IS enabled, demo store is only used if explicit demo flag is active.
 * 3. If Supabase is NOT configured, demo mode is ONLY allowed if NEXT_PUBLIC_DEMO_MODE is true.
 * 4. If Supabase is NOT configured and demo mode is NOT true, an explicit error is thrown.
 */
export function assertPersistenceMode(forceDemoCheck = false): "DATABASE" | "DEMO_STORE" {
  const configured = isSupabaseConfigured();
  const demoAllowed = isExplicitDemoMode();

  if (forceDemoCheck && demoAllowed) {
    return "DEMO_STORE";
  }

  if (configured) {
    return "DATABASE";
  }

  if (demoAllowed) {
    return "DEMO_STORE";
  }

  throw new Error(
    "Database persistence failure: Supabase credentials are missing or unconfigured in the current environment. " +
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or explicitly set NEXT_PUBLIC_DEMO_MODE=true for fellowship evaluation."
  );
}

