import { describe, it } from "node:test";
import assert from "node:assert/strict";

function assertPersistenceMode(supabaseConfigured, isDemoMode) {
  if (supabaseConfigured) {
    return "DATABASE";
  }
  if (isDemoMode) {
    return "DEMO_STORE";
  }
  throw new Error("Database persistence failure: Supabase credentials missing and demo mode not enabled.");
}

describe("Persistence Mode Enforcement", () => {
  it("enforces DATABASE mode when Supabase is properly configured", () => {
    const mode = assertPersistenceMode(true, false);
    assert.equal(mode, "DATABASE");
  });

  it("permits DEMO_STORE only when demo mode is explicitly enabled", () => {
    const mode = assertPersistenceMode(false, true);
    assert.equal(mode, "DEMO_STORE");
  });

  it("throws an explicit error when Supabase is unconfigured and demo mode is disabled (no silent fallback)", () => {
    assert.throws(
      () => {
        assertPersistenceMode(false, false);
      },
      {
        message: /Database persistence failure/,
      }
    );
  });
});

