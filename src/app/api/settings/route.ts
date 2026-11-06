import { NextResponse } from "next/server";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";
import { validateExternalTargetEndpoint } from "../../../lib/security/ssrfGuard";
import { ExternalHttpTargetAdapter } from "../../../lib/target/externalTargetAdapter";
import { getSupabaseServerClient } from "../../../lib/db/supabaseServer";
import { getDemoStore } from "../../../lib/db/inMemoryStore";
import { assertPersistenceMode } from "../../../lib/db/persistenceMode";
import { AuditService } from "../../../lib/services/evidenceService";
import { z } from "zod";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const SettingsInputSchema = z.object({
  targetEndpoint: z.string().url("Must be a valid HTTP/HTTPS URL").max(2048),
  targetType: z.enum(["OPENAI_COMPATIBLE", "EXTERNAL_ENDPOINT", "SYNTHETIC", "AGENTIC_MCP_ENDPOINT"]).default("OPENAI_COMPATIBLE"),
  apiKey: z.string().optional(),
  testConnection: z.boolean().optional().default(false),
});

function cleanKey(val?: string): string | undefined {
  if (!val) return undefined;
  const cleaned = val.trim().replace(/^["']|["']$/g, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    const mode = assertPersistenceMode();
    let targetEndpoint = "";
    let targetType = "OPENAI_COMPATIBLE";
    let systemId: string | null = null;
    let systemName: string | null = null;

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data: system } = await supabase
        .from("ai_systems")
        .select("id, name, target_type, target_endpoint")
        .eq("workspace_id", auth.workspaceId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (system) {
        systemId = system.id;
        systemName = system.name;
        targetEndpoint = system.target_endpoint || "";
        targetType = system.target_type || "OPENAI_COMPATIBLE";
      }
    } else {
      const store = getDemoStore();
      const system = store.aiSystems.find((s: any) => s.workspace_id === auth.workspaceId);
      if (system) {
        systemId = system.id;
        systemName = system.name;
        targetEndpoint = system.target_endpoint || "";
        targetType = system.target_type || "OPENAI_COMPATIBLE";
      }
    }

    const hasEnvApiKey = Boolean(cleanKey(process.env.TARGET_MODEL_API_KEY) || cleanKey(process.env.OPENAI_API_KEY));

    return NextResponse.json({
      targetEndpoint,
      targetType,
      hasEnvApiKey,
      systemId,
      systemName,
      credentialStorageNotice:
        "API keys are evaluated in session memory and not stored in plaintext in the database. Use TARGET_MODEL_API_KEY in environment variables or enter your session key during campaign runs.",
    });
  } catch (error: any) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve settings", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, body.workspace_id);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "systems:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to update target settings." },
        { status: 403 }
      );
    }

    const parsed = SettingsInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid target configuration: " + parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { targetEndpoint, targetType, apiKey, testConnection } = parsed.data;

    // Validate endpoint with SSRF guard
    const validation = validateExternalTargetEndpoint(targetEndpoint);
    if (!validation.allowed) {
      return NextResponse.json(
        {
          error: `External target endpoint blocked by security policy: ${validation.reason}`,
          securityCheck: "SSRF_BLOCKED",
        },
        { status: 400 }
      );
    }

    // Connection testing routine using real ExternalHttpTargetAdapter
    if (testConnection) {
      try {
        const sessionKey = cleanKey(apiKey);
        const envKey = cleanKey(process.env.TARGET_MODEL_API_KEY) || cleanKey(process.env.OPENAI_API_KEY);
        const effectiveKey = sessionKey || envKey;

        const adapter = new ExternalHttpTargetAdapter({
          targetId: "settings-connection-probe",
          name: "Connection Probe",
          endpointUrl: validation.sanitizedUrl!,
          apiKey: effectiveKey,
          targetType: targetType === "SYNTHETIC" ? "OPENAI_COMPATIBLE" : targetType,
          timeoutMs: 8000,
          maxRetries: 1,
        });

        const testResult = await adapter.execute("Ping: Governance assurance probe.");
        return NextResponse.json({
          success: true,
          connectionStatus: "CONNECTED",
          latencyMs: testResult.latencyMs,
          message: `Connection successfully established with target (${testResult.latencyMs}ms latency).`,
        });
      } catch (connErr: any) {
        const status = typeof connErr.statusCode === "number" && connErr.statusCode >= 400 && connErr.statusCode < 600
          ? connErr.statusCode
          : 502;
        return NextResponse.json(
          {
            success: false,
            connectionStatus: "FAILED",
            error: connErr.message || String(connErr),
            statusCode: status,
          },
          { status }
        );
      }
    }

    // Persist configuration in database/store for the authenticated workspace
    const mode = assertPersistenceMode();

    if (mode === "DATABASE") {
      const supabase = getSupabaseServerClient();
      const { data: existingSystem } = await supabase
        .from("ai_systems")
        .select("id")
        .eq("workspace_id", auth.workspaceId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existingSystem) {
        const { error: updateErr } = await supabase
          .from("ai_systems")
          .update({
            target_endpoint: validation.sanitizedUrl,
            target_type: targetType,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSystem.id);

        if (updateErr) {
          throw new Error(`Failed to persist target settings: ${updateErr.message}`);
        }
      } else {
        const { error: insertErr } = await supabase.from("ai_systems").insert({
          id: crypto.randomUUID(),
          workspace_id: auth.workspaceId,
          name: "Primary External AI System",
          intended_purpose: "Configured target endpoint for governance evaluation",
          business_owner: auth.email,
          technical_owner: auth.email,
          ai_provider: "External HTTP",
          model_name: "custom-target-endpoint",
          deployment_environment: "PRODUCTION",
          system_status: "ACTIVE",
          target_type: targetType,
          target_endpoint: validation.sanitizedUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertErr) {
          throw new Error(`Failed to initialize system with target settings: ${insertErr.message}`);
        }
      }
    } else {
      const store = getDemoStore();
      const existing = store.aiSystems.find((s: any) => s.workspace_id === auth.workspaceId);
      if (existing) {
        existing.target_endpoint = validation.sanitizedUrl;
        existing.target_type = targetType;
        existing.updated_at = new Date().toISOString();
      } else {
        store.aiSystems.push({
          id: crypto.randomUUID(),
          workspace_id: auth.workspaceId,
          name: "Primary External AI System",
          target_type: targetType,
          target_endpoint: validation.sanitizedUrl,
          created_at: new Date().toISOString(),
        });
      }
    }

    await AuditService.logEvent({
      workspace_id: auth.workspaceId,
      actor_email: auth.email,
      action: "TARGET_SETTINGS_UPDATED",
      entity_type: "AI_SYSTEM",
      entity_id: auth.workspaceId,
      details: {
        target_endpoint: validation.sanitizedUrl,
        target_type: targetType,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Target configuration persisted successfully.",
      targetEndpoint: validation.sanitizedUrl,
      targetType,
    });
  } catch (error: any) {
    console.error("POST Settings Error:", error);
    return NextResponse.json(
      { error: "Failed to save settings: " + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
