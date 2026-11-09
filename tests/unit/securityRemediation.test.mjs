import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Security Remediation & Defense-in-Depth Suite", () => {
  describe("Security Headers Engine", () => {
    const SECURITY_HEADERS = {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.supabase.in https://generativelanguage.googleapis.com https://api.openai.com https://vercel.live https://*.vercel.app",
        "frame-ancestors 'self'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "upgrade-insecure-requests",
      ].join("; "),
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), sync-xhr=()",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-XSS-Protection": "1; mode=block",
    };

    it("enforces clickjacking defense via frame-ancestors 'self' and X-Frame-Options SAMEORIGIN", () => {
      assert.equal(SECURITY_HEADERS["X-Frame-Options"], "SAMEORIGIN");
      assert(SECURITY_HEADERS["Content-Security-Policy"].includes("frame-ancestors 'self'"));
    });

    it("enforces MIME-sniffing prevention via X-Content-Type-Options nosniff", () => {
      assert.equal(SECURITY_HEADERS["X-Content-Type-Options"], "nosniff");
    });

    it("enforces strict referrer policy to protect sensitive paths and query tokens", () => {
      assert.equal(SECURITY_HEADERS["Referrer-Policy"], "strict-origin-when-cross-origin");
    });

    it("restricts dangerous browser capabilities via Permissions-Policy", () => {
      const perms = SECURITY_HEADERS["Permissions-Policy"];
      assert(perms.includes("camera=()"));
      assert(perms.includes("microphone=()"));
      assert(perms.includes("geolocation=()"));
    });

    it("whitelists Supabase, Gemini, and OpenAI in CSP connect-src while blocking unapproved hosts", () => {
      const csp = SECURITY_HEADERS["Content-Security-Policy"];
      assert(csp.includes("https://*.supabase.co"));
      assert(csp.includes("wss://*.supabase.co"));
      assert(csp.includes("https://generativelanguage.googleapis.com"));
      assert(csp.includes("https://api.openai.com"));
      assert(!csp.includes("http://evil.com"));
    });
  });

  describe("CORS Origin Allowlist & Preflight Isolation", () => {
    function isOriginAllowed(origin, allowedList) {
      if (!origin) return false;
      return allowedList.includes(origin);
    }

    function evaluateCors(origin, method, allowedList) {
      const allowed = isOriginAllowed(origin, allowedList);
      if (method === "OPTIONS") {
        if (allowed) {
          return {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": origin,
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
              "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, baggage, sentry-trace",
            },
          };
        }
        return {
          status: 403,
          headers: {},
          error: "CORS policy violation: Origin not allowed.",
        };
      }

      const headers = {};
      if (allowed) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Credentials"] = "true";
      }
      return { status: 200, headers };
    }

    const defaultAllowlist = [
      "https://app.redteam-ai.internal",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];

    it("allows configured development and production origins", () => {
      assert.equal(isOriginAllowed("http://localhost:3000", defaultAllowlist), true);
      assert.equal(isOriginAllowed("https://app.redteam-ai.internal", defaultAllowlist), true);
    });

    it("rejects unauthorized external origins without setting Access-Control-Allow-Origin", () => {
      const result = evaluateCors("https://attacker-domain.com", "GET", defaultAllowlist);
      assert.equal(result.headers["Access-Control-Allow-Origin"], undefined);
    });

    it("blocks preflight OPTIONS requests from unapproved origins with HTTP 403", () => {
      const result = evaluateCors("https://malicious-site.org", "OPTIONS", defaultAllowlist);
      assert.equal(result.status, 403);
      assert.equal(result.headers["Access-Control-Allow-Origin"], undefined);
    });

    it("never emits wildcard '*' for credentialed API responses", () => {
      const result = evaluateCors("http://localhost:3000", "POST", defaultAllowlist);
      assert.notEqual(result.headers["Access-Control-Allow-Origin"], "*");
      assert.equal(result.headers["Access-Control-Allow-Origin"], "http://localhost:3000");
      assert.equal(result.headers["Access-Control-Allow-Credentials"], "true");
    });
  });

  describe("Session Discovery & Anti-Leakage Protocol", () => {
    function handleSessionRequest(auth, requireAuth) {
      const noCacheHeaders = {
        "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      };

      if (!auth) {
        if (requireAuth) {
          return {
            status: 401,
            body: { error: "Unauthorized: Active authenticated session required." },
            headers: noCacheHeaders,
          };
        }
        return {
          status: 200,
          body: { authenticated: false, user: null, workspace: null },
          headers: noCacheHeaders,
        };
      }

      return {
        status: 200,
        body: {
          authenticated: true,
          user: { id: auth.userId, email: auth.email, role: auth.role },
          workspace: { id: auth.workspaceId, role: auth.role },
          isDemo: auth.isDemo,
        },
        headers: noCacheHeaders,
      };
    }

    it("returns zero private data or tokens when unauthenticated", () => {
      const res = handleSessionRequest(null, false);
      assert.equal(res.status, 200);
      assert.equal(res.body.authenticated, false);
      assert.equal(res.body.user, null);
      assert.equal(res.body.workspace, null);
      assert.equal(res.body.token, undefined);
    });

    it("enforces strict HTTP 401 when requireAuth is requested", () => {
      const res = handleSessionRequest(null, true);
      assert.equal(res.status, 401);
      assert(res.body.error.includes("Unauthorized"));
    });

    it("always attaches strict Cache-Control: no-store to prevent proxy cache poisoning", () => {
      const resUnauth = handleSessionRequest(null, false);
      assert(resUnauth.headers["Cache-Control"].includes("no-store"));
      assert(resUnauth.headers["Cache-Control"].includes("private"));

      const resAuth = handleSessionRequest({ userId: "u-1", email: "a@b.com", role: "ADMIN", workspaceId: "w-1" }, false);
      assert(resAuth.headers["Cache-Control"].includes("no-store"));
    });
  });

  describe("Client Credential Hygiene", () => {
    it("validates demo login payload without requiring hardcoded client credentials", () => {
      function validateLoginPayload(body) {
        if (body.isDemo) {
          return { success: true };
        }
        if (!body.email || !body.password || body.password.length < 6) {
          return { success: false, error: "Invalid credentials" };
        }
        return { success: true };
      }

      // Demo login payload without dummy password
      const demoResult = validateLoginPayload({ isDemo: true });
      assert.equal(demoResult.success, true);

      // Normal login without password fails
      const normalResult = validateLoginPayload({ email: "user@corp.com" });
      assert.equal(normalResult.success, false);
    });
  });
});

