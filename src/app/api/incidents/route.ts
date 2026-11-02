import { NextResponse } from "next/server";
import { IncidentService } from "../../../lib/services/incidentService";
import { AuditService } from "../../../lib/services/evidenceService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "incidents:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view incidents." },
        { status: 403 }
      );
    }

    const incidents = await IncidentService.getIncidents(auth.workspaceId);
    const remediationActions = await IncidentService.getRemediationActions(auth.workspaceId);

    return NextResponse.json({ incidents, remediationActions });
  } catch (error: any) {
    console.error("Fetch Incidents Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const targetWorkspaceId = data?.workspace_id;
    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, targetWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "incidents:write")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to update incidents or remediation actions." },
        { status: 403 }
      );
    }

    if (type === "REMEDIATION") {
      const action = await IncidentService.createRemediationAction({
        ...data,
        workspace_id: auth.workspaceId,
      });

      await AuditService.logEvent({
        workspace_id: auth.workspaceId,
        actor_email: auth.email,
        action: "REMEDIATION_ACTION_CREATED",
        entity_type: "REMEDIATION_ACTION",
        entity_id: action.id,
        details: { title: action.title, type: action.remediation_type },
      });
      return NextResponse.json(action, { status: 201 });
    }

    if (type === "INCIDENT_FROM_FINDING") {
      const incident = await IncidentService.createIncidentFromFinding(
        data.finding,
        auth.workspaceId,
        data.ai_system_id || "b0000000-0000-0000-0000-000000000001"
      );

      await AuditService.logEvent({
        workspace_id: auth.workspaceId,
        actor_email: auth.email,
        action: "INCIDENT_OPENED_FROM_FINDING",
        entity_type: "INCIDENT",
        entity_id: incident.id,
        details: { title: incident.title, severity: incident.severity },
      });
      return NextResponse.json(incident, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid incident operation type." }, { status: 400 });
  } catch (error: any) {
    console.error("Incident Operation Error:", error);
    return NextResponse.json(
      { error: "Failed to process incident operation", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
