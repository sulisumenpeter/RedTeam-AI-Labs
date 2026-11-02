import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";
import { CreateRiskInputSchema, calculateRiskScore, getRiskLevel } from "../domain/schemas";
import { z } from "zod";
import crypto from "crypto";

export class RiskService {
  static async getRisks(workspaceId?: string, aiSystemId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("risks").select("*").order("inherent_score", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      if (aiSystemId) query = query.eq("ai_system_id", aiSystemId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying risks: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    let results = store.risks;
    if (workspaceId) results = results.filter((r: any) => r.workspace_id === workspaceId);
    if (aiSystemId) results = results.filter((r: any) => r.ai_system_id === aiSystemId);
    return results;
  }

  static async getRiskAssessmentSummary(workspaceId?: string) {
    const risks = await this.getRisks(workspaceId);

    // 5x5 Matrix breakdown: counts by [inherent_likelihood][inherent_impact]
    const matrix: Record<string, number> = {};
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        matrix[`${l}x${i}`] = 0;
      }
    }

    let totalInherent = 0;
    let totalResidual = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const r of risks) {
      const key = `${r.inherent_likelihood}x${r.inherent_impact}`;
      matrix[key] = (matrix[key] || 0) + 1;
      totalInherent += r.inherent_score || calculateRiskScore(r.inherent_likelihood, r.inherent_impact);
      totalResidual += r.residual_score || calculateRiskScore(r.residual_likelihood, r.residual_impact);
      categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
    }

    const avgInherent = risks.length > 0 ? Math.round((totalInherent / risks.length) * 10) / 10 : 0;
    const avgResidual = risks.length > 0 ? Math.round((totalResidual / risks.length) * 10) / 10 : 0;

    return {
      totalRisks: risks.length,
      averageInherentScore: avgInherent,
      averageResidualScore: avgResidual,
      overallRiskLevel: getRiskLevel(avgInherent),
      matrix,
      categoryBreakdown,
      risks,
    };
  }

  static async createRisk(input: z.infer<typeof CreateRiskInputSchema>) {
    const validated = CreateRiskInputSchema.parse(input);
    const inherentScore = calculateRiskScore(validated.inherent_likelihood, validated.inherent_impact);
    const residualScore = calculateRiskScore(validated.residual_likelihood, validated.residual_impact);

    const newRisk = {
      ...validated,
      id: crypto.randomUUID(),
      inherent_score: inherentScore,
      residual_score: residualScore,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();

      let assessmentId = validated.risk_assessment_id;
      if (!assessmentId) {
        let query = supabase.from("risk_assessments").select("id").eq("workspace_id", validated.workspace_id);
        if (validated.ai_system_id) {
          query = query.eq("ai_system_id", validated.ai_system_id);
        }
        const { data: existingAssessment } = await query.limit(1).maybeSingle();
        if (existingAssessment) {
          assessmentId = existingAssessment.id;
        } else {
          const { data: newAssessment } = await supabase.from("risk_assessments").insert({
            workspace_id: validated.workspace_id,
            ai_system_id: validated.ai_system_id,
            title: "General AI Risk Assessment",
            assessor_name: validated.risk_owner || "Risk Lead",
            status: "COMPLETED",
            overall_inherent_risk_score: inherentScore,
            overall_residual_risk_score: residualScore,
          }).select("id").single();
          if (newAssessment) {
            assessmentId = newAssessment.id;
          }
        }
      }

      // Do not include generated columns (inherent_score, residual_score) in the insert payload.
      // PostgreSQL calculates them automatically via STORED expression.
      const dbInsertPayload = {
        id: crypto.randomUUID(),
        workspace_id: validated.workspace_id,
        ai_system_id: validated.ai_system_id,
        risk_assessment_id: assessmentId,
        category: validated.category,
        title: validated.title,
        description: validated.description,
        risk_owner: validated.risk_owner,
        inherent_likelihood: validated.inherent_likelihood,
        inherent_impact: validated.inherent_impact,
        mitigation_plan: validated.mitigation_plan,
        target_completion_date: validated.target_completion_date || null,
        residual_likelihood: validated.residual_likelihood,
        residual_impact: validated.residual_impact,
        status: validated.status || "OPEN",
        acceptance_rationale: validated.acceptance_rationale || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from("risks").insert(dbInsertPayload).select().single();
      if (error) {
        throw new Error(`Database error creating risk: ${error.message}`);
      }
      return data;
    }

    const store = getDemoStore();
    store.risks.unshift(newRisk);
    return newRisk;
  }
}
