import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";
import { PolicySchema } from "../domain/schemas";
import { z } from "zod";
import crypto from "crypto";

export class PolicyService {
  static async getPolicies(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("policies").select("*").order("created_at", { ascending: false });
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying policies: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.policies;
    return store.policies.filter((p: any) => p.workspace_id === workspaceId);
  }

  static async getPolicyById(id: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("policies").select("*").eq("id", id).single();
      if (error && error.code !== "PGRST116") {
        throw new Error(`Database error fetching policy '${id}': ${error.message}`);
      }
      return data || null;
    }

    const store = getDemoStore();
    return store.policies.find((p: any) => p.id === id) || null;
  }

  static async createPolicy(input: z.infer<typeof PolicySchema>) {
    const validated = PolicySchema.parse(input);
    const policyString = JSON.stringify({
      name: validated.name,
      requirements: validated.requirements,
      version: validated.version,
    });
    const policyHash = crypto.createHash("sha256").update(policyString).digest("hex");

    const newPolicy = {
      ...validated,
      id: validated.id || crypto.randomUUID(),
      policy_hash: policyHash,
      status: "APPROVED",
      is_immutable: false,
      created_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("policies").insert(newPolicy).select().single();
      if (error) {
        throw new Error(`Database error creating policy: ${error.message}`);
      }
      return data;
    }

    const store = getDemoStore();
    store.policies.unshift(newPolicy);
    return newPolicy;
  }

  static async markPolicyImmutable(id: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("policies").update({ is_immutable: true }).eq("id", id);
      if (error) {
        throw new Error(`Database error marking policy immutable: ${error.message}`);
      }
      return;
    }

    const store = getDemoStore();
    const policy = store.policies.find((p: any) => p.id === id);
    if (policy) {
      policy.is_immutable = true;
    }
  }
}
