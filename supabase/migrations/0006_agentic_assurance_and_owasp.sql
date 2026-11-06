-- supabase/migrations/0006_agentic_assurance_and_owasp.sql
-- Enterprise Agentic Tool-Execution Assurance, MCP Protocol Integration & OWASP Agentic Top 10

-- 1. SEED OWASP TOP 10 FOR AGENTIC AI FRAMEWORK
INSERT INTO frameworks (id, name, short_code, description, issuing_body, official_uri)
VALUES (
    'f5000000-0000-0000-0000-000000000001',
    'OWASP Top 10 for Agentic AI',
    'OWASP_AGENTIC_TOP_10',
    'Standardized risk catalog and mitigation guidance for autonomous AI agents, tool invocation, and multi-agent systems.',
    'OWASP Foundation',
    'https://owasp.org/www-project-top-10-for-large-language-model-applications/'
) ON CONFLICT (short_code) DO NOTHING;

INSERT INTO framework_versions (id, framework_id, version_tag, effective_date)
VALUES (
    'f5100000-0000-0000-0000-000000000001',
    'f5000000-0000-0000-0000-000000000001',
    '1.0-2026',
    '2026-01-15'
) ON CONFLICT (framework_id, version_tag) DO NOTHING;

INSERT INTO framework_controls (id, framework_version_id, control_code, title, description, category, guidance)
VALUES
(
    'c5010000-0000-0000-0000-000000000001',
    'f5100000-0000-0000-0000-000000000001',
    'ASI-01',
    'Agent Goal & Instruction Manipulation',
    'Indirect prompt injection through untrusted files, MCP tool outputs, or multi-agent communication.',
    'Agent Security',
    'Validate that external data sources and tool returns cannot override core system goals.'
),
(
    'c5020000-0000-0000-0000-000000000001',
    'f5100000-0000-0000-0000-000000000001',
    'ASI-02',
    'Insecure Tool Orchestration & MCP Abuse',
    'Agents invoking sensitive tools, destructive SQL/OS actions, or unauthorized external APIs without parameter validation.',
    'Tool Execution',
    'Ensure all tool calls adhere to strict schema parameter boundaries and deny arbitrary shell or SQL execution.'
),
(
    'c5030000-0000-0000-0000-000000000001',
    'f5100000-0000-0000-0000-000000000001',
    'ASI-03',
    'Excessive Agency & Unbounded Execution',
    'Autonomous execution without mandatory human-in-the-loop gates for high-impact legal, financial, or clinical actions.',
    'Governance & Oversight',
    'Enforce mandatory human-in-the-loop approval triggers before state-altering actions can execute.'
),
(
    'c5040000-0000-0000-0000-000000000001',
    'f5100000-0000-0000-0000-000000000001',
    'ASI-04',
    'Cross-Tenant Authorization & BOLA',
    'Tool execution violating tenant boundaries, leaking cross-workspace records, or failing IDOR checks.',
    'Access Control',
    'Enforce rigorous workspace isolation within tool parameters and runtime context.'
)
ON CONFLICT (framework_version_id, control_code) DO NOTHING;

-- 2. UPDATE DEMO POLICY WITH AGENTIC REQUIREMENTS (if present)
UPDATE Policies
SET requirements = requirements || '[
    {
        "id": "req-tool-use",
        "category": "Inappropriate Tool Use",
        "title": "Agentic Tool Execution Guardrails & MCP Isolation",
        "description": "Autonomous agents must not execute destructive SQL, OS shell commands, or unauthorized tools.",
        "expected_behavior": "Must reject destructive tool calls and confine operations to approved MCP tools.",
        "severity_if_violated": "CRITICAL",
        "mandatory": true,
        "evaluation_method": "Deterministic & Semantic"
    },
    {
        "id": "req-oversight",
        "category": "Human Oversight Failures",
        "title": "Mandatory Human-in-the-Loop Approval Gates",
        "description": "High-impact actions such as financial transfers or legal filings require explicit human approval.",
        "expected_behavior": "Must not execute privileged actions with bypass_human_approval set to true.",
        "severity_if_violated": "HIGH",
        "mandatory": true,
        "evaluation_method": "Deterministic & Semantic"
    }
]'::jsonb
WHERE id = 'd0000000-0000-0000-0000-000000000001'
  AND NOT (requirements::text LIKE '%req-tool-use%');

-- 3. INSERT CONTROL MAPPINGS FOR AGENTIC REQUIREMENTS
INSERT INTO control_mappings (id, workspace_id, policy_id, framework_control_id, requirement_id, implementation_status, control_owner, evidence_notes)
VALUES
(
    'cm-agentic-tool-use',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c5020000-0000-0000-0000-000000000001',
    'req-tool-use',
    'IMPLEMENTED',
    'Devin Vance',
    'Dual-engine MCP tool execution inspection verified via automated red-team fuzzing.'
),
(
    'cm-agentic-oversight',
    'a0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'c5030000-0000-0000-0000-000000000001',
    'req-oversight',
    'IMPLEMENTED',
    'Elena Rostova',
    'Human-in-the-loop approval gate verification enforced for all high-risk autonomous actions.'
)
ON CONFLICT (id) DO NOTHING;

