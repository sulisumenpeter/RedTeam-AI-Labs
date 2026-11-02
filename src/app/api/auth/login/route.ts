import { createServerSupabaseClient } from "../../../../lib/auth/supabaseServer";
import { isSupabaseConfigured } from "../../../../lib/db/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  isDemo: z.boolean().optional(),
  action: z.enum(["signin", "signup"]).optional().default("signin"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials: email must be valid and password at least 6 characters." },
        { status: 400 }
      );
    }

    const { email, password, isDemo, action } = parsed.data;
    const isDemoModeAllowed =
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true";

    // Explicit Demo Mode handling
    if (isDemo) {
      if (!isDemoModeAllowed) {
        return NextResponse.json(
          { error: "Demo evaluation mode is not enabled in this environment. Please authenticate with valid credentials." },
          { status: 403 }
        );
      }

      const cookieStore = cookies();
      cookieStore.set("redteam_demo_session", "authenticated", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        user: {
          id: "demo-evaluator-id",
          email: "evaluator@redteam-ai.internal",
          role: "ADMIN",
        },
        workspace: {
          id: "demo-legal-workspace-001",
          name: "Legal AI Evaluation Workspace",
          role: "ADMIN",
        },
        isDemo: true,
      });
    }

    // Real Supabase Authentication
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase database is not configured in this environment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or set NEXT_PUBLIC_DEMO_MODE=true for evaluation mode.",
        },
        { status: 503 }
      );
    }

    const supabase = createServerSupabaseClient();

    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: data.user,
        message: data.session
          ? "Account created successfully."
          : "Account created. Please check your email for confirmation.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Login failed: " + (err.message || "Internal error") },
      { status: 500 }
    );
  }
}
