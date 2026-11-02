import { NextResponse } from "next/server";
import { EvidenceService } from "../../../lib/services/evidenceService";
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
        { error: "Forbidden: Insufficient privileges to view compliance evidence." },
        { status: 403 }
      );
    }

    const evidence = await EvidenceService.getEvidence(auth.workspaceId);
    return NextResponse.json({ evidence });
  } catch (error: any) {
    console.error("Fetch Evidence Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
