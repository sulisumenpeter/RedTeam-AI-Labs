import { describe, it } from "node:test";
import assert from "node:assert/strict";

const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./,
  /^::1$/,
  /^0:0:0:0:0:0:0:1$/,
  /^fc00:/i,
  /^fe80:/i,
  /^fd00:/i,
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "169.254.169.254",
  "instance-data",
  "metadata",
  "kubernetes.default",
  "kubernetes.default.svc",
];

function validateExternalTargetEndpoint(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { allowed: false, reason: "Target URL cannot be empty." };
  }

  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { allowed: false, reason: "Invalid target URL format." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { allowed: false, reason: `Unsupported protocol '${parsed.protocol}'. Only HTTPS and HTTP are permitted.` };
  }

  if (parsed.username || parsed.password) {
    return { allowed: false, reason: "Embedded URL credentials (userinfo) are prohibited." };
  }

  const hostname = parsed.hostname.toLowerCase();
  const cleanHost = hostname.replace(/^\[|\]$/g, "");

  for (const blocked of BLOCKED_HOSTNAMES) {
    if (cleanHost === blocked || cleanHost.endsWith(`.${blocked}`)) {
      return {
        allowed: false,
        reason: `Target hostname '${cleanHost}' is restricted (prohibited internal or metadata domain).`,
      };
    }
  }

  if (/^\d+$/.test(cleanHost)) {
    return {
      allowed: false,
      reason: "Numeric decimal IP addresses are prohibited to prevent SSRF bypass.",
    };
  }

  if (cleanHost.startsWith("::ffff:")) {
    const v4Part = cleanHost.replace(/^::ffff:/i, "");
    if (BLOCKED_IP_PATTERNS.some((p) => p.test(v4Part))) {
      return {
        allowed: false,
        reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
      };
    }
    const hexParts = v4Part.split(":");
    if (hexParts.length >= 1) {
      const highByte = parseInt(hexParts[0], 16) >> 8;
      if (
        highByte === 127 ||
        highByte === 10 ||
        highByte === 169 ||
        highByte === 192 ||
        highByte === 172 ||
        highByte === 0
      ) {
        return {
          allowed: false,
          reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
        };
      }
    }
  }

  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(cleanHost)) {
      return {
        allowed: false,
        reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
      };
    }
  }

  const port = parsed.port ? parseInt(parsed.port, 10) : parsed.protocol === "https:" ? 443 : 80;
  const prohibitedPorts = [21, 22, 23, 25, 53, 110, 143, 3306, 5432, 6379, 8080, 8443, 9200, 27017];
  if (prohibitedPorts.includes(port)) {
    return {
      allowed: false,
      reason: `Target port ${port} is restricted to prevent internal administrative service exploitation.`,
    };
  }

  return { allowed: true, sanitizedUrl: parsed.toString() };
}

describe("Advanced SSRF Guard & IP Evasion Protection", () => {
  it("blocks decimal-encoded IPv4 bypass attempts (e.g. http://2130706433/ = 127.0.0.1)", () => {
    const res = validateExternalTargetEndpoint("http://2130706433/api");
    assert.equal(res.allowed, false);
    assert.equal(res.reason.includes("private, loopback") || res.reason.includes("decimal IP"), true);
  });

  it("blocks embedded credentials in URLs (userinfo injection)", () => {
    const res = validateExternalTargetEndpoint("https://admin:secret@api.partner.com/v1");
    assert.equal(res.allowed, false);
    assert.equal(res.reason.includes("Embedded URL credentials"), true);
  });

  it("blocks IPv6 loopback and mapped addresses", () => {
    assert.equal(validateExternalTargetEndpoint("http://[::1]/api").allowed, false);
    assert.equal(validateExternalTargetEndpoint("http://[::ffff:127.0.0.1]/").allowed, false);
    assert.equal(validateExternalTargetEndpoint("http://[::ffff:169.254.169.254]/").allowed, false);
  });

  it("blocks restricted database and administrative ports", () => {
    assert.equal(validateExternalTargetEndpoint("http://external-partner.com:5432/api").allowed, false);
    assert.equal(validateExternalTargetEndpoint("http://external-partner.com:6379/eval").allowed, false);
    assert.equal(validateExternalTargetEndpoint("http://external-partner.com:22/").allowed, false);
    assert.equal(validateExternalTargetEndpoint("http://external-partner.com:27017/").allowed, false);
  });

  it("allows legitimate HTTPS endpoints on standard web ports", () => {
    const res = validateExternalTargetEndpoint("https://legal-ai.firm.com/api/v1/intake");
    assert.equal(res.allowed, true);
    assert.equal(res.sanitizedUrl, "https://legal-ai.firm.com/api/v1/intake");
  });
});
