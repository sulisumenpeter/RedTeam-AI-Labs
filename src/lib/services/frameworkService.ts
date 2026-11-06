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
      
      const dbFrameworks = data || [];
      const store = getDemoStore();
      
      // Ensure all fallback frameworks are present
      const existingCodes = new Set(dbFrameworks.map((f: any) => f.short_code));
      const missingFrameworks = store.frameworks.filter((f: any) => !existingCodes.has(f.short_code));
      
      if (missingFrameworks.length > 0) {
        return [...dbFrameworks, ...missingFrameworks];
      }
      return dbFrameworks;
    }
    return getDemoStore().frameworks;
  }

  static async getFrameworkControls(frameworkCode?: string) {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      
      // Fetch controls, versions, and frameworks to accurately map framework_code
      const [controlsRes, versionsRes, frameworksRes] = await Promise.all([
        supabase.from("framework_controls").select("*"),
        supabase.from("framework_versions").select("id, framework_id"),
        supabase.from("frameworks").select("id, short_code"),
      ]);

      if (controlsRes.error) {
        throw new Error(`Database error querying framework controls: ${controlsRes.error.message}`);
      }

      const versionToFrameworkCode = new Map<string, string>();
      const frameworkIdToCode = new Map<string, string>();
      (frameworksRes.data || []).forEach((f: any) => {
        frameworkIdToCode.set(f.id, f.short_code);
      });
      (versionsRes.data || []).forEach((v: any) => {
        const code = frameworkIdToCode.get(v.framework_id);
        if (code) versionToFrameworkCode.set(v.id, code);
      });

      const store = getDemoStore();
      const controlCodeToFrameworkCode = new Map<string, string>();
      store.frameworkControls.forEach((c: any) => {
        if (c.control_code && c.framework_code) {
          controlCodeToFrameworkCode.set(c.control_code, c.framework_code);
        }
      });

      const enrichedControls = (controlsRes.data || []).map((c: any) => {
        const derivedCode =
          versionToFrameworkCode.get(c.framework_version_id) ||
          controlCodeToFrameworkCode.get(c.control_code) ||
          "";
        return {
          ...c,
          framework_code: derivedCode,
        };
      });

      // If database is missing any controls, merge from store
      const dbControlCodes = new Set(enrichedControls.map((c: any) => c.control_code));
      const missingControls = store.frameworkControls.filter(
        (c: any) => !dbControlCodes.has(c.control_code)
      );
      const allControls = [...enrichedControls, ...missingControls];

      if (!frameworkCode || frameworkCode === "ALL") {
        return allControls;
      }
      return allControls.filter((c: any) => c.framework_code === frameworkCode);
    }

    const store = getDemoStore();
    if (!frameworkCode || frameworkCode === "ALL") return store.frameworkControls;
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
      
      const dbMappings = data || [];
      const store = getDemoStore();
      const existingControlIds = new Set(dbMappings.map((m: any) => m.framework_control_id));
      const missingMappings = store.controlMappings.filter(
        (m: any) => !existingControlIds.has(m.framework_control_id)
      );

      return [...dbMappings, ...missingMappings];
    }

    const store = getDemoStore();
    if (!workspaceId) return store.controlMappings;
    return store.controlMappings.filter((m: any) => m.workspace_id === workspaceId);
  }
}
