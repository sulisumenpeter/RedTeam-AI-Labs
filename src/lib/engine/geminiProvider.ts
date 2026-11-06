import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { ModelProvider } from "../domain/interfaces";

let circuitOpenUntil = 0;

export class GeminiProvider implements ModelProvider {
  constructor(private modelName: string) {}

  async generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
    const now = Date.now();
    if (now < circuitOpenUntil) {
      throw new Error("GeminiProvider circuit breaker open (API temporarily unavailable or rate-limited).");
    }

    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 2500;
    let timer: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        circuitOpenUntil = Date.now() + 60000; // Trip circuit breaker for 60 seconds
        reject(new Error(`GeminiProvider request timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const callPromise = (async () => {
      try {
        const { object } = await generateObject({
          model: google(this.modelName),
          schema: schema as any,
          prompt: prompt,
        });
        clearTimeout(timer);
        return object as T;
      } catch (err) {
        clearTimeout(timer);
        circuitOpenUntil = Date.now() + 60000; // Trip circuit breaker on failure
        throw err;
      }
    })();

    // Prevent unhandled promise rejections if timeoutPromise rejects before callPromise finishes
    callPromise.catch(() => {});

    return Promise.race([callPromise, timeoutPromise]);
  }
}
