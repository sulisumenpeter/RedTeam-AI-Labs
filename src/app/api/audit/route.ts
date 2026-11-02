import { NextResponse } from "next/server";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "evidence:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view audit events." },
        { status: 403 }
      );
    }

    const auditEvents = await AuditService.getAuditEvents(auth.workspaceId);
    return NextResponse.json({ auditEvents });
  } catch (error: any) {
    console.error("Fetch Audit Events Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit log", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
