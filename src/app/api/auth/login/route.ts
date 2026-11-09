import { createServerSupabaseClient } from "../../../../lib/auth/supabaseServer";
import { isSupabaseConfigured, getSupabaseServerClient } from "../../../../lib/db/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";

const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    isDemo: z.boolean().optional(),
    action: z.enum(["signin", "signup"]).optional().default("signin"),
  })
  .refine(
    (data) => {
      if (data.isDemo) return true;
      return Boolean(data.email && data.password && data.password.length >= 6);
    },
    {
      message: "Invalid credentials: email must be valid and password at least 6 characters.",
    }
  );

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
      // 1. Attempt admin creation with email confirmed so user can access immediately
      const serverAdmin = getSupabaseServerClient();
      let createdUser = null;

      try {
        const { data: adminUserData, error: adminCreateError } =
          await serverAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });

        if (adminCreateError) {
          const errorMsg = adminCreateError.message?.toLowerCase() || "";
          if (
            errorMsg.includes("already registered") ||
            errorMsg.includes("already exists") ||
            errorMsg.includes("unique")
          ) {
            return NextResponse.json(
              { error: "An account with this email already exists. Please sign in instead." },
              { status: 400 }
            );
          }
          // If admin creation had an error, fall back to standard signUp
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 });
          }
          createdUser = signUpData.user;
        } else {
          createdUser = adminUserData.user;
        }
      } catch (err: any) {
        // Fallback to standard signUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          return NextResponse.json({ error: signUpError.message }, { status: 400 });
        }
        createdUser = signUpData.user;
      }

      // Automatically sign in the newly registered user to establish the session cookies
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.user) {
        return NextResponse.json({
          success: true,
          user: createdUser,
          message: "Account created successfully. You can now sign in with your credentials.",
        });
      }

      return NextResponse.json({
        success: true,
        user: signInData.user,
        message: "Account created successfully.",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      const isInvalidCredentials =
        error?.message?.toLowerCase().includes("invalid login credentials") ||
        error?.message?.toLowerCase().includes("invalid credentials");

      return NextResponse.json(
        {
          error: isInvalidCredentials
            ? "Invalid email or password. If you don't have an account yet, click 'Create Account' above."
            : error?.message || "Invalid email or password.",
        },
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
