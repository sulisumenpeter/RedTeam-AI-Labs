-- supabase/migrations/0006_row_level_security_and_hardening.sql
-- Enterprise AI Governance & Assurance Platform: Row Level Security (RLS) & Multi-Tenant Isolation
-- Enforces workspace isolation, role-based access control, tamper-resistant audit logs, and IDOR prevention.

-- =============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS (Explicit search_path = public)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.workspace_members
        WHERE workspace_id = ws_id
          AND user_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.get_workspace_role(ws_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role
    FROM public.workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(ws_id UUID, required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.workspace_members
        WHERE workspace_id = ws_id
          AND user_id = auth.uid()
          AND role = ANY(required_roles)
    );
$$;

-- =============================================================================
-- 2. ENABLE ROW LEVEL SECURITY ACROSS ALL TABLES
-- =============================================================================

ALTER TABLE IF EXISTS public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.framework_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.framework_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.policy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.control_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."TestCases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.testruns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."TestRuns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public."Findings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.remediation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_events ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. WORKSPACES & WORKSPACE MEMBERS POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "workspaces_select_member" ON public.workspaces;
CREATE POLICY "workspaces_select_member" ON public.workspaces
    FOR SELECT
    USING (public.is_workspace_member(id) OR is_demo = TRUE);

DROP POLICY IF EXISTS "workspaces_insert_authenticated" ON public.workspaces;
CREATE POLICY "workspaces_insert_authenticated" ON public.workspaces
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "workspaces_update_admin" ON public.workspaces;
CREATE POLICY "workspaces_update_admin" ON public.workspaces
    FOR UPDATE
    USING (public.has_workspace_role(id, ARRAY['OWNER', 'ADMIN']));

DROP POLICY IF EXISTS "workspaces_delete_owner" ON public.workspaces;
CREATE POLICY "workspaces_delete_owner" ON public.workspaces
    FOR DELETE
    USING (public.has_workspace_role(id, ARRAY['OWNER']));

-- Workspace Members
DROP POLICY IF EXISTS "members_select_colleagues" ON public.workspace_members;
CREATE POLICY "members_select_colleagues" ON public.workspace_members
    FOR SELECT
    USING (public.is_workspace_member(workspace_id) OR user_id = auth.uid());

DROP POLICY IF EXISTS "members_manage_admin" ON public.workspace_members;
CREATE POLICY "members_manage_admin" ON public.workspace_members
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN']));

-- =============================================================================
-- 4. GLOBAL FRAMEWORKS & CONTROLS LIBRARY (Readable by all authenticated users)
-- =============================================================================

DROP POLICY IF EXISTS "frameworks_read_all" ON public.frameworks;
CREATE POLICY "frameworks_read_all" ON public.frameworks
    FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "framework_versions_read_all" ON public.framework_versions;
CREATE POLICY "framework_versions_read_all" ON public.framework_versions
    FOR SELECT
    USING (TRUE);

DROP POLICY IF EXISTS "framework_controls_read_all" ON public.framework_controls;
CREATE POLICY "framework_controls_read_all" ON public.framework_controls
    FOR SELECT
    USING (TRUE);

-- =============================================================================
-- 5. AI SYSTEMS INVENTORY POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "ai_systems_select_member" ON public.ai_systems;
CREATE POLICY "ai_systems_select_member" ON public.ai_systems
    FOR SELECT
    USING (public.is_workspace_member(workspace_id) OR is_demo = TRUE);

DROP POLICY IF EXISTS "ai_systems_insert_authorized" ON public.ai_systems;
CREATE POLICY "ai_systems_insert_authorized" ON public.ai_systems
    FOR INSERT
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

DROP POLICY IF EXISTS "ai_systems_update_authorized" ON public.ai_systems;
CREATE POLICY "ai_systems_update_authorized" ON public.ai_systems
    FOR UPDATE
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

DROP POLICY IF EXISTS "ai_systems_delete_admin" ON public.ai_systems;
CREATE POLICY "ai_systems_delete_admin" ON public.ai_systems
    FOR DELETE
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN']));

-- =============================================================================
-- 6. POLICIES & POLICY VERSIONS
-- =============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'policies') THEN
        DROP POLICY IF EXISTS "policies_select_member" ON public.policies;
        CREATE POLICY "policies_select_member" ON public.policies
            FOR SELECT USING (workspace_id IS NULL OR public.is_workspace_member(workspace_id));

        DROP POLICY IF EXISTS "policies_insert_authorized" ON public.policies;
        CREATE POLICY "policies_insert_authorized" ON public.policies
            FOR INSERT WITH CHECK (workspace_id IS NOT NULL AND public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

        DROP POLICY IF EXISTS "policies_update_authorized" ON public.policies;
        CREATE POLICY "policies_update_authorized" ON public.policies
            FOR UPDATE USING (workspace_id IS NOT NULL AND is_immutable = FALSE AND public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN']));
    END IF;
END $$;

DROP POLICY IF EXISTS "policy_versions_select" ON public.policy_versions;
CREATE POLICY "policy_versions_select" ON public.policy_versions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.policies p
            WHERE p.id = policy_id AND (p.workspace_id IS NULL OR public.is_workspace_member(p.workspace_id))
        )
    );

-- =============================================================================
-- 7. CONTROL MAPPINGS POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "mappings_select_member" ON public.control_mappings;
CREATE POLICY "mappings_select_member" ON public.control_mappings
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "mappings_modify_authorized" ON public.control_mappings;
CREATE POLICY "mappings_modify_authorized" ON public.control_mappings
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

-- =============================================================================
-- 8. RISK ASSESSMENTS & RISKS POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "risk_assessments_select" ON public.risk_assessments;
CREATE POLICY "risk_assessments_select" ON public.risk_assessments
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "risk_assessments_modify" ON public.risk_assessments;
CREATE POLICY "risk_assessments_modify" ON public.risk_assessments
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

DROP POLICY IF EXISTS "risks_select" ON public.risks;
CREATE POLICY "risks_select" ON public.risks
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "risks_modify" ON public.risks;
CREATE POLICY "risks_modify" ON public.risks
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

-- =============================================================================
-- 9. ASSURANCE CAMPAIGNS, TESTCASES, RUNS & FINDINGS POLICIES
-- =============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'campaigns') THEN
        DROP POLICY IF EXISTS "campaigns_select" ON public.campaigns;
        CREATE POLICY "campaigns_select" ON public.campaigns
            FOR SELECT USING (workspace_id IS NULL OR public.is_workspace_member(workspace_id));

        DROP POLICY IF EXISTS "campaigns_modify" ON public.campaigns;
        CREATE POLICY "campaigns_modify" ON public.campaigns
            FOR ALL USING (workspace_id IS NOT NULL AND public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testcases') THEN
        DROP POLICY IF EXISTS "testcases_select" ON public.testcases;
        CREATE POLICY "testcases_select" ON public.testcases
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.campaigns c
                    WHERE c.id = campaign_id AND (c.workspace_id IS NULL OR public.is_workspace_member(c.workspace_id))
                )
            );

        DROP POLICY IF EXISTS "testcases_modify" ON public.testcases;
        CREATE POLICY "testcases_modify" ON public.testcases
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.campaigns c
                    WHERE c.id = campaign_id AND c.workspace_id IS NOT NULL AND public.has_workspace_role(c.workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR'])
                )
            );
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'testruns') THEN
        DROP POLICY IF EXISTS "testruns_select" ON public.testruns;
        CREATE POLICY "testruns_select" ON public.testruns
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.campaigns c
                    WHERE c.id = campaign_id AND (c.workspace_id IS NULL OR public.is_workspace_member(c.workspace_id))
                )
            );

        DROP POLICY IF EXISTS "testruns_insert" ON public.testruns;
        CREATE POLICY "testruns_insert" ON public.testruns
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.campaigns c
                    WHERE c.id = campaign_id AND c.workspace_id IS NOT NULL AND public.has_workspace_role(c.workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR'])
                )
            );
    END IF;

    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'findings') THEN
        DROP POLICY IF EXISTS "findings_select" ON public.findings;
        CREATE POLICY "findings_select" ON public.findings
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.testruns tr
                    JOIN public.campaigns c ON c.id = tr.campaign_id
                    WHERE tr.id = test_run_id AND (c.workspace_id IS NULL OR public.is_workspace_member(c.workspace_id))
                )
            );

        DROP POLICY IF EXISTS "findings_insert" ON public.findings;
        CREATE POLICY "findings_insert" ON public.findings
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.testruns tr
                    JOIN public.campaigns c ON c.id = tr.campaign_id
                    WHERE tr.id = test_run_id AND c.workspace_id IS NOT NULL AND public.has_workspace_role(c.workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR'])
                )
            );
    END IF;
END $$;

-- =============================================================================
-- 10. INCIDENTS & REMEDIATION POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "incidents_select" ON public.incidents;
CREATE POLICY "incidents_select" ON public.incidents
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "incidents_modify" ON public.incidents;
CREATE POLICY "incidents_modify" ON public.incidents
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

DROP POLICY IF EXISTS "remediation_select" ON public.remediation_actions;
CREATE POLICY "remediation_select" ON public.remediation_actions
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "remediation_modify" ON public.remediation_actions;
CREATE POLICY "remediation_modify" ON public.remediation_actions
    FOR ALL
    USING (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']))
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

-- =============================================================================
-- 11. TAMPER-RESISTANT AUDIT & EVIDENCE POLICIES (Append-Only / Immutable)
-- =============================================================================

-- Evidence: Members can read, assessors can insert, NO ONE can UPDATE or DELETE
DROP POLICY IF EXISTS "evidence_select" ON public.evidence;
CREATE POLICY "evidence_select" ON public.evidence
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "evidence_insert" ON public.evidence;
CREATE POLICY "evidence_insert" ON public.evidence
    FOR INSERT
    WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['OWNER', 'ADMIN', 'ASSESSOR']));

-- Audit Events: Members can read, authenticated users can insert, NO ONE can UPDATE or DELETE
DROP POLICY IF EXISTS "audit_events_select" ON public.audit_events;
CREATE POLICY "audit_events_select" ON public.audit_events
    FOR SELECT
    USING (public.is_workspace_member(workspace_id));

DROP POLICY IF EXISTS "audit_events_insert" ON public.audit_events;
CREATE POLICY "audit_events_insert" ON public.audit_events
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL OR public.is_workspace_member(workspace_id));

