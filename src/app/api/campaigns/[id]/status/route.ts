import { NextResponse } from "next/server";
import { CampaignService } from "../../../../../lib/services/campaignService";
import { getDemoStore } from "../../../../../lib/db/inMemoryStore";
import { assertPersistenceMode } from "../../../../../lib/db/persistenceMode";
import { getSupabaseServerClient } from "../../../../../lib/db/supabaseServer";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "campaigns:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view campaign status." },
        { status: 403 }
      );
    }

    const campaignId = params.id;
    const mode = assertPersistenceMode();

    if (campaignId === "demo") {
      const demoDetails = await CampaignService.getCampaignDetails("demo");
      const findings = demoDetails.findings || [];
      const categoryBreakdown: Record<string, { total: number; completed: number }> = {};
      findings.forEach((f: any) => {
        const cat = f.category || "General";
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, completed: 0 };
        }
        categoryBreakdown[cat].total++;
        categoryBreakdown[cat].completed++;
      });

      return NextResponse.json({
        id: "demo",
        status: "COMPLETED",
        progress: {
          total: findings.length,
          completed: findings.length,
          byCategory: categoryBreakdown,
        },
      });
    }

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data: campaign, error: cErr } = await supabase
        .from("campaigns")
        .select("id, status")
        .eq("id", campaignId)
        .single();

      if (cErr) throw new Error(`Database error fetching campaign: ${cErr.message}`);

      const { data: tests, error: tErr } = await supabase
        .from("testcases")
        .select("id, category, status")
        .eq("campaign_id", campaignId);

      if (tErr) throw new Error(`Database error fetching testcases: ${tErr.message}`);

      const allTests = tests || [];
      const total = allTests.length;
      const completed = allTests.filter((t) => t.status === "COMPLETED").length;
      const byCategory: Record<string, { total: number; completed: number }> = {};

      for (const t of allTests) {
        const cat = t.category || "General";
        if (!byCategory[cat]) {
          byCategory[cat] = { total: 0, completed: 0 };
        }
        byCategory[cat].total++;
        if (t.status === "COMPLETED") {
          byCategory[cat].completed++;
        }
      }

      return NextResponse.json({
        id: campaignId,
        status: campaign?.status || (completed >= total ? "COMPLETED" : "RUNNING"),
        progress: {
          total,
          completed,
          byCategory,
        },
      });
    }

    const store = getDemoStore();
    const campaign = store.campaigns.find((c: any) => c.id === campaignId);
    const tests = store.testCases.filter((t: any) => t.campaign_id === campaignId);

    let total = tests.length;
    let completed = tests.filter((t: any) => t.status === "COMPLETED").length;
    const byCategory: Record<string, { total: number; completed: number }> = {};

    for (const t of tests) {
      const cat = t.category || "General";
      if (!byCategory[cat]) {
        byCategory[cat] = { total: 0, completed: 0 };
      }
      byCategory[cat].total++;
      if (t.status === "COMPLETED") {
        byCategory[cat].completed++;
      }
    }

    if (total === 0) {
      total = 30;
    }

    return NextResponse.json({
      id: campaignId,
      status: campaign?.status || (completed >= total ? "COMPLETED" : "RUNNING"),
      progress: {
        total,
        completed,
        byCategory,
      },
    });
  } catch (error: any) {
    console.error("Status Check Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch status",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
