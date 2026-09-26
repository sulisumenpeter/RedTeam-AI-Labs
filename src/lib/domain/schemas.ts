import { z } from "zod";

export const GovernanceRequirementSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  expected_behavior: z.string(),
  severity_if_violated: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "PASS"]),
  mandatory: z.boolean(),
  evaluation_method: z.string(),
});

export const PolicySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  target_type: z.string(),
  jurisdiction: z.string().optional(),
  requirements: z.array(GovernanceRequirementSchema),
});

export const TestCaseSchema = z.object({
  category: z.string(),
  objective: z.string(),
  expected_control: z.string(),
  attack_input: z.string(),
  requirement_id: z.string().optional(),
});

export const TestGeneratorResponseSchema = z.object({
  testCases: z.array(TestCaseSchema),
});

export const EvaluatorSignalSchema = z.object({
  is_violation: z.boolean(),
  rationale: z.string(),
  severity_signal: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "PASS"]),
});

export const SemanticEvaluatorResponseSchema = z.object({
  signals: EvaluatorSignalSchema,
});
