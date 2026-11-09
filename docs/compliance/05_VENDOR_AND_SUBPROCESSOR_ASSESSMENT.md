# RedTeam AI Labs — Vendor and Subprocessor Assessment
**Operating Entity:** Lisumen Innovative Hub  
**Product:** RedTeam AI Labs  
**Statutory Basis:** Nigeria Data Protection Act 2023 (NDPA Section 33) & GDPR Article 28  
**Version:** 1.0.0  
**Effective Date:** November 9, 2026  

---

## 1. Vendor Risk Management Framework
Under Section 33 of the Nigeria Data Protection Act 2023, a Data Controller or Data Processor shall not engage another data processor without prior written authorization, and must ensure the engaged processor provides sufficient guarantees to implement appropriate technical and organizational measures.

This Vendor and Subprocessor Assessment records the formal evaluation of all active external service providers supporting **RedTeam AI Labs**.

---

## 2. Assessment Matrix of Active Infrastructure Providers

### Vendor 01: Supabase Inc.
- **Service Provided:** Managed PostgreSQL Relational Database, Supabase Auth (JWT), Storage, Row-Level Security.
- **Corporate Domicile:** Singapore / United States.
- **Server Deployment Region:** Amazon Web Services (AWS us-east-1, North Virginia, USA).
- **Security Certifications:** SOC 2 Type II Certified, ISO 27001 compliant infrastructure via AWS.
- **Data Protection Evaluation:**
  - Written DPA in place: Yes.
  - Standard Contractual Clauses (SCCs) executed: Yes.
  - Encryption in Transit: TLS 1.3 enforced.
  - Encryption at Rest: AES-256 enabled on all storage volumes.
  - RLS Enforcement: Database-level policy isolation.
- **Risk Score:** **Low**.
- **Status:** **APPROVED FOR ENTERPRISE DATA PROCESSING**.

### Vendor 02: Vercel Inc.
- **Service Provided:** Next.js Application Hosting, Edge CDN, Serverless API Route Execution.
- **Corporate Domicile:** United States (Covina, CA).
- **Server Deployment Region:** Global Edge Network / USA Serverless Regions.
- **Security Certifications:** SOC 2 Type II Certified, ISO 27001 Certified.
- **Data Protection Evaluation:**
  - Written DPA in place: Yes.
  - Standard Contractual Clauses (SCCs) executed: Yes.
  - Encryption in Transit: Strict HTTPS, HSTS preload (2 years).
  - Data Persistence: Zero persistent local storage; functions run ephemerally.
- **Risk Score:** **Low**.
- **Status:** **APPROVED FOR ENTERPRISE APPLICATION HOSTING**.

### Vendor 03: Google LLC (Google Generative AI / Gemini API)
- **Service Provided:** Adversarial test prompt synthesis and semantic evaluation of model responses.
- **Corporate Domicile:** United States (Mountain View, CA).
- **Server Deployment Region:** Google Cloud Platform (USA).
- **Security Certifications:** ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II.
- **Data Protection Evaluation:**
  - Written API Terms in place: Yes.
  - Foundation Model Training on API Data: **STRICTLY PROHIBITED** under enterprise terms.
  - Statelessness: Data processed ephemerally without persistent retention for model retraining.
  - Circuit-Breaker Fault Tolerance: Configured in platform with 2500ms timeout and offline fallback.
- **Risk Score:** **Medium-Low**.
- **Status:** **APPROVED FOR ADVERSARIAL AI GENERATION & EVALUATION**.

---

## 3. Mandatory Review & Discontinuation Criteria
- Subprocessors are re-assessed annually or upon material changes to service terms or security posture.
- A vendor will be immediately suspended or replaced if:
  1. They suffer a material data breach impacting RedTeam AI Labs data without timely notification;
  2. They alter terms to permit foundation model training on customer prompt data;
  3. They fail to maintain SOC 2 Type II or equivalent independent security certifications.

