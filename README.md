# RedTeam AI Labs 🛡️
### Enterprise AI Governance, Risk Management & Assurance Platform

**Test, Govern, and Assure Your AI Before Your Users Do.**

RedTeam AI Labs is an integrated AI Governance, Risk Management, Compliance, and Assurance platform. Built for AI safety officers, risk managers, compliance leads, and legal technology organizations, it operationalizes trustworthiness across the AI lifecycle—from initial system registration and quantitative risk scoring to policy-derived adversarial fuzzing, incident remediation, and cryptographic audit evidence.

Initial Specialization: **Legal Technology & Autonomous Legal AI Intake Systems**  
Showcase Track: **LexHack Builders Fellowship Evaluation & Demonstration**

---

## 🏛️ Platform Architecture & Core Modules

The platform is architected around a non-negotiable governance tenet:  
**THE LLM PROPOSES, THE BACKEND DISPOSES.**  
Generative AI models are utilized to adversarially probe and evaluate target systems, but all final risk scores, severity classifications, and policy determinations are strictly calculated by deterministic backend rules and persisted in Supabase PostgreSQL.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ENTERPRISE APPLICATION SHELL                     │
├───────────────┬─────────────────────────────┬───────────────────────────────┤
│ 1. INVENTORY  │ 2. RISK MANAGEMENT          │ 3. GOVERNANCE & FRAMEWORKS    │
│ • System Card │ • 5x5 Likelihood x Impact   │ • Policy Builder & Versioning │
│ • EU AI Risk  │ • Inherent & Residual Score │ • NIST AI RMF, EU AI Act,     │
│ • Oversight   │ • Filterable Risk Register  │   ISO 42001, OECD Mappings    │
├───────────────┴─────────────────────────────┴───────────────────────────────┤
│ 4. AI ASSURANCE & RED-TEAM ADVERSARIAL ENGINE                               │
│ • Deterministic Seeded Test Generation (30-Test Baseline & Dynamic Plans)   │
│ • Multi-Strategy Fuzzing (Injection, Jailbreak, Leakage, Hallucination)     │
│ • Paired Demographic & Socioeconomic Bias Testing                           │
│ • Hybrid Evaluation Pipeline (Deterministic Rules + Semantic LLM + Mapper)  │
├─────────────────────────────┬───────────────────────────────────────────────┤
│ 5. INCIDENTS & REMEDIATION  │ 6. EVIDENCE VAULT & REPORTING                 │
│ • 1-Click Finding Tracking  │ • SHA-256 Cryptographic Evidence Records      │
│ • Corrective Action Plans   │ • Append-Only Audit Trail                     │
│ • Regression Retesting Loop │ • XSS-Sanitized PDF, HTML & JSON Audit Bundle │
└─────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 🚀 Key Modules

### Module 1: AI System Inventory
- Centralized registry for deployed and prototype AI models.
- Captures business owners, technical owners, model versions, intended purpose, deployment tier, and EU AI Act risk tiers (`MINIMAL`, `LIMITED`, `HIGH`, `UNACCEPTABLE`).
- Preconfigured with the **Synthetic Legal Intake Assistant** demonstration model.

### Module 2: AI Risk Management
- Transparent **5x5 Likelihood &times; Impact** calculation methodology.
- Formulas:
  - $\text{Inherent Risk} = \text{Likelihood} \times \text{Impact}$
  - $\text{Residual Risk} = \text{Residual Likelihood} \times \text{Residual Impact}$
- Visual interactive 5x5 risk heat matrix and actionable mitigation register.

### Module 3: Governance Policy & Framework Library
- Create immutable, version-controlled governance policies.
- Direct control mappings across 4 international standards:
  - **NIST AI Risk Management Framework (AI RMF 1.0)** (GOVERN-1.1, MAP-1.1, MEASURE-2.6, MANAGE-2.4)
  - **EU Artificial Intelligence Act (Regulation 2024/1689)** (Articles 9, 13, 14)
  - **ISO/IEC 42001:2023 (AI Management System)** (Clause 6.1.2, Controls A.6.1, A.8.4)
  - **OECD AI Principles** (Principle 1.2 Fairness, Principle 1.3 Transparency)

### Module 4: AI Assurance & Adversarial Testing Engine
- Dynamically compiles test plans from actual selected governance policies.
- 10 testing categories with end-to-end traceability to `requirement_id`.
- **Paired Bias Testing:** Evaluates demographic and socioeconomic friction differentials (e.g. low-income vs wealthy assistance requests).
- **Target Adapter Architecture:** Supports built-in synthetic demonstration targets and external OpenAI-compatible endpoints with kernel-level SSRF guards.

### Module 5: Incident & Remediation Management
- 1-click promotion of critical and high-severity findings into tracked incidents.
- Assign corrective action plans (`SYSTEM_GUARDRAIL`, `PROMPT_ENGINEERING`, `MODEL_RETRAINING`).
- Automated retesting loop to verify fixes against original vulnerability vectors.

### Module 6: Central Evidence Vault & Sanitized Reporting
- Tamper-evident repository storing SHA-256 cryptographic hashes for policies, test runs, and risk assessments.
- Append-only audit logs recording every governance event.
- Export audit-ready reports in **PDF**, **XSS-Sanitized HTML**, and **JSON Audit Bundles**.

---

## 🔒 Security & Safe Engineering

- **SSRF Guard:** Comprehensive network filter blocking loopback (`127.0.0.0/8`), private subnets (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), and cloud metadata IP (`169.254.169.254`).
- **Output Sanitization:** Strict HTML escaping on all exported reports to neutralize stored XSS vectors.
- **Service-Role Isolation:** The Supabase service-role key is strictly isolated to backend services and never bundled to the browser.
- **Zero-Failure Offline Demo:** Built-in in-memory fallback store allows full demonstration of the platform even without active Supabase or Gemini credentials.

---

## 🛠️ Getting Started & Installation

### 1. Prerequisites
- Node.js 18.x or 20.x+
- npm 9.x+

### 2. Setup Environment
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Configure your keys in `.env.local` (optional for local synthetic demo, required for live external models):
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### 3. Database Migrations
If using a live Supabase instance, execute the migrations in order:
- `supabase/migrations/0001_initial.sql`
- `supabase/migrations/0002_policies.sql`
- `supabase/migrations/0003_testcases_requirement_id.sql`
- `supabase/migrations/0004_enterprise_governance_platform.sql`
- `supabase/migrations/0005_seed_lexhack_demo.sql`

*(Note: The platform features an automatic in-memory fallback layer, allowing instant testing without manual database provisioning).*

### 4. Running the Platform
```bash
# Install dependencies
npm install

# Run static type checking
npm run typecheck

# Run automated governance unit tests
npm test

# Build production application
npm run build

# Start local server
npm run dev
```

Navigate to `http://localhost:3000` to interact with the platform.

---

## 🧪 Testing Verification
- **Unit Tests:** `npm test` runs 17 automated tests covering risk scoring, severity reconciliation, SSRF protection, report sanitization, and synthetic target vectors.
- **TypeScript:** `npm run typecheck` verifies static typings across all routes and components.
- **End-to-End:** `npm run test:e2e` executes Playwright browser tests.

---

## ⚖️ Legal & Governance Disclaimer
RedTeam AI Labs identifies reproducible safety, bias, and compliance deficiencies under defined evaluation policies. The synthetic demonstration assistant and knowledge base represent simulated environments. Assessment reports do not constitute statutory legal advice or guarantee absolute safety in production deployments.
