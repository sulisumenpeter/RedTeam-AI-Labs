import { NextResponse } from "next/server";
import { CampaignService } from "../../../lib/services/campaignService";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      workspace_id,
      ai_system_id,
      policy_id,
      policy_version,
      target_type,
      target_version,
      random_seed,
      execution_mode,
    } = body;

    if (!policy_id) {
      return NextResponse.json(
        { error: "policy_id is required to create an assessment campaign." },
        { status: 400 }
      );
    }

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, workspace_id);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "campaigns:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to create assessment campaigns." },
        { status: 403 }
      );
    }

    const result = await CampaignService.createCampaign({
      name,
      workspace_id: auth.workspaceId,
      ai_system_id,
      policy_id,
      policy_version,
      target_type,
      target_version,
      random_seed: random_seed || 42,
      execution_mode: execution_mode || "DEMO_SYNTHETIC",
    });

    await AuditService.logEvent({
      workspace_id: auth.workspaceId,
      actor_email: auth.email,
      action: "CAMPAIGN_CREATED",
      entity_type: "CAMPAIGN",
      entity_id: result.id,
      details: { name, policy_id, testCount: result.count },
    });

    return NextResponse.json(
      { id: result.id, success: true, count: result.count, message: "Campaign created and test plan generated." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Campaign Creation Error:", error);
    return NextResponse.json(
      {
        error: "Failed to create campaign",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
