import { NextResponse } from "next/server";
import { RiskService } from "../../../lib/services/riskService";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "risks:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view risk assessment." },
        { status: 403 }
      );
    }

    const summary = await RiskService.getRiskAssessmentSummary(auth.workspaceId);
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Fetch Risks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch risk assessment", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, body.workspace_id);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "risks:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to record risks." },
        { status: 403 }
      );
    }

    const risk = await RiskService.createRisk({
      ...body,
      workspace_id: auth.workspaceId,
    });

    await AuditService.logEvent({
      workspace_id: auth.workspaceId,
      actor_email: auth.email,
      action: "RISK_LOGGED",
      entity_type: "RISK",
      entity_id: risk.id,
      details: { title: risk.title, inherentScore: risk.inherent_score, residualScore: risk.residual_score },
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error: any) {
    console.error("Risk Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to record risk", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
