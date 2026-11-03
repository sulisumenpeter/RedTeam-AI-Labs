import { createServerSupabaseClient } from "../../../../lib/auth/supabaseServer";
import { isSupabaseConfigured } from "../../../../lib/db/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = cookies();

  // Clear demo session cookie if set
  cookieStore.delete("redteam_demo_session");

  // Explicitly clear all Supabase auth token cookies
  cookieStore.getAll().forEach((c) => {
    if (c.name.includes("-auth-token")) {
      cookieStore.delete(c.name);
    }
  });

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
