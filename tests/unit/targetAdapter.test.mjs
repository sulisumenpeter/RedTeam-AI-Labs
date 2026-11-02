import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Clean API key utility as implemented in externalTargetAdapter
function cleanApiKey(key) {
  if (!key) return undefined;
  const trimmed = key.trim().replace(/^["']|["']$/g, "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

class TargetHttpError extends Error {
  constructor(message, statusCode, isNonRetryable = false) {
    super(message);
    this.name = "TargetHttpError";
    this.statusCode = statusCode;
    this.isNonRetryable = isNonRetryable;
  }
}

// Simulated Adapter implementing identical logic to ExternalHttpTargetAdapter
class TestableExternalTargetAdapter {
  constructor(config, fetchImpl) {
    this.endpointUrl = config.endpointUrl;
    this.apiKey = cleanApiKey(config.apiKey);
    this.targetType = config.targetType || "OPENAI_COMPATIBLE";
    this.timeoutMs = config.timeoutMs || 10000;
    this.maxRetries = config.maxRetries ?? 2;
    this.fetchImpl = fetchImpl;
    this.attemptsExecuted = 0;
  }

  async execute(input) {
    let attempts = 0;
    let lastError = null;

    while (attempts <= this.maxRetries) {
      attempts++;
      this.attemptsExecuted = attempts;

      try {
        const headers = {
          "Content-Type": "application/json",
          "User-Agent": "RedTeam-AI-Governance-Assurance-Engine/1.0",
        };

        if (this.apiKey) {
          const authVal = this.apiKey.toLowerCase().startsWith("bearer ")
            ? this.apiKey
            : `Bearer ${this.apiKey}`;
          headers["Authorization"] = authVal;
        }

        const res = await this.fetchImpl(this.endpointUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ input }),
        });

        if (!res.ok) {
          let errorDetail = "";
          try {
            const errJson = await res.json();
            if (errJson?.error?.message) {
              errorDetail = String(errJson.error.message);
            } else if (errJson?.message) {
              errorDetail = String(errJson.message);
            }
          } catch {
            // Body was not JSON
          }

          if (res.status === 401) {
            const msg = !this.apiKey
              ? "Authentication required (HTTP 401 Unauthorized): No API key provided. Please enter a valid API key in the session key field or set TARGET_MODEL_API_KEY in your environment."
              : `Authentication failed (HTTP 401 Unauthorized): The target endpoint rejected the provided API key.${errorDetail ? ` Details: ${errorDetail}` : " Verify that the key is active, valid, and correctly formatted."}`;
            throw new TargetHttpError(msg, 401, true);
          }

          if (res.status === 403) {
            const msg = `Access forbidden (HTTP 403 Forbidden): The provided credentials do not have permission to access this endpoint or model.${errorDetail ? ` Details: ${errorDetail}` : ""}`;
            throw new TargetHttpError(msg, 403, true);
          }

          if (res.status === 404) {
            const msg = `Target endpoint not found (HTTP 404 Not Found): The URL '${this.endpointUrl}' was not found on the target server. Check that the path includes '/v1/chat/completions' or the expected route.`;
            throw new TargetHttpError(msg, 404, true);
          }

          if (res.status === 429) {
            const msg = `Rate limit or quota exceeded (HTTP 429 Too Many Requests): The target provider reported that quota or rate limits have been exceeded.${errorDetail ? ` Details: ${errorDetail}` : ""}`;
            throw new TargetHttpError(msg, 429, true);
          }

          if (res.status === 400) {
            const msg = `Bad Request (HTTP 400): Target rejected the request format.${errorDetail ? ` Details: ${errorDetail}` : " Check that the selected adapter protocol matches the endpoint."}`;
            throw new TargetHttpError(msg, 400, true);
          }

          throw new TargetHttpError(
            `Target endpoint returned HTTP status ${res.status} ${res.statusText}${errorDetail ? `: ${errorDetail}` : ""}`,
            res.status,
            res.status >= 400 && res.status < 500
          );
        }

        const data = await res.json();
        return {
          response: data.choices?.[0]?.message?.content || data.response || "",
          attempts,
        };
      } catch (err) {
        lastError = err;
        if (err.isNonRetryable) {
          throw err;
        }
        if (attempts > this.maxRetries) {
          break;
        }
      }
    }

    throw new Error(`Target execution failed after ${attempts} attempts: ${lastError?.message}`);
  }
}

describe("Target Connection Probe & Credential Handling", () => {
  it("cleans and sanitizes API keys correctly", () => {
    assert.equal(cleanApiKey(undefined), undefined);
    assert.equal(cleanApiKey(""), undefined);
    assert.equal(cleanApiKey("   "), undefined);
    assert.equal(cleanApiKey('  "sk-test-12345"  '), "sk-test-12345");
    assert.equal(cleanApiKey("  'sk-test-67890'  "), "sk-test-67890");
    assert.equal(cleanApiKey("sk-clean-key"), "sk-clean-key");
  });

  it("formats Authorization header properly with Bearer prefix", async () => {
    let capturedHeaders = null;
    const mockFetch = async (url, options) => {
      capturedHeaders = options.headers;
      return {
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: "OK" } }] }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "sk-my-secret-key",
      },
      mockFetch
    );

    await adapter.execute("ping");
    assert.equal(capturedHeaders["Authorization"], "Bearer sk-my-secret-key");
  });

  it("avoids redundant Bearer prefix if already supplied", async () => {
    let capturedHeaders = null;
    const mockFetch = async (url, options) => {
      capturedHeaders = options.headers;
      return {
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: "OK" } }] }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "Bearer sk-prefixed-key",
      },
      mockFetch
    );

    await adapter.execute("ping");
    assert.equal(capturedHeaders["Authorization"], "Bearer sk-prefixed-key");
  });

  it("does not send Authorization header if API key is absent", async () => {
    let capturedHeaders = null;
    const mockFetch = async (url, options) => {
      capturedHeaders = options.headers;
      return {
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: "OK" } }] }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      { endpointUrl: "https://api.openai.com/v1/chat/completions" },
      mockFetch
    );

    await adapter.execute("ping");
    assert.equal(capturedHeaders["Authorization"], undefined);
  });

  it("immediately aborts on HTTP 401 without retrying (0 retries / 1 attempt only)", async () => {
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ error: { message: "Incorrect API key provided" } }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "sk-invalid-key",
        maxRetries: 2,
      },
      mockFetch
    );

    await assert.rejects(
      async () => {
        await adapter.execute("ping");
      },
      (err) => {
        assert(err instanceof TargetHttpError);
        assert.equal(err.statusCode, 401);
        assert.equal(err.isNonRetryable, true);
        assert(err.message.includes("Authentication failed (HTTP 401 Unauthorized)"));
        assert(err.message.includes("Incorrect API key provided"));
        // Key itself MUST NOT be exposed in the error message
        assert(!err.message.includes("sk-invalid-key"));
        return true;
      }
    );

    // CRITICAL: Verification that 401 was NOT retried
    assert.equal(callCount, 1, "401 errors must NOT be retried. Exactly 1 request attempt must occur.");
    assert.equal(adapter.attemptsExecuted, 1);
  });

  it("distinguishes missing API key on HTTP 401 with an actionable guidance message", async () => {
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ error: { message: "You didn't provide an API key." } }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        maxRetries: 2,
      },
      mockFetch
    );

    await assert.rejects(
      async () => {
        await adapter.execute("ping");
      },
      (err) => {
        assert(err instanceof TargetHttpError);
        assert.equal(err.statusCode, 401);
        assert.equal(err.isNonRetryable, true);
        assert(err.message.includes("Authentication required (HTTP 401 Unauthorized): No API key provided"));
        assert(err.message.includes("TARGET_MODEL_API_KEY"));
        return true;
      }
    );

    assert.equal(callCount, 1, "Missing-key 401 must abort immediately without retries.");
  });

  it("aborts immediately on HTTP 403 Forbidden with clear diagnostic message", async () => {
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ error: { message: "Country, region, or territory not supported" } }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "sk-restricted-key",
        maxRetries: 2,
      },
      mockFetch
    );

    await assert.rejects(
      async () => {
        await adapter.execute("ping");
      },
      (err) => {
        assert(err instanceof TargetHttpError);
        assert.equal(err.statusCode, 403);
        assert(err.message.includes("Access forbidden (HTTP 403 Forbidden)"));
        return true;
      }
    );

    assert.equal(callCount, 1);
  });

  it("aborts immediately on HTTP 404 with endpoint path guidance", async () => {
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ error: { message: "Invalid route" } }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/unknown",
        apiKey: "sk-test",
        maxRetries: 2,
      },
      mockFetch
    );

    await assert.rejects(
      async () => {
        await adapter.execute("ping");
      },
      (err) => {
        assert(err instanceof TargetHttpError);
        assert.equal(err.statusCode, 404);
        assert(err.message.includes("Target endpoint not found (HTTP 404 Not Found)"));
        assert(err.message.includes("/v1/chat/completions"));
        return true;
      }
    );

    assert.equal(callCount, 1);
  });

  it("aborts immediately on HTTP 429 Rate Limit / Quota Exceeded", async () => {
    let callCount = 0;
    const mockFetch = async () => {
      callCount++;
      return {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: async () => ({ error: { message: "You exceeded your current quota" } }),
      };
    };

    const adapter = new TestableExternalTargetAdapter(
      {
        endpointUrl: "https://api.openai.com/v1/chat/completions",
        apiKey: "sk-test",
        maxRetries: 2,
      },
      mockFetch
    );

    await assert.rejects(
      async () => {
        await adapter.execute("ping");
      },
      (err) => {
        assert(err instanceof TargetHttpError);
        assert.equal(err.statusCode, 429);
        assert(err.message.includes("Rate limit or quota exceeded (HTTP 429 Too Many Requests)"));
        return true;
      }
    );

    assert.equal(callCount, 1);
  });
});

