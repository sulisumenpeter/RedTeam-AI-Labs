import { NextResponse } from "next/server";
import { PolicyService } from "../../../lib/services/policyService";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "policies:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view policies." },
        { status: 403 }
      );
    }

    const policies = await PolicyService.getPolicies(auth.workspaceId);
    return NextResponse.json({ policies });
  } catch (error: any) {
    console.error("Fetch Policies Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch policies", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, body.workspace_id);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "policies:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to create or modify policies." },
        { status: 403 }
      );
    }

    const policy = await PolicyService.createPolicy({
      ...body,
      workspace_id: auth.workspaceId,
    });

    await AuditService.logEvent({
      workspace_id: auth.workspaceId,
      actor_email: auth.email,
      action: "POLICY_CREATED",
      entity_type: "POLICY",
      entity_id: policy.id,
      details: { name: policy.name, version: policy.version, requirementsCount: policy.requirements?.length },
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error: any) {
    console.error("Policy Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to persist policy", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
