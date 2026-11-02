-- supabase/migrations/0004_enterprise_governance_platform.sql
-- Enterprise AI Governance, Risk Management & Assurance Schema Migration
-- Preserves existing Campaigns, TestCases, TestRuns, Findings, and Policies tables while adding full enterprise relational data models.

-- 1. WORKSPACES & MEMBERSHIP
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    tier TEXT NOT NULL DEFAULT 'ENTERPRISE', -- ENTERPRISE, PRO, PILOT
    is_demo BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'ASSESSOR', -- OWNER, ADMIN, GOVERNANCE_LEAD, ASSESSOR, AUDITOR
    email TEXT,
    full_name TEXT
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);

-- 2. AI SYSTEM INVENTORY (Registry)
CREATE TABLE IF NOT EXISTS ai_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    business_owner TEXT NOT NULL,
    technical_owner TEXT NOT NULL,
    ai_provider TEXT NOT NULL,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    intended_purpose TEXT NOT NULL,
    deployment_environment TEXT NOT NULL DEFAULT 'PRODUCTION', -- PRODUCTION, STAGING, PILOT, INTERNAL
    industry TEXT NOT NULL DEFAULT 'Legal Technology',
    user_population TEXT NOT NULL,
    data_categories JSONB NOT NULL DEFAULT '["Privileged Legal Communications", "Tenant Disclosures"]',
    decision_making_role TEXT NOT NULL DEFAULT 'Advisory / Human in the Loop',
    human_oversight_arrangements TEXT NOT NULL,
    system_status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, UNDER_REVIEW, DEPRECATED, ARCHIVED
    risk_classification TEXT NOT NULL DEFAULT 'HIGH', -- MINIMAL, LIMITED, HIGH, UNACCEPTABLE (EU AI Act aligned)
    target_type TEXT NOT NULL DEFAULT 'SYNTHETIC', -- SYNTHETIC, EXTERNAL_ENDPOINT, OPENAI_COMPATIBLE
    target_endpoint TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_ai_systems_workspace ON ai_systems(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ai_systems_risk ON ai_systems(risk_classification);

-- 3. GOVERNANCE FRAMEWORKS & CONTROLS LIBRARY
CREATE TABLE IF NOT EXISTS frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL, -- NIST_AI_RMF, ISO_42001, EU_AI_ACT, OECD_AI
    description TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    official_uri TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS framework_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID NOT NULL REFERENCES frameworks(id) ON DELETE CASCADE,
    version_tag TEXT NOT NULL,
    effective_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(framework_id, version_tag)
);

CREATE TABLE IF NOT EXISTS framework_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_version_id UUID NOT NULL REFERENCES framework_versions(id) ON DELETE CASCADE,
    control_code TEXT NOT NULL, -- e.g. GOVERN-1.1, MAP-2.3, Annex-III-Art-9
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    guidance TEXT,
    source_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(framework_version_id, control_code)
);

CREATE INDEX IF NOT EXISTS idx_framework_controls_version ON framework_controls(framework_version_id);

-- 4. POLICIES & POLICY VERSIONS
-- Add workspace_id, status, and is_immutable to existing Policies table if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'policies' AND column_name = 'workspace_id') THEN
        ALTER TABLE Policies ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'policies' AND column_name = 'status') THEN
        ALTER TABLE Policies ADD COLUMN status TEXT NOT NULL DEFAULT 'APPROVED'; -- DRAFT, APPROVED, RETIRED
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'policies' AND column_name = 'is_immutable') THEN
        ALTER TABLE Policies ADD COLUMN is_immutable BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES Policies(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    policy_hash TEXT NOT NULL,
    requirements JSONB NOT NULL,
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(policy_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_policy_versions_policy ON policy_versions(policy_id);

-- 5. CONTROL MAPPINGS
CREATE TABLE IF NOT EXISTS control_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES Policies(id) ON DELETE CASCADE,
    framework_control_id UUID NOT NULL REFERENCES framework_controls(id) ON DELETE CASCADE,
    requirement_id TEXT NOT NULL,
    implementation_status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- NOT_STARTED, IN_PROGRESS, IMPLEMENTED, NOT_APPLICABLE, NEEDS_REVIEW
    control_owner TEXT NOT NULL,
    evidence_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_control_mappings_policy ON control_mappings(policy_id);
CREATE INDEX IF NOT EXISTS idx_control_mappings_control ON control_mappings(framework_control_id);

-- 6. AI RISK MANAGEMENT (Risk Register & Assessments)
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    assessor_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED', -- DRAFT, UNDER_REVIEW, COMPLETED
    overall_inherent_risk_score INTEGER NOT NULL DEFAULT 16,
    overall_residual_risk_score INTEGER NOT NULL DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_assessment_id UUID NOT NULL REFERENCES risk_assessments(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- Privacy, Security, Prompt Injection, Data Leakage, Bias, Hallucination, Transparency, Human Oversight, Safety, Regulatory
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_owner TEXT NOT NULL,
    inherent_likelihood INTEGER NOT NULL CHECK (inherent_likelihood BETWEEN 1 AND 5),
    inherent_impact INTEGER NOT NULL CHECK (inherent_impact BETWEEN 1 AND 5),
    inherent_score INTEGER GENERATED ALWAYS AS (inherent_likelihood * inherent_impact) STORED,
    mitigation_plan TEXT NOT NULL,
    target_completion_date DATE,
    residual_likelihood INTEGER NOT NULL CHECK (residual_likelihood BETWEEN 1 AND 5),
    residual_impact INTEGER NOT NULL CHECK (residual_impact BETWEEN 1 AND 5),
    residual_score INTEGER GENERATED ALWAYS AS (residual_likelihood * residual_impact) STORED,
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, MITIGATING, ACCEPTED, RETIRED
    acceptance_rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risks_system ON risks(ai_system_id);
CREATE INDEX IF NOT EXISTS idx_risks_category ON risks(category);

-- 7. ENHANCED CAMPAIGNS & ASSURANCE
-- Link campaigns to workspaces, ai_systems, policies, and policy_versions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'workspace_id') THEN
        ALTER TABLE Campaigns ADD COLUMN workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'ai_system_id') THEN
        ALTER TABLE Campaigns ADD COLUMN ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'policy_id') THEN
        ALTER TABLE Campaigns ADD COLUMN policy_id UUID REFERENCES Policies(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'execution_mode') THEN
        ALTER TABLE Campaigns ADD COLUMN execution_mode TEXT NOT NULL DEFAULT 'DEMO_SYNTHETIC'; -- DEMO_SYNTHETIC, LIVE_EXTERNAL
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'campaigns' AND column_name = 'completed_at') THEN
        ALTER TABLE Campaigns ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add control_id to testcases
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testcases' AND column_name = 'control_id') THEN
        ALTER TABLE TestCases ADD COLUMN control_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testcases' AND column_name = 'evaluation_method') THEN
        ALTER TABLE TestCases ADD COLUMN evaluation_method TEXT NOT NULL DEFAULT 'HYBRID';
    END IF;
END $$;

-- 8. INCIDENT & REMEDIATION MANAGEMENT
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    finding_id UUID REFERENCES Findings(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, REJECTED, CLOSED
    assigned_owner TEXT NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS remediation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    remediation_type TEXT NOT NULL, -- PROMPT_ENGINEERING, SYSTEM_GUARDRAIL, MODEL_RETRAINING, POLICY_RESTRICTION, HUMAN_IN_THE_LOOP
    assigned_owner TEXT NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- OPEN, IN_PROGRESS, RESOLVED, VERIFIED, REOPENED
    verification_test_id UUID REFERENCES TestCases(id) ON DELETE SET NULL,
    verification_result TEXT, -- PASS, FAIL, PENDING
    closure_approved_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_system ON incidents(ai_system_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_remediation_incident ON remediation_actions(incident_id);

-- 9. AUDIT EVIDENCE & IMMUTABLE LOGS
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL,
    evidence_type TEXT NOT NULL, -- TEST_RESULT, POLICY_SNAPSHOT, RISK_ASSESSMENT, REMEDIATION_RECORD, INCIDENT_TRACE
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    source_reference_id TEXT, -- e.g. campaign_id, test_run_id, policy_hash
    content_hash TEXT NOT NULL, -- SHA-256
    verification_status TEXT NOT NULL DEFAULT 'VERIFIED', -- VERIFIED, UNVERIFIED, EXPIRED
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL, -- POLICY_CREATED, CAMPAIGN_LAUNCHED, RISK_UPDATED, REMEDIATION_VERIFIED, REPORT_EXPORTED
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_workspace ON evidence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_evidence_system ON evidence(ai_system_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_workspace ON audit_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

