import { createServerSupabaseClient } from "../../../../lib/auth/supabaseServer";
import { isSupabaseConfigured } from "../../../../lib/db/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = cookies();

  // Clear demo session cookie if set
  cookieStore.delete("redteam_demo_session");

  // Sign out from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore if session already expired
    }
  }

  return NextResponse.json({ success: true });
}
