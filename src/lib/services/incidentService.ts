import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";
import crypto from "crypto";

export class IncidentService {
  static async getIncidents(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("incidents").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying incidents: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.incidents;
    return store.incidents.filter((i: any) => i.workspace_id === workspaceId);
  }

  static async getRemediationActions(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("remediation_actions").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying remediation actions: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.remediationActions;
    return store.remediationActions.filter((r: any) => r.workspace_id === workspaceId);
  }

  static async createIncidentFromFinding(finding: any, workspaceId: string, aiSystemId: string) {
    const newIncident = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      ai_system_id: aiSystemId,
      finding_id: finding.id || null,
      title: `Finding Incident: ${finding.category} - ${finding.objective || "Safety Violation"}`,
      description: finding.rationale || "Safety violation flagged during automated assurance testing.",
      severity: finding.severity || "HIGH",
      category: finding.category || "General Safety",
      status: "OPEN",
      assigned_owner: "AI Assurance Team",
      detected_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("incidents").insert(newIncident);
      if (error) {
        throw new Error(`Database error creating incident: ${error.message}`);
      }
      return newIncident;
    }

    const store = getDemoStore();
    store.incidents.unshift(newIncident);
    return newIncident;
  }

  static async createRemediationAction(data: {
    incident_id: string;
    workspace_id: string;
    ai_system_id: string;
    title: string;
    description: string;
    remediation_type: string;
    assigned_owner: string;
    due_date?: string;
  }) {
    const newAction = {
      id: crypto.randomUUID(),
      ...data,
      status: "IN_PROGRESS",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("remediation_actions").insert(newAction);
      if (error) {
        throw new Error(`Database error creating remediation action: ${error.message}`);
      }
      return newAction;
    }

    const store = getDemoStore();
    store.remediationActions.unshift(newAction);
    return newAction;
  }
}
