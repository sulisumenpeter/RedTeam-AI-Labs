import { getSupabaseServerClient } from "../db/supabaseServer";
import { getDemoStore } from "../db/inMemoryStore";
import { assertPersistenceMode } from "../db/persistenceMode";

export class WorkspaceService {
  static async getWorkspaces() {
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("workspaces").select("*").order("name");
      if (error) {
        throw new Error(`Database error querying workspaces: ${error.message}`);
      }
      return data || [];
    }
    return getDemoStore().workspaces;
  }

  static async getWorkspaceById(id: string) {
    const list = await this.getWorkspaces();
    return list.find((w: any) => w.id === id || w.slug === id) || null;
  }
}
