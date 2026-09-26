import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../lib/db/supabase";
import { RedTeamTestGenerator } from "../../../lib/engine/generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      policy_id, 
      policy_version, 
      policy_hash, 
      target_type, 
      target_version,
      generator_version,
      evaluator_version,
      random_seed 
    } = body;

    const { data: campaign, error: campaignError } = await supabase.from('campaigns').insert({
      name: name || "Test Campaign",
      policy_hash,
      policy_version,
      target_version,
      generator_version,
      evaluator_version,
      rubric_version: "1.0",
      random_seed: random_seed || 42
    }).select().single();
    
    if (campaignError) throw campaignError;

    const generator = new RedTeamTestGenerator();
    const tests = await generator.generate([], random_seed || 42);

    const testCasesToInsert = tests.map(t => ({
      campaign_id: campaign.id,
      category: t.category,
      objective: t.objective,
      expected_control: t.expected_control,
      attack_input: t.attack_input,
      requirement_id: t.requirement_id || null
    }));

    const { error: testsError } = await supabase.from('testcases').insert(testCasesToInsert);
    if (testsError) throw testsError;

    return NextResponse.json({ id: campaign.id, success: true, message: "Campaign created" }, { status: 201 });
  } catch (error: any) {
    console.error("Campaign Creation Error:", error);
    return NextResponse.json({ 
      error: "Failed to create campaign", 
      details: error.message || error.details || String(error)
    }, { status: 500 });
  }
}
