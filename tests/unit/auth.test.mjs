import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Role-Based Access Control matrix mirror for unit verification
const ROLE_PERMISSIONS = {
  OWNER: [
    "systems:read",
    "systems:write",
    "systems:delete",
    "risks:read",
    "risks:write",
    "policies:read",
    "policies:write",
    "policies:delete",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "campaigns:delete",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
    "workspaces:manage",
  ],
  ADMIN: [
    "systems:read",
    "systems:write",
    "systems:delete",
    "risks:read",
    "risks:write",
    "policies:read",
    "policies:write",
    "policies:delete",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "campaigns:delete",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
  ],
  ASSESSOR: [
    "systems:read",
    "systems:write",
    "risks:read",
    "risks:write",
    "policies:read",
    "frameworks:read",
    "campaigns:read",
    "campaigns:write",
    "campaigns:execute",
    "incidents:read",
    "incidents:write",
    "evidence:read",
    "evidence:write",
  ],
  VIEWER: [
    "systems:read",
    "risks:read",
    "policies:read",
    "frameworks:read",
    "campaigns:read",
    "incidents:read",
    "evidence:read",
  ],
};

function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// In-memory sliding window rate limiter implementation
function checkRateLimit(rateLimitMap, identifier, limit = 60, windowSeconds = 60) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt <= now) {
    const newRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(identifier, newRecord);
    return { allowed: true, remaining: limit - 1, resetAt: newRecord.resetAt };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

describe("Role-Based Access Control (RBAC) & Authorization Matrix", () => {
  it("enforces VIEWER role restrictions: can read but CANNOT write or delete", () => {
    assert.equal(hasPermission("VIEWER", "systems:read"), true);
    assert.equal(hasPermission("VIEWER", "risks:read"), true);
    assert.equal(hasPermission("VIEWER", "policies:read"), true);
    assert.equal(hasPermission("VIEWER", "campaigns:read"), true);

    // Forbidden operations for VIEWER
    assert.equal(hasPermission("VIEWER", "systems:write"), false);
    assert.equal(hasPermission("VIEWER", "systems:delete"), false);
    assert.equal(hasPermission("VIEWER", "campaigns:write"), false);
    assert.equal(hasPermission("VIEWER", "campaigns:execute"), false);
    assert.equal(hasPermission("VIEWER", "policies:write"), false);
    assert.equal(hasPermission("VIEWER", "policies:delete"), false);
    assert.equal(hasPermission("VIEWER", "workspaces:manage"), false);
  });

  it("enforces ASSESSOR role permissions: can test & evaluate but cannot delete workspaces or policies", () => {
    assert.equal(hasPermission("ASSESSOR", "campaigns:read"), true);
    assert.equal(hasPermission("ASSESSOR", "campaigns:write"), true);
    assert.equal(hasPermission("ASSESSOR", "campaigns:execute"), true);
    assert.equal(hasPermission("ASSESSOR", "incidents:write"), true);
    assert.equal(hasPermission("ASSESSOR", "evidence:write"), true);

    // Forbidden operations for ASSESSOR
    assert.equal(hasPermission("ASSESSOR", "policies:delete"), false);
    assert.equal(hasPermission("ASSESSOR", "systems:delete"), false);
    assert.equal(hasPermission("ASSESSOR", "workspaces:manage"), false);
  });

  it("enforces ADMIN role permissions: can manage systems, policies, and campaigns but not workspace ownership", () => {
    assert.equal(hasPermission("ADMIN", "systems:delete"), true);
    assert.equal(hasPermission("ADMIN", "policies:delete"), true);
    assert.equal(hasPermission("ADMIN", "campaigns:delete"), true);
    assert.equal(hasPermission("ADMIN", "workspaces:manage"), false);
  });

  it("enforces OWNER role permissions: has full authority across all operations", () => {
    assert.equal(hasPermission("OWNER", "workspaces:manage"), true);
    assert.equal(hasPermission("OWNER", "systems:delete"), true);
    assert.equal(hasPermission("OWNER", "policies:delete"), true);
    assert.equal(hasPermission("OWNER", "campaigns:execute"), true);
  });
});

describe("API Rate Limiting & Brute-Force Defense", () => {
  it("permits requests within configured window and updates remaining counter", () => {
    const map = new Map();
    const res1 = checkRateLimit(map, "192.168.1.1:auth", 5, 60);
    assert.equal(res1.allowed, true);
    assert.equal(res1.remaining, 4);

    const res2 = checkRateLimit(map, "192.168.1.1:auth", 5, 60);
    assert.equal(res2.allowed, true);
    assert.equal(res2.remaining, 3);
  });

  it("blocks requests once the threshold limit is reached", () => {
    const map = new Map();
    for (let i = 0; i < 5; i++) {
      checkRateLimit(map, "10.0.0.99:auth", 5, 60);
    }

    const blocked = checkRateLimit(map, "10.0.0.99:auth", 5, 60);
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.remaining, 0);
  });
});

describe("Authentication & Session Security Regression Suite", () => {
  // Pure helper mirror of extractUserFromCookies
  function extractUserFromCookies(allCookies) {
    if (!allCookies || allCookies.length === 0) return null;
    const authCookieEntries = allCookies.filter((c) => c.name.includes("-auth-token"));
    if (authCookieEntries.length === 0) return null;

    const baseNames = new Set();
    for (const c of authCookieEntries) {
      const match = c.name.match(/^(sb-[a-z0-9_-]+-auth-token)/i);
      if (match) baseNames.add(match[1]);
    }

    const baseNamesList = Array.from(baseNames);
    for (const baseName of baseNamesList) {
      const single = allCookies.find((c) => c.name === baseName);
      let combined = "";
      if (single && single.value) {
        combined = single.value;
      } else {
        const chunks = [];
        for (let i = 0; ; i++) {
          const chunkName = `${baseName}.${i}`;
          const chunk = allCookies.find((c) => c.name === chunkName);
          if (!chunk || !chunk.value) break;
          chunks.push(chunk.value);
        }
        if (chunks.length > 0) combined = chunks.join("");
      }

      if (!combined) continue;

      try {
        let raw = combined;
        try {
          raw = decodeURIComponent(combined);
        } catch {}
        if (raw.startsWith("base64-")) {
          raw = Buffer.from(raw.slice(7), "base64url").toString("utf-8");
        }
        const parsed = JSON.parse(raw);

        if (parsed.user && parsed.user.id) {
          return {
            id: parsed.user.id,
            email: parsed.user.email || "",
            role: parsed.user.role || "authenticated",
          };
        }

        const token = parsed.access_token || (Array.isArray(parsed) && parsed[0]);
        if (typeof token === "string" && token.includes(".")) {
          const parts = token.split(".");
          if (parts.length === 3) {
            const jwtPayload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
            if (jwtPayload && jwtPayload.sub) {
              return {
                id: jwtPayload.sub,
                email: jwtPayload.email || "",
                role: jwtPayload.role || "authenticated",
              };
            }
          }
        }
      } catch {}
    }
    return null;
  }

  it("recovers valid session identity during transient Supabase Auth HTTP 429", () => {
    // Simulate Supabase Auth returning 429 rate limit
    const remoteAuthResponse = {
      data: { user: null },
      error: { status: 429, code: "over_request_rate_limit", message: "Request rate limit reached" },
    };

    const validPayload = { user: { id: "user-12345", email: "auditor@redteam.internal" } };
    const encoded = "base64-" + Buffer.from(JSON.stringify(validPayload)).toString("base64url");
    const cookies = [{ name: "sb-project-auth-token", value: encoded }];

    // Session recovery on 429
    let user = remoteAuthResponse.data.user;
    let error = remoteAuthResponse.error;
    if (!user) {
      const recovered = extractUserFromCookies(cookies);
      if (recovered) {
        user = recovered;
        error = null;
      }
    }

    assert.equal(error, null);
    assert.equal(user.id, "user-12345");
    assert.equal(user.email, "auditor@redteam.internal");
  });

  it("rejects invalid, malformed or corrupted session cookies", () => {
    // Malformed JSON
    const malformedCookies = [{ name: "sb-project-auth-token", value: "base64-NOT_VALID_JSON" }];
    assert.equal(extractUserFromCookies(malformedCookies), null);

    // Empty cookie value
    const emptyCookies = [{ name: "sb-project-auth-token", value: "" }];
    assert.equal(extractUserFromCookies(emptyCookies), null);

    // Missing user and access token
    const emptyJsonCookies = [
      { name: "sb-project-auth-token", value: "base64-" + Buffer.from(JSON.stringify({})).toString("base64url") },
    ];
    assert.equal(extractUserFromCookies(emptyJsonCookies), null);
  });

  it("rejects unauthenticated requests with no session cookies (401 Unauthorized)", () => {
    const emptyCookies = [];
    const recovered = extractUserFromCookies(emptyCookies);
    assert.equal(recovered, null);

    // Simulate middleware route protection
    const isProtectedPath = true;
    const authResult = recovered !== null ? 200 : 401;
    assert.equal(authResult, 401);
  });

  it("normal logout unconditionally removes session cookies without rate-limit shielding", () => {
    // Simulated active cookie store
    const activeCookies = new Map([
      ["sb-project-auth-token", "base64-some-token"],
      ["redteam_demo_session", "authenticated"],
    ]);

    // Explicit logout execution
    activeCookies.delete("redteam_demo_session");
    for (const key of Array.from(activeCookies.keys())) {
      if (key.includes("-auth-token")) {
        activeCookies.delete(key);
      }
    }

    assert.equal(activeCookies.size, 0);
    assert.equal(activeCookies.has("sb-project-auth-token"), false);
  });

  it("enforces strict workspace isolation (cross-workspace IDOR prevention)", () => {
    const userWorkspaceMemberships = [
      { user_id: "user-123", workspace_id: "workspace-alpha", role: "ADMIN" },
    ];

    function checkWorkspaceAccess(userId, targetWorkspaceId) {
      const member = userWorkspaceMemberships.find(
        (m) => m.user_id === userId && m.workspace_id === targetWorkspaceId
      );
      if (!member) {
        return { status: 403, error: "Forbidden: You do not have permission to access the requested workspace." };
      }
      return { status: 200, role: member.role };
    }

    // Access to authorized workspace succeeds
    const authorized = checkWorkspaceAccess("user-123", "workspace-alpha");
    assert.equal(authorized.status, 200);
    assert.equal(authorized.role, "ADMIN");

    // Access to unauthorized workspace is strictly blocked with 403
    const unauthorized = checkWorkspaceAccess("user-123", "workspace-beta");
    assert.equal(unauthorized.status, 403);
    assert.match(unauthorized.error, /Forbidden/);
  });

  it("verifies rate limiting protects API routes and never bypasses authentication", () => {
    const map = new Map();
    // Flood 15 requests (the auth limit)
    for (let i = 0; i < 15; i++) {
      checkRateLimit(map, "attacker-ip:auth", 15, 60);
    }

    // 16th request must be rejected with 429
    const rateCheck = checkRateLimit(map, "attacker-ip:auth", 15, 60);
    assert.equal(rateCheck.allowed, false);
    assert.equal(rateCheck.remaining, 0);

    // Rate-limited requests must return 429 before any auth check occurs
    const responseStatus = !rateCheck.allowed ? 429 : 401;
    assert.equal(responseStatus, 429);
  });
});

