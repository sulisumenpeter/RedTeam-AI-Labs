# RedTeam AI Labs 🛡️
### Enterprise Agentic AI Governance, Risk Management & Tool-Execution Assurance Platform

**Test, Govern, and Assure Your Autonomous AI Before Your Users Do.**

RedTeam AI Labs is an enterprise AI Governance, Risk Management, Compliance, and Assurance platform. Built for AI safety officers, risk managers, compliance leads, and enterprise engineering teams, it operationalizes trustworthiness across the autonomous AI lifecycle—from initial system registration and quantitative risk scoring to policy-derived adversarial fuzzing, Model Context Protocol (MCP) tool inspection, OpenTelemetry distributed trace auditing, incident remediation, and cryptographic audit evidence.

---

## 🏛️ Platform Architecture & Core Tenet

The platform is architected around a non-negotiable governance tenet:  
**THE LLM PROPOSES, THE BACKEND DISPOSES.**  
Generative AI models are utilized to adversarially probe and evaluate target systems, but all final risk scores, severity classifications, and policy determinations are strictly calculated by deterministic backend rules and persisted in Supabase PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              ENTERPRISE APPLICATION SHELL                              │
├─────────────────┬───────────────────────────────┬──────────────────────────────────────┤
│ 1. INVENTORY    │ 2. QUANTITATIVE RISK SCORING  │ 3. GOVERNANCE & 5 FRAMEWORKS         │
│ • System Card   │ • 5x5 Likelihood x Impact     │ • Immutable Policy Builder (v1.0)    │
│ • EU Risk Tiers │ • Inherent vs. Residual Score │ • NIST AI RMF, EU AI Act, ISO 42001, │
│ • Target Types  │ • Actionable Risk Register    │   OECD AI & OWASP Agentic Top 10     │
├─────────────────┴───────────────────────────────┴──────────────────────────────────────┤
│ 4. AGENTIC AI ASSURANCE & TOOL-EXECUTION ADVERSARIAL ENGINE                            │
│ • Deterministic Seeded Test Generation (30-Test Baseline & Dynamic Plans)              │
│ • Model Context Protocol (MCP) Tool Call Inspection & JSON-RPC Parameter Validation    │
│ • OpenTelemetry (OTel) Distributed Trace Spans & Execution Timing Waterfall            │
│ • Mandatory Human-in-the-Loop (HITL) Approval Gate Verification                        │
│ • Multi-Vertical Deterministic Rules: Legal AI, Fintech FCRA & Clinical Triage Safety  │
│ • Paired Demographic & Socioeconomic Bias Testing (Low-Income vs. Wealthy Baselines)   │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ 5. INCIDENTS & REMEDIATION    │ 6. EVIDENCE VAULT & COMPLIANCE EXPORTS                 │
│ • 1-Click Finding Tracking    │ • SHA-256 Cryptographic Evidence Snapshots             │
│ • Corrective Action Plans     │ • Append-Only Audit Trail & Verification Logs          │
│ • Automated Regression Retest │ • XSS-Sanitized PDF, Interactive HTML & JSON Bundles   │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 🌐 Statutory & Security Governance Framework Cross-Walks

RedTeam AI Labs provides direct control mappings and empirical automated verification across **5 major international frameworks**:

1. **NIST Artificial Intelligence Risk Management Framework (AI RMF 1.0)**
   - `GOVERN-1.1`: Legal and regulatory requirements understood and documented.
   - `MAP-1.1`: Context, intended purpose, and negative deployment impacts identified.
   - `MEASURE-2.6`: Bias and demographic fairness evaluation via paired adversarial testing.
   - `MANAGE-2.4`: Incident tracking and automated corrective remediation mechanisms.

2. **EU Artificial Intelligence Act (Regulation 2024/1689)**
   - `Article 9`: Iterative risk management systems across high-risk lifecycle stages.
   - `Article 13`: Transparency and user disclosure requirements (mandatory legal practice disclaimers).
   - `Article 14`: Human-in-the-loop oversight and intervention capabilities.

3. **ISO/IEC 42001:2023 (Artificial Intelligence Management System)**
   - `Clause 6.1.2`: Quantitative AI risk assessment and treatment methodologies.
   - `Control A.6.1`: AI system impact assessments and stakeholder disclosures.
   - `Control A.8.4`: AI system robustness, resilience, and adversarial prompt resistance.

4. **OECD AI Principles**
   - `Principle 1.2`: Robustness, security, and fairness across socioeconomic cohorts.
   - `Principle 1.3`: Transparency, explainability, and meaningful user notification.

5. **OWASP Top 10 for Agentic AI (2026)**
   - `ASI-01 (Agentic Tool Misuse & Excessive Agency)`: Autonomous tools must not execute destructive SQL, OS shell scripts, or arbitrary system calls.
   - `ASI-02 (Indirect Prompt Injection via External Feeds)`: Target systems must resist instruction injection through tool responses and untrusted documents.
   - `ASI-03 (Broken Human-in-the-Loop Oversight)`: High-risk actions (wire transfers, record deletions, role alterations) require verified human approval gates.
   - `ASI-04 (Cross-Tenant Broken Object Level Authorization - BOLA)`: Multi-tenant agents must strictly isolate tenant IDs (`tenant_id`, `org_id`) in tool arguments.

---

## 🔍 Agentic Tool-Execution Assurance & Multi-Vertical Engine

### 1. Model Context Protocol (MCP) & OpenAI Function Call Inspection
- Target adapters intercept structured `toolCalls` payloads (`toolName`, `protocol`, `arguments`, `status`).
- Evaluates destructive parameters, unauthorized database operations (`DROP TABLE`, `DELETE FROM`, `TRUNCATE`), shell escapes (`rm -rf`), and file tampering (`/etc/passwd`, `.env`).
- Flags unapproved executions as `UNAUTHORIZED_AGENTIC_TOOL_EXECUTION`.

### 2. OpenTelemetry (OTel) Distributed Trace Introspection
- Ingests W3C TraceContext compliant `otelSpans` capturing `traceId`, `spanId`, `parentSpanId`, `name`, `attributes`, and `durationMs`.
- Surfaced directly in the frontend Campaign Findings UI via the interactive `AgenticTraceInspector` waterfall component with proportional execution duration bars.

### 3. Human-in-the-Loop (HITL) Gate Enforcement
- Detects attempts to bypass mandatory human oversight gates (`bypass_human_approval: true` or `approvalGateTriggered === false`).
- Renders explicit visual compliance badges (`HITL Gate: Enforced` vs. `HITL Gate: Bypassed`).

### 4. Multi-Vertical Deterministic Heuristics
- **Legal AI:**
  - Unauthorized Practice of Law (UPL) detection.
  - Self-help eviction lockout counsel prohibition (changing locks, utility cut-offs).
  - Fabricated statutory citation detection (e.g., fictitious *2024 Tenant Relocation Act*).
  - Mandatory legal practice disclaimer omission detection.
- **Fintech & Fair Lending AI:**
  - Fair Credit Reporting Act (FCRA) and Equal Credit Opportunity Act (ECOA) compliance.
  - Algorithmic credit redlining based on demographic zip-code proxies (flagged as `ALGORITHMIC_LENDING_BIAS_FCRA`).
- **Clinical & Healthcare Triage AI:**
  - Safety guardrails preventing medical advice to discontinue prescribed medications (flagged as `UNSAFE_CLINICAL_TRIAGE_OVERRIDE`).

---

## 📊 Compliance Reporting & Audit Bundles

Audit reports can be exported directly from the Campaign Findings and Reports dashboards:

- **Signed PDF Reports:** Formal executive summary, safety posture assessment, pass/fail counts, and granular finding tables appending empirical `[MCP Tool: <toolName> | Status: <status>]` verification summaries for regulatory sign-off.
- **Interactive XSS-Sanitized HTML:** Self-contained, zero-dependency HTML assurance logs containing dedicated Agentic Tool Execution tables, OTel distributed trace breakdowns, and policy rationale.
- **JSON Audit Bundles:** Cryptographically hashed machine-readable bundles containing structured findings, `toolCalls`, `otelSpans`, and HITL gate statuses.

---

## 🔒 Security Architecture

- **SSRF Guard:** Network perimeter filter blocking loopback (`127.0.0.0/8`), private IPv4 CIDRs (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), decimal-encoded IPs, embedded userinfo, and cloud metadata (`169.254.169.254`).
- **XSS Sanitization:** `escapeHtml()` sanitization across all exported HTML reports and audit bundles.
- **Strict Role-Based Access Control (RBAC):** Granular authorization matrix across `OWNER`, `ADMIN`, `ASSESSOR`, and `VIEWER` roles.
- **Dual-Engine Fault Isolation:** Circuit-breaker protected semantic evaluation pipeline ensuring zero hangs on external API rate-limiting.
- **Zero-Failure In-Memory Store:** Full platform functionality in offline, unconfigured, or demonstration environments.

---

## 🛠️ Quick Start & Installation

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+

### 2. Environment Configuration
```bash
cp .env.example .env.local
```
Configure your keys in `.env.local` (optional for local synthetic evaluation, required for live external targets):
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### 3. Database Migrations (Supabase PostgreSQL)
```bash
# Migrations are executed in order:
# 0001_initial.sql
# 0002_policies.sql
# 0003_testcases_requirement_id.sql
# 0004_enterprise_governance_platform.sql
# 0005_seed_lexhack_demo.sql
# 0006_agentic_assurance_and_owasp.sql
```

### 4. Running the Platform
```bash
# Install dependencies
npm install

# Run static type checking
npx tsc --noEmit

# Run automated governance & agentic unit tests
npm test

# Run Playwright end-to-end tests
npx playwright test

# Build production application
npm run build

# Start production server
npm start
```

---

## 🧪 Verification & Test Metrics

- **Unit & Integration Suite (`npm test`):** **61 tests across 12 test suites** passing in <1s with 100% pass rate.
  - `agentic.test.mjs`: MCP tool extraction, synthetic triggers, Checks 7/8/9, semantic fallbacks, generator anchors, report export sanitization.
  - `governance.test.mjs`: RBAC matrix, rate limiting, risk scoring, severity reconciliation.
  - `auth.test.mjs`: HTTP 429 session resilience, cookie chunking, invalid token rejection.
  - `ssrf.test.mjs`: Localhost, cloud metadata, decimal IP evasion, and port filtering.
  - `persistence.test.mjs`: Database vs Demo mode enforcement.
  - `targetAdapter.test.mjs`: External target probe, header formatting, retry logic.
- **Playwright End-to-End Suite (`npx playwright test`):** **15 browser tests** passing across 4 specs:
  - `campaign.spec.ts`: End-to-end campaign creation, chunked execution, and findings inspection.
  - `final-verification.spec.ts`: Authenticated navigation, session persistence, forms, and mobile viewport.
  - `launch-readiness.spec.ts`: SEO, robots.txt, sitemap, 404 pages, and accessibility.
  - `settings-probe.spec.ts`: SSRF prevention and target credential probing.

---

## ⚖️ Legal & Governance Disclaimer
RedTeam AI Labs identifies reproducible safety, governance, and tool-execution deficiencies under configured policies. Simulated targets and sample assessments represent benchmark environments. Assessment reports provide empirical safety evidence and do not constitute statutory legal counsel or guarantees of absolute security.
