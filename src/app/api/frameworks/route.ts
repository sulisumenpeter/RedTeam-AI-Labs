import { NextResponse } from "next/server";
import { FrameworkService } from "../../../lib/services/frameworkService";
import { getAuthenticatedUserAndWorkspace, hasPermission } from "../../../lib/auth/authorization";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const frameworkCode = searchParams.get("framework") || undefined;
    const requestedWorkspaceId = searchParams.get("workspace_id") || undefined;

    const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req, requestedWorkspaceId);
    if (errorResponse || !auth) return errorResponse!;

    if (!hasPermission(auth.role, "frameworks:read")) {
      return NextResponse.json(
        { error: "Forbidden: Insufficient privileges to view framework library." },
        { status: 403 }
      );
    }

    const frameworks = await FrameworkService.getFrameworks();
    const controls = await FrameworkService.getFrameworkControls(frameworkCode);
    const mappings = await FrameworkService.getControlMappings(auth.workspaceId);

    return NextResponse.json({ frameworks, controls, mappings });
  } catch (error: any) {
    console.error("Fetch Frameworks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch framework library", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
