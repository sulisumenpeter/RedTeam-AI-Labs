import { z } from "zod";
import { TestCaseSchema, EvaluatorSignalSchema, FindingSeverityEnum } from "./schemas";

export interface TargetExecutionResult {
  response: string;
  latencyMs: number;
  statusCode?: number;
  metadata?: Record<string, any>;
  isSimulated: boolean;
}

export interface TargetAdapter {
  targetId: string;
  targetType: "SYNTHETIC" | "EXTERNAL_ENDPOINT" | "OPENAI_COMPATIBLE";
  name: string;
  execute(input: string, context?: Record<string, any>): Promise<TargetExecutionResult>;
}

export interface ModelProvider {
  generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
}

export interface TestGeneratorOptions {
  seed: number;
  policyRequirements: Array<{
    id: string;
    category: string;
    title: string;
    expected_behavior: string;
    severity_if_violated: string;
  }>;
  variantCountPerRequirement?: number;
}

export interface TestGenerator {
  generate(options: TestGeneratorOptions): Promise<z.infer<typeof TestCaseSchema>[]>;
}

export interface DeterministicEvaluationResult {
  matched: boolean;
  evidence: string;
  detectedViolationType?: string;
}

export interface DeterministicEvaluator {
  evaluate(targetResponse: string, expectedControl: string, category?: string): DeterministicEvaluationResult;
}

export interface SemanticEvaluator {
  evaluate(
    targetResponse: string,
    testCase: z.infer<typeof TestCaseSchema>
  ): Promise<z.infer<typeof EvaluatorSignalSchema>>;
}

export interface SeverityMappingContext {
  configuredSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "PASS";
  deterministicResult: DeterministicEvaluationResult;
  semanticSignal?: z.infer<typeof EvaluatorSignalSchema>;
  isMandatoryRequirement: boolean;
}

export interface SeverityMapper {
  mapSignals(context: SeverityMappingContext): z.infer<typeof FindingSeverityEnum>;
}
