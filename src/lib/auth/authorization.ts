import { cleanEnv, createServerSupabaseClient } from "./supabaseServer";
import { extractUserFromCookies } from "./supabaseCookie";
import {
  SANDBOX_COOKIE_NAME,
  SANDBOX_DEFAULT_EMAIL,
  SANDBOX_WORKSPACE_ID,
  verifySignedSandboxToken,
} from "./sandboxToken";
import { getSupabaseServerClient, isSupabaseConfigured } from "../db/supabaseServer";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type WorkspaceRole = "OWNER" | "ADMIN" | "ASSESSOR" | "VIEWER";

export type Permission =
  | "systems:read"
  | "systems:write"
  | "systems:delete"
  | "risks:read"
  | "risks:write"
  | "policies:read"
  | "policies:write"
  | "policies:delete"
  | "frameworks:read"
  | "campaigns:read"
  | "campaigns:write"
  | "campaigns:execute"
  | "campaigns:delete"
  | "incidents:read"
  | "incidents:write"
  | "evidence:read"
  | "evidence:write"
  | "workspaces:manage";

export const ROLE_PERMISSIONS: Record<WorkspaceRole, readonly Permission[]> = {
  OWNER: [
    "systems:read",
    "systems:write",
    "systems:delete",
    "risks:read",
    "risks:write",
    "policies:read",
    "policies:write",
    "policies:delete",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "campaigns:delete",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
    "workspaces:manage",
  ],
  ADMIN: [
    "systems:read",
    "systems:write",
    "systems:delete",
    "risks:read",
    "risks:write",
    "policies:read",
    "policies:write",
    "policies:delete",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "campaigns:delete",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
  ],
  ASSESSOR: [
    "systems:read",
    "systems:write",
    "risks:read",
    "risks:write",
    "policies:read",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
  ],
  VIEWER: [
    "systems:read",
    "risks:read",
    "policies:read",
    "frameworks:read",
    "campaigns:read",
    "incidents:read",
    "evidence:read",
  ],
};

export function hasPermission(role: WorkspaceRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export interface AuthContext {
  userId: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
  isDemo: boolean;
}

function getCookieFromReqOrStore(
  cookieStore: ReturnType<typeof cookies>,
  req: Request | NextRequest | undefined,
  cookieName: string
): string | undefined {
  const fromStore = cookieStore.get(cookieName)?.value;
  if (fromStore) return fromStore;
  const raw = req && (req as any).headers?.get?.("cookie");
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx > 0 && part.slice(0, eqIdx).trim() === cookieName) {
      return decodeURIComponent(part.slice(eqIdx + 1).trim());
    }
  }
  return undefined;
}

/**
 * Validates request authentication and workspace membership.
 * Defends against Insecure Direct Object References (IDOR) by verifying that
 * the caller has legitimate membership in the requested workspace.
 */
export async function getAuthenticatedUserAndWorkspace(
  req?: Request | NextRequest,
  targetWorkspaceId?: string
): Promise<{ auth: AuthContext | null; errorResponse: NextResponse | null }> {
  const cookieStore = cookies();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true";
  const sandboxEmail = cleanEnv(process.env.DEMO_SANDBOX_EMAIL) || SANDBOX_DEFAULT_EMAIL;

  // 1. Offline / Unconfigured Mode (requires explicit DEMO_MODE)
  if (!isSupabaseConfigured()) {
    const demoCookie = getCookieFromReqOrStore(cookieStore, req, "redteam_demo_session");
    const sandboxCookie = getCookieFromReqOrStore(cookieStore, req, SANDBOX_COOKIE_NAME);
    const hasValidSandboxCookie = await verifySignedSandboxToken(sandboxCookie);

    if (isDemoMode || (demoCookie === "authenticated" && isDemoMode) || hasValidSandboxCookie) {
      if (targetWorkspaceId && targetWorkspaceId !== SANDBOX_WORKSPACE_ID) {
        return {
          auth: null,
          errorResponse: NextResponse.json(
            { error: "Forbidden: Sandbox evaluation session cannot access external workspaces." },
            { status: 403 }
          ),
        };
      }
      return {
        auth: {
          userId: "sandbox-evaluator-id",
          email: sandboxEmail,
          workspaceId: SANDBOX_WORKSPACE_ID,
          role: "ADMIN",
          isDemo: true,
        },
        errorResponse: null,
      };
    }

    return {
      auth: null,
      errorResponse: NextResponse.json(
        { error: "Authentication service not configured. Database credentials missing." },
        { status: 503 }
      ),
    };
  }

  // 2. Live Supabase + PostgreSQL Engine Authentication
  try {
    const supabase = createServerSupabaseClient();
    let user = null;
    let userError = null;

    try {
      const res = await supabase.auth.getUser();
      user = res.data?.user;
      userError = res.error;
    } catch (err: any) {
      userError = err;
    }

    // If remote Auth endpoint rate limits or fails, recover user identity from local cookie session
    if (!user) {
      let cookiesList = cookieStore.getAll();
      if ((!cookiesList || cookiesList.length === 0) && req && (req as any).headers) {
        const raw = (req as any).headers.get("cookie");
        if (raw) {
          cookiesList = raw.split(";").map((p: string) => {
            const [k, ...v] = p.trim().split("=");
            return { name: k, value: v.join("=") };
          });
        }
      }
      const recovered = extractUserFromCookies(cookiesList);
      if (recovered) {
        user = recovered as any;
        userError = null;
      }
    }

    // Check cryptographically signed 1-Click Sandbox fallback session (or explicit demo cookie)
    if (userError || !user) {
      const sandboxCookie = getCookieFromReqOrStore(cookieStore, req, SANDBOX_COOKIE_NAME);
      const demoCookie = getCookieFromReqOrStore(cookieStore, req, "redteam_demo_session");
      const hasValidSandboxCookie = await verifySignedSandboxToken(sandboxCookie);

      if (hasValidSandboxCookie || (isDemoMode && demoCookie === "authenticated")) {
        const serverClient = getSupabaseServerClient();
        const { data: demoWs } = await serverClient
          .from("workspaces")
          .select("id")
          .eq("is_demo", true)
          .limit(1)
          .maybeSingle();

        const sandboxWorkspaceId = demoWs?.id || SANDBOX_WORKSPACE_ID;

        if (targetWorkspaceId && targetWorkspaceId !== sandboxWorkspaceId) {
          return {
            auth: null,
            errorResponse: NextResponse.json(
              { error: "Forbidden: Sandbox evaluation session is isolated to the sandbox workspace." },
              { status: 403 }
            ),
          };
        }

        return {
          auth: {
            userId: "sandbox-evaluator-id",
            email: sandboxEmail,
            workspaceId: sandboxWorkspaceId,
            role: "ADMIN",
            isDemo: true,
          },
          errorResponse: null,
        };
      }

      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "Unauthorized: Active authenticated session required." },
          { status: 401 }
        ),
      };
    }

    const isSandboxUser = Boolean(
      user.email && user.email.toLowerCase() === sandboxEmail.toLowerCase()
    );

    // Query workspace membership using server client
    const serverClient = getSupabaseServerClient();
    let memberQuery = serverClient
      .from("workspace_members")
      .select("workspace_id, role")
      .eq("user_id", user.id);

    if (targetWorkspaceId) {
      memberQuery = memberQuery.eq("workspace_id", targetWorkspaceId);
    }

    const { data: memberships, error: memberError } = await memberQuery;

    if (memberError || !memberships || memberships.length === 0) {
      // Verify if user belongs to another workspace (IDOR defense)
      const { data: anyMember } = await serverClient
        .from("workspace_members")
        .select("workspace_id, role")
        .eq("user_id", user.id)
        .limit(1);

      if (anyMember && anyMember.length > 0) {
        if (targetWorkspaceId && anyMember[0].workspace_id !== targetWorkspaceId) {
          return {
            auth: null,
            errorResponse: NextResponse.json(
              { error: "Forbidden: You do not have permission to access the requested workspace." },
              { status: 403 }
            ),
          };
        }
        return {
          auth: {
            userId: user.id,
            email: user.email || "",
            workspaceId: anyMember[0].workspace_id,
            role: (anyMember[0].role as WorkspaceRole) || "VIEWER",
            isDemo: isSandboxUser,
          },
          errorResponse: null,
        };
      }

      // If sandbox evaluator has no membership row yet, bind strictly to is_demo workspace
      if (isSandboxUser) {
        const { data: demoWs } = await serverClient
          .from("workspaces")
          .select("id")
          .eq("is_demo", true)
          .limit(1)
          .maybeSingle();

        const sandboxWorkspaceId = demoWs?.id || SANDBOX_WORKSPACE_ID;

        if (targetWorkspaceId && targetWorkspaceId !== sandboxWorkspaceId) {
          return {
            auth: null,
            errorResponse: NextResponse.json(
              { error: "Forbidden: Sandbox evaluator is isolated to the sandbox workspace." },
              { status: 403 }
            ),
          };
        }

        await serverClient.from("workspace_members").insert({
          workspace_id: sandboxWorkspaceId,
          user_id: user.id,
          role: "ADMIN",
          email: user.email || sandboxEmail,
          full_name: "Sandbox Evaluator",
        });

        return {
          auth: {
            userId: user.id,
            email: user.email || sandboxEmail,
            workspaceId: sandboxWorkspaceId,
            role: "ADMIN",
            isDemo: true,
          },
          errorResponse: null,
        };
      }

      // Check for an open or default workspace for newly signed-up standard users
      const { data: defaultWorkspace } = await serverClient
        .from("workspaces")
        .select("id")
        .limit(1)
        .single();

      if (defaultWorkspace) {
        if (targetWorkspaceId && defaultWorkspace.id !== targetWorkspaceId) {
          return {
            auth: null,
            errorResponse: NextResponse.json(
              { error: "Forbidden: You do not have permission to access the requested workspace." },
              { status: 403 }
            ),
          };
        }

        // Automatically join the primary workspace as ASSESSOR
        await serverClient.from("workspace_members").insert({
          workspace_id: defaultWorkspace.id,
          user_id: user.id,
          role: "ASSESSOR",
        });

        return {
          auth: {
            userId: user.id,
            email: user.email || "",
            workspaceId: defaultWorkspace.id,
            role: "ASSESSOR",
            isDemo: false,
          },
          errorResponse: null,
        };
      }

      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "No active workspace found for this account. Contact workspace administrator." },
          { status: 403 }
        ),
      };
    }

    const activeMembership = memberships[0];

    return {
      auth: {
        userId: user.id,
        email: user.email || "",
        workspaceId: activeMembership.workspace_id,
        role: (activeMembership.role as WorkspaceRole) || "VIEWER",
        isDemo: isSandboxUser,
      },
      errorResponse: null,
    };
  } catch (err: any) {
    return {
      auth: null,
      errorResponse: NextResponse.json(
        { error: "Authentication validation failed: " + (err.message || "Internal server error") },
        { status: 500 }
      ),
    };
  }
}

