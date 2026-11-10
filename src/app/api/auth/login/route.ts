import { cleanEnv, createServerSupabaseClient } from "../../../../lib/auth/supabaseServer";
import { isSupabaseConfigured, getSupabaseServerClient } from "../../../../lib/db/supabaseServer";
import {
  SANDBOX_COOKIE_NAME,
  SANDBOX_DEFAULT_EMAIL,
  SANDBOX_WORKSPACE_ID,
  DEMO_MEMORY_WORKSPACE_ID,
  createSignedSandboxToken,
  deriveSandboxPassword,
} from "../../../../lib/auth/sandboxToken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

export const dynamic = "force-dynamic";

const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    isDemo: z.boolean().optional(),
    isSandbox: z.boolean().optional(),
    action: z.enum(["signin", "signup"]).optional().default("signin"),
  })
  .refine(
    (data) => {
      if (data.isDemo || data.isSandbox) return true;
      return Boolean(data.email && data.password && data.password.length >= 6);
    },
    {
      message: "Invalid credentials: email must be valid and password at least 6 characters.",
    }
  );

async function ensureSandboxWorkspaceMembership(
  serverAdmin: ReturnType<typeof getSupabaseServerClient>,
  userId: string,
  email: string,
  workspaceId: string
) {
  const { data: existing } = await serverAdmin
    .from("workspace_members")
    .select("id, role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!existing) {
    await serverAdmin.from("workspace_members").insert({
      workspace_id: workspaceId,
      user_id: userId,
      role: "ADMIN",
      email,
      full_name: "Sandbox Evaluator",
    });
  }
}

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

    const { email, password, isDemo, isSandbox, action } = parsed.data;
    const isDemoModeAllowed =
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true";
    const cookieStore = cookies();

    // 1. Live 1-Click Evaluator Sandbox or Evaluation Demo Mode
    if (isSandbox || isDemo) {
      // Offline / unconfigured fallback path
      if (!isSupabaseConfigured()) {
        if (!isDemoModeAllowed) {
          return NextResponse.json(
            {
              error:
                "Live Supabase engine is not configured and offline demo mode is disabled. Please configure Supabase credentials or enable NEXT_PUBLIC_DEMO_MODE=true.",
            },
            { status: 403 }
          );
        }

        cookieStore.set("redteam_demo_session", "authenticated", {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
          success: true,
          user: {
            id: "demo-evaluator-id",
            email: "evaluator@redteam-ai.internal",
            role: "ADMIN",
          },
          workspace: {
            id: DEMO_MEMORY_WORKSPACE_ID,
            name: "Legal AI Evaluation Workspace",
            role: "ADMIN",
          },
          isDemo: true,
          isSandbox: true,
        });
      }

      // Live Supabase + PostgreSQL Sandbox Engine
      if (isDemo && !isSandbox && !isDemoModeAllowed) {
        return NextResponse.json(
          { error: "Demo evaluation mode is not enabled in this environment. Please authenticate with valid credentials." },
          { status: 403 }
        );
      }

      const serverAdmin = getSupabaseServerClient();

      // Locate pre-configured seeded sandbox workspace (is_demo = true)
      const { data: demoWorkspace } = await serverAdmin
        .from("workspaces")
        .select("id, name")
        .eq("is_demo", true)
        .limit(1)
        .maybeSingle();

      const sandboxWorkspaceId = demoWorkspace?.id || SANDBOX_WORKSPACE_ID;
      const sandboxWorkspaceName = demoWorkspace?.name || "Legal AI Assurance Sandbox";

      const envSandboxEmail = cleanEnv(process.env.DEMO_SANDBOX_EMAIL);
      const envSandboxPassword = cleanEnv(process.env.DEMO_SANDBOX_PASSWORD);
      const sandboxEmail = envSandboxEmail || SANDBOX_DEFAULT_EMAIL;
      const sandboxPassword = envSandboxPassword || (await deriveSandboxPassword(sandboxEmail));

      const supabase = createServerSupabaseClient();

      // Attempt primary Supabase Auth session issuance for sandbox evaluator
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: sandboxEmail,
        password: sandboxPassword,
      });

      // Provision or sync sandbox evaluator account on first use
      if (authError || !authData?.user) {
        const isRateLimited =
          authError?.status === 429 ||
          authError?.code === "over_request_rate_limit";

        if (!isRateLimited) {
          let sandboxUserId: string | null = null;

          const { data: createdData, error: createErr } = await serverAdmin.auth.admin.createUser({
            email: sandboxEmail,
            password: sandboxPassword,
            email_confirm: true,
            user_metadata: { is_sandbox: true, role: "SANDBOX_EVALUATOR" },
          });

          if (!createErr && createdData?.user) {
            sandboxUserId = createdData.user.id;
          } else {
            // Find existing user and sync derived password if using internal derived credential
            const { data: listed } = await serverAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
            const listedUsers = (listed?.users ?? []) as Array<{ id: string; email?: string }>;
            const existingUser = listedUsers.find(
              (u) => u.email?.toLowerCase() === sandboxEmail.toLowerCase()
            );
            if (existingUser) {
              sandboxUserId = existingUser.id;
              if (!envSandboxPassword) {
                await serverAdmin.auth.admin.updateUserById(existingUser.id, {
                  password: sandboxPassword,
                  email_confirm: true,
                });
              }
            }
          }

          if (sandboxUserId) {
            await ensureSandboxWorkspaceMembership(
              serverAdmin,
              sandboxUserId,
              sandboxEmail,
              sandboxWorkspaceId
            );
            const retry = await supabase.auth.signInWithPassword({
              email: sandboxEmail,
              password: sandboxPassword,
            });
            authData = retry.data;
            authError = retry.error;
          }
        }
      }

      if (authData?.user) {
        await ensureSandboxWorkspaceMembership(
          serverAdmin,
          authData.user.id,
          sandboxEmail,
          sandboxWorkspaceId
        );
        cookieStore.delete("redteam_demo_session");
        cookieStore.delete(SANDBOX_COOKIE_NAME);

        return NextResponse.json({
          success: true,
          user: {
            id: authData.user.id,
            email: authData.user.email || sandboxEmail,
            role: "ADMIN",
          },
          workspace: {
            id: sandboxWorkspaceId,
            name: sandboxWorkspaceName,
            role: "ADMIN",
          },
          isDemo: true,
          isSandbox: true,
        });
      }

      // Resilient signed sandbox session fallback if Supabase Auth rate limits concurrent evaluators
      const signedSandboxToken = await createSignedSandboxToken(60 * 60 * 24);
      if (signedSandboxToken) {
        cookieStore.delete("redteam_demo_session");
        cookieStore.getAll().forEach((c) => {
          if (c.name.includes("-auth-token")) {
            cookieStore.delete(c.name);
          }
        });
        cookieStore.set(SANDBOX_COOKIE_NAME, signedSandboxToken, {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({
          success: true,
          user: {
            id: "sandbox-evaluator-id",
            email: sandboxEmail,
            role: "ADMIN",
          },
          workspace: {
            id: sandboxWorkspaceId,
            name: sandboxWorkspaceName,
            role: "ADMIN",
          },
          isDemo: true,
          isSandbox: true,
        });
      }

      return NextResponse.json(
        { error: authError?.message || "Unable to initialize live sandbox session." },
        { status: 500 }
      );
    }

    // 2. Real Email/Password Supabase Authentication
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase database is not configured in this environment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or set NEXT_PUBLIC_DEMO_MODE=true for evaluation mode.",
        },
        { status: 503 }
      );
    }

    // Clear any stale sandbox/demo cookies when signing into a standard account
    cookieStore.delete("redteam_demo_session");
    cookieStore.delete(SANDBOX_COOKIE_NAME);

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
            email: email!,
            password: password!,
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
          email: email!,
          password: password!,
        });

        if (signUpError) {
          return NextResponse.json({ error: signUpError.message }, { status: 400 });
        }
        createdUser = signUpData.user;
      }

      // Automatically sign in the newly registered user to establish the session cookies
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email!,
        password: password!,
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
      email: email!,
      password: password!,
    });

    if (error || !data.user) {
      const isInvalidCredentials =
        error?.message?.toLowerCase().includes("invalid login credentials") ||
        error?.message?.toLowerCase().includes("invalid credentials");

      return NextResponse.json(
        {
          error: isInvalidCredentials
            ? "Invalid email or password. If you don't have an account yet, click 'Early Access Registration' above."
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
