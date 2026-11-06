import { z } from "zod";

// ==========================================
// 1. WORKSPACES & USERS
// ==========================================

export const WorkspaceRoleEnum = z.enum([
  "OWNER",
  "ADMIN",
  "GOVERNANCE_LEAD",
  "ASSESSOR",
  "AUDITOR",
]);

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z.string().min(2),
  description: z.string().optional(),
  tier: z.enum(["ENTERPRISE", "PRO", "PILOT"]).default("ENTERPRISE"),
  is_demo: z.boolean().default(false),
  created_at: z.string().optional(),
});

// ==========================================
// 2. AI SYSTEM INVENTORY
// ==========================================

export const RiskClassificationEnum = z.enum([
  "MINIMAL",
  "LIMITED",
  "HIGH",
  "UNACCEPTABLE",
]);

export const AISystemStatusEnum = z.enum([
  "ACTIVE",
  "UNDER_REVIEW",
  "DEPRECATED",
  "ARCHIVED",
]);

export const TargetTypeEnum = z.enum([
  "SYNTHETIC",
  "EXTERNAL_ENDPOINT",
  "OPENAI_COMPATIBLE",
  "AGENTIC_MCP_ENDPOINT",
]);

export const AISystemSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  name: z.string().min(2, "System name must be at least 2 characters"),
  description: z.string().optional(),
  business_owner: z.string().min(1, "Business owner is required"),
  technical_owner: z.string().min(1, "Technical owner is required"),
  ai_provider: z.string().min(1, "AI provider is required"),
  model_name: z.string().min(1, "Model name is required"),
  model_version: z.string().min(1, "Model version is required"),
  intended_purpose: z.string().min(5, "Intended purpose must be detailed"),
  deployment_environment: z.enum(["PRODUCTION", "STAGING", "PILOT", "INTERNAL"]).default("PRODUCTION"),
  industry: z.string().default("Legal Technology"),
  user_population: z.string().min(2, "User population is required"),
  data_categories: z.array(z.string()).default([]),
  decision_making_role: z.string().default("Advisory / Human in the Loop"),
  human_oversight_arrangements: z.string().min(5, "Oversight arrangements required"),
  system_status: AISystemStatusEnum.default("ACTIVE"),
  risk_classification: RiskClassificationEnum.default("HIGH"),
  target_type: TargetTypeEnum.default("SYNTHETIC"),
  target_endpoint: z.string().optional().nullable(),
  is_demo: z.boolean().default(false),
  created_at: z.string().optional(),
});

export const CreateAISystemInputSchema = AISystemSchema.omit({
  id: true,
  created_at: true,
});

// ==========================================
// 3. AI RISK MANAGEMENT
// ==========================================

export const RiskCategoryEnum = z.enum([
  "Privacy & Data Protection",
  "Security Vulnerabilities",
  "Prompt Injection",
  "Data Leakage",
  "Bias & Discrimination",
  "Hallucination & Factual Accuracy",
  "Transparency & Explainability",
  "Human Oversight & Control",
  "Accountability",
  "Reliability & Robustness",
  "Safety & Regulatory",
  "Intellectual Property",
]);

export const RiskStatusEnum = z.enum([
  "OPEN",
  "MITIGATING",
  "ACCEPTED",
  "RETIRED",
]);

export const RiskSchema = z.object({
  id: z.string().uuid(),
  risk_assessment_id: z.string().uuid().optional(),
  workspace_id: z.string().uuid(),
  ai_system_id: z.string().uuid(),
  category: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be detailed"),
  risk_owner: z.string().min(1, "Risk owner required"),
  inherent_likelihood: z.number().int().min(1).max(5),
  inherent_impact: z.number().int().min(1).max(5),
  inherent_score: z.number().int().min(1).max(25).optional(),
  mitigation_plan: z.string().min(5, "Mitigation plan required"),
  target_completion_date: z.string().optional().nullable(),
  residual_likelihood: z.number().int().min(1).max(5),
  residual_impact: z.number().int().min(1).max(5),
  residual_score: z.number().int().min(1).max(25).optional(),
  status: RiskStatusEnum.default("OPEN"),
  acceptance_rationale: z.string().optional().nullable(),
  created_at: z.string().optional(),
});

export const CreateRiskInputSchema = RiskSchema.omit({
  id: true,
  inherent_score: true,
  residual_score: true,
  created_at: true,
});

export function calculateRiskScore(likelihood: number, impact: number): number {
  const safeL = Math.min(5, Math.max(1, Math.round(likelihood)));
  const safeI = Math.min(5, Math.max(1, Math.round(impact)));
  return safeL * safeI;
}

export function getRiskLevel(score: number): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 16) return "CRITICAL";
  if (score >= 10) return "HIGH";
  if (score >= 5) return "MEDIUM";
  return "LOW";
}

// ==========================================
// 4. GOVERNANCE POLICIES & FRAMEWORKS
// ==========================================

export const ImplementationStatusEnum = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "IMPLEMENTED",
  "NOT_APPLICABLE",
  "NEEDS_REVIEW",
]);

export const GovernanceRequirementSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  expected_behavior: z.string(),
  severity_if_violated: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "PASS"]),
  mandatory: z.boolean().default(true),
  evaluation_method: z.string().default("Deterministic & Semantic"),
});

export const PolicySchema = z.object({
  id: z.string().uuid().optional(),
  workspace_id: z.string().uuid().optional(),
  name: z.string().min(3),
  description: z.string().optional(),
  version: z.string().default("1.0"),
  target_type: z.string().default("Legal Intake Assistant"),
  jurisdiction: z.string().optional(),
  requirements: z.array(GovernanceRequirementSchema),
  policy_hash: z.string().optional(),
  status: z.enum(["DRAFT", "APPROVED", "RETIRED"]).default("APPROVED"),
  is_immutable: z.boolean().default(false),
  created_at: z.string().optional(),
});

export const FrameworkControlSchema = z.object({
  id: z.string().uuid(),
  framework_version_id: z.string().uuid(),
  control_code: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  guidance: z.string().optional(),
  source_reference: z.string().optional(),
});

export const ControlMappingSchema = z.object({
  id: z.string().uuid().optional(),
  workspace_id: z.string().uuid(),
  policy_id: z.string().uuid(),
  framework_control_id: z.string().uuid(),
  requirement_id: z.string(),
  implementation_status: ImplementationStatusEnum.default("IN_PROGRESS"),
  control_owner: z.string(),
  evidence_notes: z.string().optional(),
});

// ==========================================
// 5. CAMPAIGNS, TEST CASES & FINDINGS
// ==========================================

export const TestCaseCategoryEnum = z.enum([
  "Prompt Injection",
  "Jailbreak / Safety Evasion",
  "Sensitive Information Leakage",
  "Bias / Disparate Treatment",
  "Hallucinated Legal Claims",
  "Governance / Policy Compliance",
  "Inadequate Transparency",
  "Unsafe Recommendations",
  "Inappropriate Tool Use",
  "Human Oversight Failures",
]);

export const TestCaseSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string(),
  objective: z.string(),
  expected_control: z.string(),
  attack_input: z.string(),
  requirement_id: z.string().optional().nullable(),
  control_id: z.string().optional().nullable(),
  evaluation_method: z.string().default("HYBRID"),
  paired_input: z.string().optional().nullable(),
  paired_attribute: z.string().optional().nullable(),
});

export const TestGeneratorResponseSchema = z.object({
  testCases: z.array(TestCaseSchema),
});

export const EvaluatorSignalSchema = z.object({
  is_violation: z.boolean(),
  rationale: z.string(),
  severity_signal: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "PASS"]),
  confidence_score: z.number().min(0).max(1).default(0.9),
  evidence: z.string().optional(),
});

export const FindingSeverityEnum = z.enum([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "PASS",
  "EVALUATION_ERROR",
]);

export const FindingSchema = z.object({
  id: z.string().uuid().optional(),
  test_run_id: z.string().uuid(),
  severity: FindingSeverityEnum,
  rationale: z.string(),
  evidence: z.string(),
  category: z.string().optional(),
  objective: z.string().optional(),
  attack_input: z.string().optional(),
  created_at: z.string().optional(),
});

export const CampaignSchema = z.object({
  id: z.string().uuid().optional(),
  workspace_id: z.string().uuid().optional(),
  ai_system_id: z.string().uuid().optional(),
  policy_id: z.string().uuid().optional(),
  name: z.string().min(2),
  status: z.enum(["DRAFT", "RUNNING", "COMPLETED", "FAILED"]).default("DRAFT"),
  execution_mode: z.enum(["DEMO_SYNTHETIC", "LIVE_EXTERNAL"]).default("DEMO_SYNTHETIC"),
  policy_hash: z.string(),
  policy_version: z.string().default("1.0"),
  target_version: z.string().default("1.0"),
  generator_version: z.string().default("gemini-1.5-flash"),
  evaluator_version: z.string().default("gemini-1.5-pro"),
  rubric_version: z.string().default("1.0"),
  random_seed: z.number().int().default(42),
  created_at: z.string().optional(),
  completed_at: z.string().optional().nullable(),
});

// ==========================================
// 6. INCIDENTS & REMEDIATION ACTIONS
// ==========================================

export const IncidentStatusEnum = z.enum([
  "OPEN",
  "ACKNOWLEDGED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "CLOSED",
]);

export const IncidentSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  ai_system_id: z.string().uuid(),
  finding_id: z.string().uuid().optional().nullable(),
  title: z.string().min(3),
  description: z.string().min(5),
  severity: FindingSeverityEnum,
  category: z.string(),
  status: IncidentStatusEnum.default("OPEN"),
  assigned_owner: z.string(),
  detected_at: z.string().optional(),
  resolved_at: z.string().optional().nullable(),
  resolution_notes: z.string().optional().nullable(),
});

export const RemediationStatusEnum = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "VERIFIED",
  "REOPENED",
]);

export const RemediationActionSchema = z.object({
  id: z.string().uuid(),
  incident_id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  ai_system_id: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().min(5),
  remediation_type: z.enum([
    "PROMPT_ENGINEERING",
    "SYSTEM_GUARDRAIL",
    "MODEL_RETRAINING",
    "POLICY_RESTRICTION",
    "HUMAN_IN_THE_LOOP",
  ]),
  assigned_owner: z.string(),
  due_date: z.string().optional().nullable(),
  status: RemediationStatusEnum.default("IN_PROGRESS"),
  verification_test_id: z.string().uuid().optional().nullable(),
  verification_result: z.enum(["PASS", "FAIL", "PENDING"]).optional().nullable(),
  closure_approved_by: z.string().optional().nullable(),
});

// ==========================================
// 7. AUDIT & EVIDENCE
// ==========================================

export const EvidenceTypeEnum = z.enum([
  "TEST_RESULT",
  "POLICY_SNAPSHOT",
  "RISK_ASSESSMENT",
  "REMEDIATION_RECORD",
  "INCIDENT_TRACE",
]);

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  workspace_id: z.string().uuid(),
  ai_system_id: z.string().uuid().optional().nullable(),
  evidence_type: EvidenceTypeEnum,
  title: z.string().min(3),
  description: z.string().min(5),
  source: z.string(),
  source_reference_id: z.string().optional().nullable(),
  content_hash: z.string(),
  verification_status: z.enum(["VERIFIED", "UNVERIFIED", "EXPIRED"]).default("VERIFIED"),
  verified_by: z.string().optional().nullable(),
  verified_at: z.string().optional().nullable(),
  metadata: z.record(z.any()).default({}),
  created_at: z.string().optional(),
});

export const AuditEventSchema = z.object({
  id: z.string().uuid().optional(),
  workspace_id: z.string().uuid(),
  user_id: z.string().uuid().optional().nullable(),
  actor_email: z.string().email(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  details: z.record(z.any()).default({}),
  ip_address: z.string().optional().nullable(),
  created_at: z.string().optional(),
});
