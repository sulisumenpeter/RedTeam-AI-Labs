import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";

export class FrameworkService {
  static async getFrameworks() {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("frameworks").select("*").order("name");
      if (error) {
        throw new Error(`Database error querying frameworks: ${error.message}`);
      }
      return data || [];
    }
    return getDemoStore().frameworks;
  }

  static async getFrameworkControls(frameworkCode?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("framework_controls").select("*");
      if (frameworkCode) {
        query = query.eq("framework_code", frameworkCode);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying framework controls: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!frameworkCode) return store.frameworkControls;
    return store.frameworkControls.filter((c: any) => c.framework_code === frameworkCode);
  }

  static async getControlMappings(workspaceId?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("control_mappings").select("*");
      if (workspaceId) query = query.eq("workspace_id", workspaceId);
      const { data, error } = await query;
      if (error) {
        throw new Error(`Database error querying control mappings: ${error.message}`);
      }
      return data || [];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.controlMappings;
    return store.controlMappings.filter((m: any) => m.workspace_id === workspaceId);
  }
}
