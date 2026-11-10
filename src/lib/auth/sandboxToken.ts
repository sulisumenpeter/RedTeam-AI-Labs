export const SANDBOX_WORKSPACE_ID = "a0000000-0000-0000-0000-000000000001";
// Both live PostgreSQL seeds and initialDemoStore share the same canonical sandbox UUID.
export const DEMO_MEMORY_WORKSPACE_ID = SANDBOX_WORKSPACE_ID;
export const SANDBOX_COOKIE_NAME = "redteam_sandbox_session";
export const SANDBOX_DEFAULT_EMAIL = "sandbox-evaluator@redteamailabs.internal";

function cleanEnvValue(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export function getSandboxSigningSecret(): string {
  return (
    cleanEnvValue(process.env.SANDBOX_SESSION_SECRET) ||
    cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    ""
  );
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
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

/**
 * Deterministically derives a project-scoped server password for the internal
 * sandbox evaluator account when DEMO_SANDBOX_PASSWORD is not explicitly set.
 * Runs exclusively on the server; zero secrets are placed in source or client bundles.
 */
export async function deriveSandboxPassword(email: string): Promise<string> {
  const secret = getSandboxSigningSecret();
  if (!secret) {
    throw new Error("Server signing secret unavailable for sandbox credentials.");
  }
  const digest = await hmacSha256Hex(secret, `sandbox-pwd:v1:${email.toLowerCase()}`);
  return `${digest.slice(0, 48)}!Aa1`;
}

/**
 * Issues a cryptographically signed, expiring sandbox session token
 * locked strictly to the pre-configured sandbox workspace.
 */
export async function createSignedSandboxToken(ttlSeconds = 60 * 60 * 24): Promise<string | null> {
  const secret = getSandboxSigningSecret();
  if (!secret) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `sandbox.${expiresAt}`;
  const sig = await hmacSha256Hex(secret, payload);
  return `${payload}.${sig}`;
}

/**
 * Validates the cryptographic signature and expiration of a sandbox session token
 * using constant-time string comparison. Compatible with Edge Runtime & Node.js.
 */
export async function verifySignedSandboxToken(token?: string): Promise<boolean> {
  if (!token) return false;
  const secret = getSandboxSigningSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "sandbox") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSig = await hmacSha256Hex(secret, `${parts[0]}.${parts[1]}`);
  const actualSig = parts[2];
  if (expectedSig.length !== actualSig.length) return false;

  let diff = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    diff |= expectedSig.charCodeAt(i) ^ actualSig.charCodeAt(i);
  }
  return diff === 0;
}
