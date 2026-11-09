# RedTeam AI Labs — Data Retention and Deletion Procedure
**Operating Entity:** Lisumen Innovative Hub  
**Product:** RedTeam AI Labs  
**Statutory Basis:** Nigeria Data Protection Act 2023 (NDPA Section 24(1)(e)) & GDPR Article 5(1)(e)  
**Version:** 1.0.0  
**Effective Date:** November 9, 2026  

---

## 1. Scope & Objective
This procedure defines the specific engineering routines, automated cron deletion scripts, database triggers, and manual verification workflows executed to enforce the **RedTeam AI Labs Data Retention and Deletion Policy**.

---

## 2. Relational Schema Deletion Mechanics (PostgreSQL CASCADE)
The RedTeam AI Labs database architecture (Supabase PostgreSQL) implements relational integrity constraints designed for clean, deterministic data lifecycle termination:

```sql
-- Workspaces Cascade Architecture
workspaces (id UUID PRIMARY KEY)
  ├── workspace_members (ON DELETE CASCADE)
  ├── ai_systems (ON DELETE CASCADE)
  │     ├── risk_assessments (ON DELETE CASCADE)
  │     │     └── risks (ON DELETE CASCADE)
  │     ├── incidents (ON DELETE CASCADE)
  │     │     └── remediation_actions (ON DELETE CASCADE)
  │     └── campaigns (ON DELETE CASCADE)
  │           ├── testcases (ON DELETE CASCADE)
  │           ├── testruns (ON DELETE CASCADE)
  │           └── findings (ON DELETE CASCADE)
  ├── policies (ON DELETE CASCADE)
  │     ├── policy_versions (ON DELETE CASCADE)
  │     └── control_mappings (ON DELETE CASCADE)
  ├── evidence (ON DELETE CASCADE)
  └── audit_events (ON DELETE CASCADE)
```

### Execution of Workspace Purge:
1. When an authorized Workspace Owner executes an account or workspace purge, issuing:
   ```sql
   DELETE FROM public.workspaces WHERE id = $workspace_id;
   ```
   PostgreSQL relational foreign keys automatically cascade to completely eradicate all child records across all 22 application tables.
2. In-memory sliding-window rate limit counters are cleared for that workspace prefix.
3. Associated user sessions in `supabase.auth.users` are revoked, invalidating all outstanding JWT access and refresh tokens.

---

## 3. Automated Evidence Pruning Routine
Audit evidence records (`evidence` table) and security event logs (`audit_events` table) enforce storage limitation through periodic automated pruning jobs:

- **Standard Retention Window:** Records older than **365 calendar days** (12 months) are automatically identified.
- **Enterprise Retention Override:** If a workspace has an active Enterprise compliance tier flag (`tier = 'ENTERPRISE'` with contractual retention addendum), records are retained up to the agreed threshold (e.g., 2,555 days / 7 years).
- **Automated SQL Routine:**
  ```sql
  -- Pruning expired audit events for non-enterprise workspaces
  DELETE FROM public.audit_events
  WHERE created_at < NOW() - INTERVAL '365 days'
    AND workspace_id IN (
        SELECT id FROM public.workspaces WHERE tier != 'ENTERPRISE'
    );
  ```

---

## 4. Disaster Recovery Backup Purge Cycle
- **Point-in-Time Database Backups:** Primary Supabase PostgreSQL database snapshots are retained on Amazon Web Services (AWS) infrastructure for operational disaster recovery.
- **Retention Horizon:** Rolling **30 calendar days**.
- **Purge Assurance:** Data deleted from the live production database is permanently overwritten across all backup volumes upon the expiry of thirty (30) calendar days.

---

## 5. Verification, Exception Holds & Sign-Off
- **Statutory Exception Holds:** If a formal legal hold is served by a Nigerian court or the NDPC, the DPO enters a `statutory_hold = TRUE` flag in the audit register, temporarily exempting specific records from automated pruning.
- **Procedure Audit:** The technical lead and DPO conduct semi-annual sample audits of purged workspaces to verify that zero orphaned records persist.

