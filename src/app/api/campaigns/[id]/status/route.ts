import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/db/supabase";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const campaignId = params.id;
    
    // Fetch campaign status
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('status')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    const { data: categoryStats, error: catError } = await supabase
      .from('testcases')
      .select('category, status')
      .eq('campaign_id', campaignId);
      
    if (catError) throw catError;

    let totalTests = 0;
    let completedTests = 0;
    const categoryBreakdown: Record<string, { total: number; completed: number }> = {};

    if (categoryStats) {
      categoryStats.forEach(t => {
        const cat = t.category || "Unknown";
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, completed: 0 };
        }
        categoryBreakdown[cat].total++;
        totalTests++;
        if (t.status === 'COMPLETED') {
          categoryBreakdown[cat].completed++;
          completedTests++;
        }
      });
    }

    let finalStatus = campaign.status;
    
    // Auto-update to COMPLETED if all tests are done
    if (totalTests > 0 && completedTests >= totalTests && finalStatus !== 'COMPLETED') {
        finalStatus = 'COMPLETED';
        await supabase.from('campaigns').update({ status: 'COMPLETED' }).eq('id', campaignId);
    }

    return NextResponse.json({
      id: campaignId,
      status: finalStatus,
      progress: {
        total: totalTests,
        completed: completedTests,
        byCategory: categoryBreakdown
      }
    });
  } catch (error: any) {
    console.error("Status check failed:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
