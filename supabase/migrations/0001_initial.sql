-- supabase/migrations/0001_initial.sql

CREATE TABLE Campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, RUNNING, COMPLETED
    policy_hash TEXT NOT NULL,
    policy_version TEXT NOT NULL,
    target_version TEXT NOT NULL,
    generator_version TEXT NOT NULL,
    evaluator_version TEXT NOT NULL,
    rubric_version TEXT NOT NULL,
    random_seed INTEGER NOT NULL
);

CREATE TABLE TestCases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES Campaigns(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category TEXT NOT NULL,
    objective TEXT NOT NULL,
    expected_control TEXT NOT NULL,
    attack_input TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' -- PENDING, RUNNING, COMPLETED, FAILED
);

CREATE TABLE TestRuns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL REFERENCES TestCases(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES Campaigns(id) ON DELETE CASCADE,
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_response TEXT,
    evaluator_raw_output TEXT,
    status TEXT NOT NULL DEFAULT 'COMPLETED'
);

CREATE TABLE Findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_run_id UUID NOT NULL REFERENCES TestRuns(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity TEXT NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW, PASS, EVALUATION_ERROR
    rationale TEXT NOT NULL,
    evidence TEXT NOT NULL
);

CREATE INDEX idx_testcases_campaign_id ON TestCases(campaign_id);
CREATE INDEX idx_testruns_campaign_id ON TestRuns(campaign_id);
CREATE INDEX idx_testruns_test_case_id ON TestRuns(test_case_id);
CREATE INDEX idx_findings_test_run_id ON Findings(test_run_id);
