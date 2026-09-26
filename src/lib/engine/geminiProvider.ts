import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { ModelProvider } from "../domain/interfaces";

export class GeminiProvider implements ModelProvider {
  constructor(private modelName: string) {}

  async generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
    const { object } = await generateObject({
      model: google(this.modelName),
      schema: schema as any,
      prompt: prompt,
    });
    return object as T;
  }
}
