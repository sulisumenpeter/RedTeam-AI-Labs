import { NextResponse } from "next/server";
import { AISystemService } from "../../../lib/services/aiSystemService";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "systems:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view AI systems." },
        { status: 403 }
      );
    }

    const systems = await AISystemService.getAISystems(auth.workspaceId);
    return NextResponse.json({ systems });
  } catch (error: any) {
    console.error("Fetch Systems Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI systems", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, body.workspace_id);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "systems:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to register AI systems." },
        { status: 403 }
      );
    }

    const system = await AISystemService.registerAISystem({
      ...body,
      workspace_id: auth.workspaceId,
    });

    await AuditService.logEvent({
      workspace_id: auth.workspaceId,
      actor_email: auth.email,
      action: "AI_SYSTEM_REGISTERED",
      entity_type: "AI_SYSTEM",
      entity_id: system.id,
      details: { name: system.name, model: system.model_name, classification: system.risk_classification },
    });

    return NextResponse.json(system, { status: 201 });
  } catch (error: any) {
    console.error("System Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register AI system", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
