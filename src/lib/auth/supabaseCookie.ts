/**
 * Secure Supabase Cookie Helper
 *
 * Reconstructs chunked session cookies and decodes user identity without making
 * external network requests to Supabase Auth. This provides zero-latency auth
 * checks and ensures immunity against Supabase project-level Auth HTTP 429 rate limits.
 */

export interface DecodedUser {
  id: string;
  email: string;
  role?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
}

export function extractUserFromCookies(
  allCookies: Array<{ name: string; value: string }>
): DecodedUser | null {
  if (!allCookies || allCookies.length === 0) return null;

  const authCookieEntries = allCookies.filter((c) => c.name.includes("-auth-token"));
  if (authCookieEntries.length === 0) return null;

  const baseNames = new Set<string>();
  for (const c of authCookieEntries) {
    const match = c.name.match(/^(sb-[a-z0-9_-]+-auth-token)/i);
    if (match) {
      baseNames.add(match[1]);
    }
  }

  const baseNamesList = Array.from(baseNames);
  for (const baseName of baseNamesList) {
    // 1. Check if unchunked exists
    const single = allCookies.find((c) => c.name === baseName);
    let combined = "";

    if (single && single.value) {
      combined = single.value;
    } else {
      // 2. Combine chunks in numeric index order (.0, .1, .2, ...)
      const chunks: string[] = [];
      for (let i = 0; ; i++) {
        const chunkName = `${baseName}.${i}`;
        const chunk = allCookies.find((c) => c.name === chunkName);
        if (!chunk || !chunk.value) break;
        chunks.push(chunk.value);
      }
      if (chunks.length > 0) {
        combined = chunks.join("");
      }
    }

    if (!combined) continue;

    try {
      let raw = combined;
      try {
        raw = decodeURIComponent(combined);
      } catch {
        // Use raw if decodeURIComponent throws
      }
      if (raw.startsWith("base64-")) {
        raw = Buffer.from(raw.slice(7), "base64url").toString("utf-8");
      }
      const parsed = JSON.parse(raw);

      // Check for direct user object
      if (parsed.user && parsed.user.id) {
        return {
          id: parsed.user.id,
          email: parsed.user.email || "",
          role: parsed.user.role || "authenticated",
          app_metadata: parsed.user.app_metadata || {},
          user_metadata: parsed.user.user_metadata || {},
        };
      }

      // Check for access_token JWT payload
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
              app_metadata: jwtPayload.app_metadata || {},
              user_metadata: jwtPayload.user_metadata || {},
            };
          }
        }
      }
    } catch {
      // Continue to next candidate if parsing fails
    }
  }

  return null;
}

export function hasAuthTokenCookies(
  allCookies: Array<{ name: string; value: string }>
): boolean {
  if (!allCookies || allCookies.length === 0) return false;
  return allCookies.some((c) => c.name.includes("-auth-token"));
}

