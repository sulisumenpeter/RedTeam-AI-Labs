# RedTeam AI Labs — Records of Processing Activities (ROPA)
**Operating Entity:** Lisumen Innovative Hub  
**Product:** RedTeam AI Labs  
**Statutory Authority:** Nigeria Data Protection Act 2023 (NDPA Section 27) & GDPR Article 30  
**Version:** 1.0.0  
**Last Updated:** November 9, 2026  

---

## 1. Controller & DPO Details
- **Data Controller:** Lisumen Innovative Hub
- **Business Address:** [CONFIRMATION REQUIRED: Registered Office Address in Nigeria]
- **Corporate Registration:** [CONFIRMATION REQUIRED: CAC BN/RC Number]
- **Designated Data Protection Officer (DPO):** [CONFIRMATION REQUIRED: dpo@redteamailabs.com]
- **Executive Representative:** Sulisumen Peter (Lead Developer & Operations Lead)

---

## 2. Processing Activities Inventory (Controller Operations)

### Record 01: User Account Registration & Workspace Access Management
- **Purpose of Processing:** Provisioning user accounts, verifying identity, managing role-based access control (Owner, Admin, Assessor, Auditor), and maintaining multi-tenant workspace security.
- **Categories of Data Subjects:** Enterprise customers, system administrators, compliance assessors.
- **Categories of Personal Data:** Full name, enterprise business email address, salted authentication password hash, assigned workspace role, user ID.
- **Lawful Basis (NDPA Section 25):** Contractual Necessity (s. 25(1)(b)) and Legal Obligation (s. 25(1)(c)).
- **Recipients & Subprocessors:** Supabase Inc. (database and auth), Vercel Inc. (hosting).
- **International Transfers:** Data hosted on AWS us-east-1 via Supabase Inc. (Standard Contractual Clauses; NDPA Section 41).
- **Retention Period:** Duration of active workspace membership plus thirty (30) days following account closure.
- **Technical Security Measures:** AES-256 encryption at rest, TLS 1.3 in transit, PostgreSQL Row-Level Security, rate-limited login endpoints.

### Record 02: Platform Telemetry & Audit Event Logging
- **Purpose of Processing:** Tracking operational actions, preventing unauthorized system changes, meeting forensic cybersecurity obligations, and satisfying regulatory audit trails.
- **Categories of Data Subjects:** Workspace members and system operators.
- **Categories of Personal Data:** Actor email address, user ID, action performed (e.g., `CAMPAIGN_LAUNCHED`, `POLICY_CREATED`), target entity ID, IP address, user-agent string, timestamp.
- **Lawful Basis (NDPA Section 25):** Legitimate Interests (s. 25(1)(e)) and Legal Obligation under the Cybercrimes Act 2015.
- **Recipients & Subprocessors:** Supabase Inc.
- **Retention Period:** 12 months standard; up to 7 years for enterprise regulatory audit contracts.
- **Technical Security Measures:** Tamper-resistant append-only PostgreSQL table (`audit_events`), SHA-256 evidence hashing.

---

## 3. Processing Activities Inventory (Processor Operations on Behalf of Customers)

### Record 03: AI Red-Teaming, Prompt Generation & Evaluation
- **Purpose of Processing:** Generating synthetic adversarial prompts, evaluating target AI outputs against corporate policies, computing 5x5 quantitative risk matrices, and generating compliance report bundles.
- **Categories of Data Subjects:** Individuals whose communications or data are processed through customer AI targets.
- **Categories of Personal Data:** AI system descriptions, intended purpose, prompt texts, model completions, OpenTelemetry traces, MCP tool calls.
- **Controller Instructions:** Governed strictly by the RedTeam AI Labs Data Processing Agreement (DPA).
- **Recipients & Subprocessors:** Google LLC (Gemini API for stateless prompt synthesis/grading), Supabase Inc., Vercel Inc.
- **Retention Period:** Retained dynamically in customer workspace until purged by authorized Workspace Admins.
- **Technical Security Measures:** Zero model training on customer data (Google Enterprise API terms), circuit-breaker timeout handling, kernel-level SSRF filters.

---

## 4. Review Cadence & Verification
- This ROPA is updated on a semi-annual basis or immediately upon the onboarding of new subprocessors, features, or data processing categories.
- Approved by: *Lisumen Innovative Hub Compliance Operations* (Nov 2026).

