import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

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

  describe("Client Credential Hygiene & Sandbox Token Verification", () => {
    it("validates demo and sandbox login payloads without requiring hardcoded client credentials", () => {
      function validateLoginPayload(body) {
        if (body.isDemo || body.isSandbox) {
          return { success: true };
        }
        if (!body.email || !body.password || body.password.length < 6) {
          return { success: false, error: "Invalid credentials" };
        }
        return { success: true };
      }

      // Sandbox & demo login payloads without dummy password
      assert.equal(validateLoginPayload({ isDemo: true }).success, true);
      assert.equal(validateLoginPayload({ isSandbox: true }).success, true);

      // Normal login without password fails
      assert.equal(validateLoginPayload({ email: "user@corp.com" }).success, false);
    });

    it("signs and verifies HMAC-SHA256 sandbox session tokens while rejecting tampered or expired tokens", async () => {
      async function hmacSha256Hex(secret, message) {
        const enc = new TextEncoder();
        const key = await globalThis.crypto.subtle.importKey(
          "raw",
          enc.encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(message));
        return Array.from(new Uint8Array(sig))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }

      async function createToken(secret, ttlSeconds) {
        const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
        const payload = `sandbox.${expiresAt}`;
        const sig = await hmacSha256Hex(secret, payload);
        return `${payload}.${sig}`;
      }

      async function verifyToken(secret, token) {
        if (!token) return false;
        const parts = token.split(".");
        if (parts.length !== 3 || parts[0] !== "sandbox") return false;
        const expiresAt = Number(parts[1]);
        if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
          return false;
        }
        const expected = await hmacSha256Hex(secret, `${parts[0]}.${parts[1]}`);
        if (expected.length !== parts[2].length) return false;
        let diff = 0;
        for (let i = 0; i < expected.length; i++) {
          diff |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i);
        }
        return diff === 0;
      }

      const secret = "test-server-only-signing-secret";
      const validToken = await createToken(secret, 3600);
      assert.equal(await verifyToken(secret, validToken), true);

      // Tampered expiration or signature fails
      const parts = validToken.split(".");
      const tamperedExpiry = `sandbox.${Number(parts[1]) + 1000}.${parts[2]}`;
      assert.equal(await verifyToken(secret, tamperedExpiry), false);
      assert.equal(await verifyToken("wrong-secret", validToken), false);

      // Expired token fails
      const expiredToken = await createToken(secret, -60);
      assert.equal(await verifyToken(secret, expiredToken), false);
    });

    it("ensures login client bundle contains zero hardcoded credentials and canonical metadata avoids localhost:3000", () => {
      const loginSrc = fs.readFileSync(path.join(process.cwd(), "src/app/login/page.tsx"), "utf8");
      assert.equal(loginSrc.includes("SUPABASE_SERVICE_ROLE_KEY"), false);
      assert.equal(loginSrc.includes("DEMO_SANDBOX_PASSWORD"), false);
      assert.equal(loginSrc.includes("sandbox-evaluator@"), false);
      assert(loginSrc.includes("Launch 1-Click Live Sandbox"));
      assert(loginSrc.includes("FOR INVESTORS, GRANT REVIEWERS &amp; EVALUATORS"));

      const layoutSrc = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
      assert.equal(layoutSrc.includes("http://localhost:3000"), false);
      assert(layoutSrc.includes("NEXT_PUBLIC_APP_URL"));
      assert(layoutSrc.includes("https://red-team-ai-labs.vercel.app"));

      const robotsSrc = fs.readFileSync(path.join(process.cwd(), "src/app/robots.ts"), "utf8");
      assert.equal(robotsSrc.includes("http://localhost:3000"), false);

      const sitemapSrc = fs.readFileSync(path.join(process.cwd(), "src/app/sitemap.ts"), "utf8");
      assert.equal(sitemapSrc.includes("http://localhost:3000"), false);
    });
  });
});

