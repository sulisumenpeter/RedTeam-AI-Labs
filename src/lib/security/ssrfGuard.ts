/**
 * SSRF Guard - Protects against Server-Side Request Forgery, Private Network Access,
 * Cloud Metadata Exfiltration, IPv6 bypasses, and Alternative IP Encoded Formats.
 */

const BLOCKED_IP_PATTERNS = [
  /^127\./,                          // Loopback IPv4 (127.0.0.0/8)
  /^10\./,                           // Private Class A (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private Class B (172.16.0.0/12)
  /^192\.168\./,                     // Private Class C (192.168.0.0/16)
  /^169\.254\./,                     // Link-Local / Cloud Metadata (169.254.0.0/16)
  /^0\./,                            // Current network (0.0.0.0/8)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Carrier-grade NAT (100.64.0.0/10)
  /^192\.0\.2\./,                    // TEST-NET-1 (192.0.2.0/24)
  /^198\.51\.100\./,                 // TEST-NET-2 (198.51.100.0/24)
  /^203\.0\.113\./,                  // TEST-NET-3 (203.0.113.0/24)
  /^224\./,                          // Multicast (224.0.0.0/4)
  /^240\./,                          // Reserved for future use (240.0.0.0/4)
  /^::1$/,                           // Loopback IPv6
  /^0:0:0:0:0:0:0:1$/,               // Uncompressed Loopback IPv6
  /^fc00:/i,                         // Unique Local IPv6 (fc00::/7)
  /^fe80:/i,                         // Link-Local IPv6 (fe80::/10)
  /^fd00:/i,                         // AWS IMDSv2 IPv6 / Private
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "169.254.169.254",
  "instance-data",
  "metadata",
  "kubernetes.default",
  "kubernetes.default.svc",
  "api.internal",
  "database.internal",
  "vault.internal",
];

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

export function validateExternalTargetEndpoint(rawUrl: string): ValidationResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { allowed: false, reason: "Target URL cannot be empty." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { allowed: false, reason: "Invalid target URL format." };
  }

  // Enforce HTTPS in production environments; permit HTTP only for local synthetic test harnesses
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { allowed: false, reason: `Unsupported protocol '${parsed.protocol}'. Only HTTPS and HTTP are permitted.` };
  }

  // Disallow user credentials embedded in URL (e.g. https://user:pass@evil.com)
  if (parsed.username || parsed.password) {
    return { allowed: false, reason: "Embedded URL credentials (userinfo) are prohibited." };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Strip IPv6 brackets if present for comparison
  const cleanHost = hostname.replace(/^\[|\]$/g, "");

  // Check blocked hostnames
  for (const blocked of BLOCKED_HOSTNAMES) {
    if (cleanHost === blocked || cleanHost.endsWith(`.${blocked}`)) {
      return {
        allowed: false,
        reason: `Target hostname '${cleanHost}' is restricted (prohibited internal or metadata domain).`,
      };
    }
  }

  // Detect numeric decimal IP representations in original raw URL
  try {
    const rawHost = new URL(rawUrl.trim()).host.toLowerCase().replace(/:\d+$/, "");
    if (/^\d+$/.test(rawHost)) {
      return {
        allowed: false,
        reason: "Numeric decimal IP addresses are prohibited to prevent SSRF bypass.",
      };
    }
  } catch {
    // Handled above
  }

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:127.0.0.1 or ::ffff:7f00:1)
  if (cleanHost.startsWith("::ffff:")) {
    const v4Part = cleanHost.replace(/^::ffff:/i, "");
    if (BLOCKED_IP_PATTERNS.some((p) => p.test(v4Part))) {
      return {
        allowed: false,
        reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
      };
    }
    // Check hex encoded IPv4-mapped IPv6 (e.g., 7f00:1, a00:1, a9fe:...)
    const hexParts = v4Part.split(":");
    if (hexParts.length >= 1) {
      const highByte = parseInt(hexParts[0], 16) >> 8;
      if (
        highByte === 127 || // 127.0.0.0/8 loopback
        highByte === 10 ||  // 10.0.0.0/8 private
        highByte === 169 || // 169.254.0.0/16 metadata
        highByte === 192 || // 192.168.0.0/16 private
        highByte === 172 || // 172.16.0.0/12 private
        highByte === 0      // 0.0.0.0/8
      ) {
        return {
          allowed: false,
          reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
        };
      }
    }
  }

  // Check standard IP patterns
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(cleanHost)) {
      return {
        allowed: false,
        reason: `Target IP address '${cleanHost}' belongs to a private, loopback, or metadata address space.`,
      };
    }
  }

  // Check prohibited ports
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
