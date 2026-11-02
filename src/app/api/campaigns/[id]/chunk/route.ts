import { NextResponse } from "next/server";
import { CampaignService } from "../../../../../lib/services/campaignService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "campaigns:execute")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to execute test campaign." },
        { status: 403 }
      );
    }

    let batchSize = 5;
    try {
      const body = await req.json();
      if (body?.batch_size && typeof body.batch_size === "number") {
        batchSize = Math.min(10, Math.max(1, body.batch_size));
      }
    } catch {
      // Body may be empty in some polling scenarios
    }

    const campaignId = params.id;
    const result = await CampaignService.processChunk(campaignId, batchSize);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Chunk Processing Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process campaign chunk",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
