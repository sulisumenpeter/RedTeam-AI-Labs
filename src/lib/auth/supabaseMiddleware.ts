import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit } from "../security/rateLimit";
import { cleanEnv } from "./supabaseServer";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Static assets and Next.js internal routes are bypassed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return response;
  }

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
      return NextResponse.json(
        { error: "Too Many Requests: Rate limit exceeded. Please wait before retrying." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)).toString(),
            "X-RateLimit-Limit": rateLimit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
          },
        }
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
    return response;
  }

  // Check demo session cookie if demo mode is enabled
  const demoCookie = request.cookies.get("redteam_demo_session")?.value;
  if (isDemoMode && demoCookie === "authenticated") {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
    return response;
  }

  // If not configured and not in demo mode, redirect to login or configuration warning
  if (!isConfigured) {
    if (isPublicAuthRoute) {
      return response;
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication service unconfigured. Configure Supabase or enable NEXT_PUBLIC_DEMO_MODE=true." },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL("/login?error=unconfigured", request.url));
  }

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as CookieOptions)
        );
      },
    },
  });

  // Verify the user's JWT from cookies
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (isPublicAuthRoute) {
    // If logged-in user visits /login, redirect to dashboard
    if (user && pathname === "/login") {
      return NextResponse.redirect(new URL("/overview", request.url));
    }
    return response;
  }

  // Protected routes: if no valid user session
  if (!user || error) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Active authenticated session required." },
        { status: 401 }
      );
    }

    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
