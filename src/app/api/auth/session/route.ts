import { getAuthenticatedUserAndWorkspace } from "../../../../lib/auth/authorization";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * Session Discovery & Identity Verification Endpoint
 * - Anonymous callers receive { authenticated: false, user: null, workspace: null } with zero sensitive data.
 * - Callers requiring strict authentication (?strict=true or ?requireAuth=true) receive 401 Unauthorized.
 * - Strict no-cache headers prevent intermediate proxy or browser caching of user session state.
 */
export async function GET(req: NextRequest) {
  const { auth, errorResponse } = await getAuthenticatedUserAndWorkspace(req);
  const searchParams = req.nextUrl?.searchParams;
  const requireAuth =
    searchParams?.get("strict") === "true" ||
    searchParams?.get("requireAuth") === "true";

  if (errorResponse || !auth) {
    if (requireAuth) {
      return NextResponse.json(
        { error: "Unauthorized: Active authenticated session required." },
        {
          status: 401,
          headers: NO_CACHE_HEADERS,
        }
      );
    }

    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        workspace: null,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  }

  return NextResponse.json(
    {
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
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}
