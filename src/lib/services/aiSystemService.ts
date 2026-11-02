import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";
import { CreateAISystemInputSchema } from "../domain/schemas";
import { z } from "zod";
import crypto from "crypto";

export class AISystemService {
  static async getAISystems(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("ai_systems").select("*").order("created_at", { ascending: false });
      if (workspaceId) {
        query = query.eq("workspace_id", workspaceId);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying AI systems: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.aiSystems;
    return store.aiSystems.filter((s: any) => s.workspace_id === workspaceId);
  }

  static async getAISystemById(id: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("ai_systems").select("*").eq("id", id).single();
      if (error && error.code !== "PGRST116") {
        throw new Error(`Database error fetching AI system '${id}': ${error.message}`);
      }
      return data || null;
    }

    const store = getDemoStore();
    return store.aiSystems.find((s: any) => s.id === id) || null;
  }

  static async registerAISystem(input: z.infer<typeof CreateAISystemInputSchema>) {
    const validated = CreateAISystemInputSchema.parse(input);
    const newSystem = {
      ...validated,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("ai_systems").insert(newSystem).select().single();
      if (error) {
        throw new Error(`Database error registering AI system: ${error.message}`);
      }
      return data;
    }

    const store = getDemoStore();
    store.aiSystems.unshift(newSystem);
    return newSystem;
  }
}
