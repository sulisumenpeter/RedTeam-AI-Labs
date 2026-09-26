import { NextResponse } from "next/server";
import { RedTeamDeterministicEvaluator } from "../../../../../lib/engine/evaluators";
import { SyntheticLegalIntakeAssistant } from "../../../../../lib/target/syntheticAssistant";
import { supabase } from "../../../../../lib/db/supabase";
import crypto from "crypto";
import { demoFindings } from "../../../../../lib/demoData";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { batch_size } = await req.json();
    const campaignId = params.id;
    
    if (campaignId === "demo") {
      return NextResponse.json({ 
        success: true, 
        processed: demoFindings.length,
        findings: demoFindings,
        status: "COMPLETED" 
      });
    }

    // Fetch pending tests
    const { data: tests, error: fetchError } = await supabase
      .from('testcases')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', 'PENDING')
      .limit(batch_size || 5);

    if (fetchError) throw fetchError;
    if (!tests || tests.length === 0) {
      return NextResponse.json({ success: true, processed: 0, findings: [], status: "COMPLETED" });
    }

    const target = new SyntheticLegalIntakeAssistant();
    const deterministicEvaluator = new RedTeamDeterministicEvaluator();

    const findings = [];
    const testRunsToInsert = [];
    const testCasesToUpdate = [];

    for (const test of tests) {
      const targetResponse = await target.execute(test.attack_input, { profile: "neutral" });
      const deterministicSignal = deterministicEvaluator.evaluate(targetResponse, test.expected_control);

      const severity = deterministicSignal.matched ? "PASS" : "CRITICAL";
      const testRunId = crypto.randomUUID();

      testRunsToInsert.push({
        id: testRunId,
        test_case_id: test.id,
        campaign_id: campaignId,
        idempotency_key: `${campaignId}-${test.id}-${Date.now()}`,
        target_response: targetResponse,
        evaluator_raw_output: deterministicSignal.evidence,
        status: 'COMPLETED'
      });

      findings.push({
        test_run_id: testRunId,
        severity,
        rationale: deterministicSignal.evidence,
        evidence: targetResponse,
        // Include UI data
        category: test.category,
        objective: test.objective,
        attack_input: test.attack_input
      });

      testCasesToUpdate.push(test.id);
    }

    // Persist TestRuns
    const { error: runError } = await supabase.from('testruns').insert(testRunsToInsert);
    if (runError) throw runError;

    // Persist Findings (we strip out UI-only fields for the DB)
    const dbFindings = findings.map(f => ({
      test_run_id: f.test_run_id,
      severity: f.severity,
      rationale: f.rationale,
      evidence: f.evidence
    }));
    
    const { error: findingError } = await supabase.from('findings').insert(dbFindings);
    if (findingError) throw findingError;

    // Update TestCases status
    await supabase.from('testcases').update({ status: 'COMPLETED' }).in('id', testCasesToUpdate);

    return NextResponse.json({ 
      success: true, 
      processed: tests.length,
      findings: findings,
      status: "CHUNK_PROCESSED" 
    });
  } catch (error: any) {
    console.error("Chunk Processing Error:", error);
    return NextResponse.json({ error: "Failed to process chunk" }, { status: 500 });
  }
}
