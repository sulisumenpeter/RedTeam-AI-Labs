import { createServerSupabaseClient } from "./supabaseServer";
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
  const demoCookie = cookieStore.get("redteam_demo_session")?.value;

  // 1. Explicit Demo / Evaluation Session Check
  if (isDemoMode && demoCookie === "authenticated") {
    const demoWorkspaceId = targetWorkspaceId || "demo-legal-workspace-001";
    return {
      auth: {
        userId: "demo-evaluator-id",
        email: "evaluator@redteam-ai.internal",
        workspaceId: demoWorkspaceId,
        role: "ADMIN",
        isDemo: true,
      },
      errorResponse: null,
    };
  }

  // 2. Real Supabase Session Check
  if (!isSupabaseConfigured()) {
    if (isDemoMode) {
      // In demo mode without login cookie, return evaluation session
      const demoWorkspaceId = targetWorkspaceId || "demo-legal-workspace-001";
      return {
        auth: {
          userId: "demo-evaluator-id",
          email: "evaluator@redteam-ai.internal",
          workspaceId: demoWorkspaceId,
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

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        auth: null,
        errorResponse: NextResponse.json(
          { error: "Unauthorized: Active authenticated session required." },
          { status: 401 }
        ),
      };
    }

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
      // If user is authenticated but not yet assigned to any workspace, check if a default exists
      // or if they are the first user to bootstrap a workspace
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
            isDemo: false,
          },
          errorResponse: null,
        };
      }

      // Check for an open or default workspace
      const { data: defaultWorkspace } = await serverClient
        .from("workspaces")
        .select("id")
        .limit(1)
        .single();

      if (defaultWorkspace) {
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
        isDemo: false,
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

