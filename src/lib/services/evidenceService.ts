import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";
import crypto from "crypto";

export class EvidenceService {
  static async getEvidence(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("evidence").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying evidence: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.evidence;
    return store.evidence.filter((e: any) => e.workspace_id === workspaceId);
  }

  static async recordEvidence(data: {
    workspace_id: string;
    ai_system_id?: string;
    evidence_type: string;
    title: string;
    description: string;
    source: string;
    source_reference_id?: string;
    payloadToHash: string;
    metadata?: Record<string, any>;
  }) {
    const contentHash = crypto.createHash("sha256").update(data.payloadToHash).digest("hex");
    const item = {
      id: crypto.randomUUID(),
      workspace_id: data.workspace_id,
      ai_system_id: data.ai_system_id || null,
      evidence_type: data.evidence_type,
      title: data.title,
      description: data.description,
      source: data.source,
      source_reference_id: data.source_reference_id || null,
      content_hash: contentHash,
      verification_status: "VERIFIED",
      verified_by: "Automated Assurance System",
      verified_at: new Date().toISOString(),
      metadata: data.metadata || {},
      created_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("evidence").insert(item);
      if (error) {
        throw new Error(`Database error persisting evidence record: ${error.message}`);
      }
      return item;
    }

    const store = getDemoStore();
    store.evidence.unshift(item);
    return item;
  }
}

export class AuditService {
  static async getAuditEvents(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("audit_events").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying audit events: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.auditEvents;
    return store.auditEvents.filter((ae: any) => ae.workspace_id === workspaceId);
  }

  static async logEvent(data: {
    workspace_id: string;
    actor_email: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details?: Record<string, any>;
  }) {
    const item = {
      id: crypto.randomUUID(),
      workspace_id: data.workspace_id,
      actor_email: data.actor_email,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      details: data.details || {},
      created_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("audit_events").insert(item);
      if (error) {
        throw new Error(`Database error logging audit event: ${error.message}`);
      }
      return item;
    }

    const store = getDemoStore();
    store.auditEvents.unshift(item);
    return item;
  }
}
