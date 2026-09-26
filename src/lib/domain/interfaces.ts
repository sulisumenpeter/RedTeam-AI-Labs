import { z } from "zod";
import { TestCaseSchema, EvaluatorSignalSchema } from "./schemas";

export interface TargetAdapter {
  execute(input: string, context?: any): Promise<string>;
}

export interface ModelProvider {
  generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
}

export interface TestGenerator {
  generate(categories: string[], seed: number): Promise<z.infer<typeof TestCaseSchema>[]>;
}

export interface DeterministicEvaluator {
  evaluate(targetResponse: string, expectedControl: string): {
    matched: boolean;
    evidence: string;
  };
}

export interface SemanticEvaluator {
  evaluate(targetResponse: string, testCase: z.infer<typeof TestCaseSchema>): Promise<z.infer<typeof EvaluatorSignalSchema>>;
}

export interface SeverityMapper {
  mapSignals(
    deterministicMatch: boolean,
    semanticSignal?: z.infer<typeof EvaluatorSignalSchema>
  ): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "PASS" | "EVALUATION_ERROR";
}
