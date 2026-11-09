# RedTeam AI Labs — Cross-Border Data Transfer Assessment
**Operating Entity:** Lisumen Innovative Hub  
**Product:** RedTeam AI Labs  
**Statutory Basis:** Nigeria Data Protection Act 2023 (NDPA Section 41, 42 & 43), GDPR Chapter V, and UK Data Protection Act 2018  
**Version:** 1.0.0  
**Effective Date:** November 9, 2026  

---

## 1. Assessment Context and Destination Countries
RedTeam AI Labs is operated by **Lisumen Innovative Hub** in Nigeria. In providing enterprise cloud-native AI assurance, the platform utilizes infrastructure located outside Nigeria:

| Destination Country | Infrastructure Provider | Processing Role | Data Transferred |
| :--- | :--- | :--- | :--- |
| **United States of America** (AWS us-east-1) | Supabase Inc. | Primary relational PostgreSQL database, Supabase Auth user directory | User account details, workspace records, audit logs, campaign findings |
| **United States / Global Edge** | Vercel Inc. | Next.js serverless compute, Edge routing, static asset distribution | HTTPS requests, telemetry, transit tokens |
| **United States** (Google Cloud) | Google LLC (Gemini API) | Large language model API for adversarial prompt synthesis and evaluation | Target system requirements, synthetic prompt inputs, model completion texts |

---

## 2. Statutory Assessment under NDPA Section 41
Under Section 41 of the Nigeria Data Protection Act 2023, personal data shall not be transferred from Nigeria to another country unless:
1. **Adequacy of Protection (NDPA Section 41(1)):** The recipient country ensures an adequate level of protection, taking into account the rule of law, respect for human rights, access by public authorities, and data protection legislation.
2. **Appropriate Safeguards (NDPA Section 41(2)):** In the absence of an adequacy decision by the NDPC, a transfer may occur if the controller or processor has provided appropriate safeguards, including:
   - Binding corporate rules;
   - Standard contractual clauses (SCCs) approved by the Commission;
   - Contractual clauses between the controller and recipient ensuring enforceable data subject rights.
3. **Statutory Exceptions (NDPA Section 43):** Explicit consent of the data subject, contractual necessity between the data subject and controller, or legal claims.

---

## 3. Evaluation of Safeguards by Vendor

### A. Supabase Inc. (AWS us-east-1, USA)
- **Safeguard Framework:** Standard Contractual Clauses (SCCs) incorporating GDPR Article 46 standards and supplementary technical safeguards.
- **Technical Measures:** AES-256 encryption at rest, TLS 1.3 transit encryption, PostgreSQL Row-Level Security, automated daily encrypted backups.
- **Government Access Risk:** Evaluated under US CLOUD Act. Data stored represents synthetic red-team evaluation prompts and enterprise AI risk metadata; negligible risk of national security interest.
- **Conclusion:** **APPROVED WITH APPROPRIATE SAFEGUARDS**.

### B. Vercel Inc. (USA / Edge Network)
- **Safeguard Framework:** Vercel Data Processing Addendum incorporating EU/UK Standard Contractual Clauses.
- **Technical Measures:** Edge isolation, automated DDoS filtering, strict HTTP security headers, ephemeral serverless function lifecycles (zero persistent storage on edge nodes).
- **Conclusion:** **APPROVED WITH APPROPRIATE SAFEGUARDS**.

### C. Google LLC - Gemini Enterprise API (USA)
- **Safeguard Framework:** Google Cloud Data Processing and Security Terms.
- **Technical Measures:** Ephemeral, stateless prompt execution. Enterprise API terms explicitly contract that customer prompt inputs and completions are NOT used to train Google foundation models.
- **Conclusion:** **APPROVED WITH APPROPRIATE SAFEGUARDS**.

---

## 4. Transfer Impact Assessment (TIA) Sign-Off
- **Finding:** The cross-border data transfers conducted by RedTeam AI Labs are lawful, proportionate, and protected by appropriate technical and contractual safeguards under NDPA Section 41 and GDPR Chapter V.
- **Action Items:** Review NDPC announcements regarding official whitelist/adequacy designations for international jurisdictions.
- **DPO Approval:** *Lisumen Innovative Hub Data Protection Officer* (Nov 2026).

