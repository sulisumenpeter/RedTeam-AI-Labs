import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "../security/rateLimit";
import { cleanEnv } from "./supabaseServer";
import { extractUserFromCookies, hasAuthTokenCookies } from "./supabaseCookie";
import { handleCorsPreflight, applyCorsHeaders } from "../security/cors";
import { applySecurityHeaders } from "../security/headers";

function finalize(request: NextRequest, response: NextResponse): NextResponse {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    applyCorsHeaders(request, response);
  }
  applySecurityHeaders(response);
  return response;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Static assets and Next.js internal routes are bypassed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/icon.svg") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // Intercept CORS preflight OPTIONS requests for API routes
  if (pathname.startsWith("/api/")) {
    const preflight = handleCorsPreflight(request);
    if (preflight) {
      applySecurityHeaders(preflight);
      return preflight;
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Rate Limiting Protection for API Routes
  if (pathname.startsWith("/api/")) {
    const ip =
      request.ip ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const isLoginEndpoint = pathname.startsWith("/api/auth/login");
    const rateLimit = isLoginEndpoint ? 15 : 120;
    const { allowed, remaining, resetAt } = checkRateLimit(
      `${ip}:${isLoginEndpoint ? "auth" : "api"}`,
      rateLimit,
      60
    );

    if (!allowed) {
      return finalize(
        request,
        NextResponse.json(
          { error: "Too Many Requests: Rate limit exceeded. Please wait before retrying." },
          {
            status: 429,
            headers: {
              "Retry-After": Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)).toString(),
              "X-RateLimit-Limit": rateLimit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
            },
          }
        )
      );
    }
  }

  // Public routes that never require authentication
  const isPublicAuthRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/session") ||
    pathname.startsWith("/api/health");

  // Private application dashboard routes requiring authentication
  const PROTECTED_ROUTE_PREFIXES = [
    "/overview",
    "/systems",
    "/risks",
    "/policies",
    "/policy",
    "/frameworks",
    "/campaigns",
    "/incidents",
    "/remediation",
    "/evidence",
    "/reports",
    "/settings",
  ];

  const isProtectedPath = PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const rawAnon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const rawService = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabaseKey =
    rawAnon && !rawAnon.includes("placeholder")
      ? rawAnon
      : rawService;

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseUrl.includes("mock-xyz") &&
    !supabaseKey.includes("placeholder") &&
    !supabaseKey.includes("mock")
  );
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.DEMO_MODE === "true";

  // If Supabase is not configured and demo mode is explicitly enabled, allow demo session
  if (!isConfigured && isDemoMode) {
    return finalize(request, response);
  }

  // Check demo session cookie if demo mode is enabled
  const demoCookie = request.cookies.get("redteam_demo_session")?.value;
  if (isDemoMode && demoCookie === "authenticated") {
    if (pathname === "/login") {
      return finalize(request, NextResponse.redirect(new URL("/overview", request.url)));
    }
    return finalize(request, response);
  }

  // If not configured and not in demo mode, redirect to login or configuration warning
  if (!isConfigured) {
    if (isPublicAuthRoute) {
      return finalize(request, response);
    }
    if (pathname.startsWith("/api/")) {
      return finalize(
        request,
        NextResponse.json(
          { error: "Authentication service unconfigured. Configure Supabase or enable NEXT_PUBLIC_DEMO_MODE=true." },
          { status: 503 }
        )
      );
    }
    if (isProtectedPath) {
      return finalize(request, NextResponse.redirect(new URL("/login?error=unconfigured", request.url)));
    }
    return finalize(request, response);
  }

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if ((!value || options?.maxAge === 0) && name.includes("-auth-token")) {
            return;
          }
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          // Never delete auth cookies during read-only navigations or transient 429 rate limits.
          // Explicit sign out is handled unconditionally by /api/auth/logout.
          if ((!value || options?.maxAge === 0) && name.includes("-auth-token")) {
            return;
          }
          response.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  // Verify the user's JWT from cookies
  let user = null;
  let error = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data?.user;
    error = res.error;
  } catch (err: any) {
    error = err;
  }

  // If remote Auth endpoint rate limits or fails, recover user identity from local cookie session
  if (!user) {
    user = extractUserFromCookies(request.cookies.getAll());
    if (user) {
      error = null;
    }
  }

  if (isPublicAuthRoute) {
    // If logged-in user visits /login, redirect to dashboard
    if (user && pathname === "/login") {
      return finalize(request, NextResponse.redirect(new URL("/overview", request.url)));
    }
    return finalize(request, response);
  }

  // Protected routes: if no valid user session
  if (!user || error) {
    const isRateLimited =
      error &&
      ((error as any).status === 429 ||
        (error as any).code === "over_request_rate_limit");

    const hasAuthCookie = hasAuthTokenCookies(request.cookies.getAll());

    // If Supabase Auth is temporarily rate-limiting but user has valid auth tokens, allow through
    if (isRateLimited && hasAuthCookie) {
      return finalize(request, response);
    }

    if (pathname.startsWith("/api/")) {
      return finalize(
        request,
        NextResponse.json(
          { error: "Unauthorized: Active authenticated session required." },
          { status: 401 }
        )
      );
    }

    if (isProtectedPath) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return finalize(request, NextResponse.redirect(redirectUrl));
    }

    // For any unauthenticated request to an undefined public route, let Next.js handle 404
    return finalize(request, response);
  }

  return finalize(request, response);
}
