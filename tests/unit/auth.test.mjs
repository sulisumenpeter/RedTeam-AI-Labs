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

