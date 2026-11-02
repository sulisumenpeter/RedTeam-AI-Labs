import { getAuthenticatedUserAndWorkspace } from "../../../../lib/auth/authorization";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace();

  if (errorResponse || !auth) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      workspace: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: auth.userId,
      email: auth.email,
      role: auth.role,
    },
    workspace: {
      id: auth.workspaceId,
      role: auth.role,
    },
    isDemo: auth.isDemo,
  });
}
