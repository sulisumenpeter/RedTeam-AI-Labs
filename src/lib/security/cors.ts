import { type NextRequest, NextResponse } from "next/server";

/**
 * Enterprise CORS Security Engine
 * Replaces wildcard CORS with an explicit origin allowlist.
 * Ensures cross-origin requests cannot access APIs or leak session credentials.
 */

export function getAllowedOrigins(): string[] {
  const allowed = new Set<string>();

  // Configured public canonical site URLs
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {}
  }
  if (process.env.SITE_URL) {
    try {
      allowed.add(new URL(process.env.SITE_URL).origin);
    } catch {}
  }

  // Local development origins
  allowed.add("http://localhost:3000");
  allowed.add("http://127.0.0.1:3000");

  // Production Vercel canonical origin
  allowed.add("https://red-team-ai-labs.vercel.app");

  // Additional explicitly allowed origins from environment (comma-delimited)
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
      .forEach((origin) => {
        try {
          allowed.add(new URL(origin).origin);
        } catch {}
      });
  }

  return Array.from(allowed);
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  return allowed.includes(origin);
}

const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS, PATCH";
const ALLOWED_HEADERS = "Content-Type, Authorization, X-Requested-With, baggage, sentry-trace";

/**
 * Handles CORS headers for incoming API requests.
 * Returns a response directly for preflight OPTIONS requests, or attaches headers to an existing response.
 */
export function applyCorsHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const origin = request.headers.get("origin");

  // Non-CORS request (same-origin or direct server-to-server)
  if (!origin) {
    return response;
  }

  if (isOriginAllowed(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
    response.headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
    response.headers.set("Vary", "Origin");
  } else {
    // Explicitly omit Access-Control-Allow-Origin for unauthorized origins
    response.headers.delete("Access-Control-Allow-Origin");
  }

  return response;
}

/**
 * Intercepts preflight OPTIONS requests for API routes.
 */
export function handleCorsPreflight(request: NextRequest): NextResponse | null {
  if (request.method !== "OPTIONS") return null;

  const origin = request.headers.get("origin");

  // If no Origin header, handle as regular OPTIONS
  if (!origin) {
    return new NextResponse(null, { status: 204 });
  }

  if (isOriginAllowed(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": ALLOWED_METHODS,
        "Access-Control-Allow-Headers": ALLOWED_HEADERS,
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }

  // Reject unauthorized origins with 403 Forbidden
  return NextResponse.json(
    { error: "CORS policy violation: Origin not allowed." },
    { status: 403 }
  );
}
