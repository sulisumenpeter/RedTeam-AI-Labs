import { createClient } from "@supabase/supabase-js";
import { cleanEnv } from "../auth/supabaseServer";

const supabaseUrl =
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://placeholder-url.supabase.co";
const supabaseAnonKey =
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || "placeholder-anon-key";

/**
 * Client-safe Supabase client (only uses public anon key, never service-role key).
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);


