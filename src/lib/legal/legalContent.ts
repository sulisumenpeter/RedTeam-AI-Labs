/**
 * RedTeam AI Labs — Official Legal & Regulatory Documentation Registry
 * Operating Entity: Lisumen Innovative Hub
 * Primary Governing Law: Nigeria Data Protection Act 2023 (NDPA 2023) & Laws of the Federal Republic of Nigeria
 * International Cross-Walk: EU General Data Protection Regulation (GDPR), UK GDPR, EU AI Act, US Privacy Laws
 */

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  shortTitle: string;
  category: "legal" | "policies" | "data-protection";
  categoryLabel: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  governingLaw: string;
  summary: string;
  confirmationItems: string[];
  sections: LegalSection[];
}

export const LEGAL_CATEGORIES = [
  {
    id: "legal",
    label: "Legal",
    description: "Core contractual, governance, and operating disclosures for RedTeam AI Labs.",
  },
  {
    id: "policies",
    label: "Policies",
    description: "Operational, acceptable use, AI risk disclaimers, and vulnerability reporting rules.",
  },
  {
    id: "data-protection",
    label: "Data Protection",
    description: "Statutory data processing commitments, subprocessors, and cross-border safeguards.",
  },
] as const;

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  // ===========================================================================
  // 1. TERMS OF SERVICE
  // ===========================================================================
  terms: {
    slug: "terms",
    title: "Terms of Service",
    shortTitle: "Terms of Service",
    category: "legal",
    categoryLabel: "Legal",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Laws of the Federal Republic of Nigeria",
    summary:
      "These Terms of Service govern your access to and use of RedTeam AI Labs, an enterprise AI governance, risk management, compliance, and assurance platform operated by Lisumen Innovative Hub.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: CAC Registration / Business Number of Lisumen Innovative Hub]",
      "[CONFIRMATION REQUIRED: Physical registered corporate address in Nigeria]",
      "[CONFIRMATION REQUIRED: Standard commercial arbitration seat (e.g. Lagos Court of Arbitration)]",
    ],
    sections: [
      {
        id: "agreement-to-terms",
        title: "1. Agreement to Terms and Operating Entity",
        content: [
          "These Terms of Service ('Terms') constitute a legally binding agreement between you (whether individually or on behalf of an enterprise entity, 'Customer', 'User', or 'you') and Lisumen Innovative Hub ('Company', 'we', 'us', or 'our'), operating the product brand RedTeam AI Labs.",
          "By accessing, registering for, or using RedTeam AI Labs ('the Platform', 'the Service'), you explicitly represent and warrant that: (a) you have the full legal capacity and authority to enter into these Terms; (b) if you are accessing the Platform on behalf of an organization, you are authorized to bind that entity; (c) you will comply with all applicable Nigerian statutory enactments, including the Nigeria Data Protection Act 2023 (NDPA), the Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended), and all relevant international data protection and AI governance regulations.",
          "If you do not agree unconditionally to these Terms, you are strictly prohibited from accessing or using the Platform and must immediately terminate your session.",
        ],
      },
      {
        id: "platform-scope",
        title: "2. Scope of Service and Platform Capabilities",
        content: [
          "RedTeam AI Labs provides cloud-based software tools for AI governance, adversarial red-teaming, statutory framework mapping (NIST AI RMF 1.0, ISO/IEC 42001, EU AI Act, OWASP Agentic Top 10), automated risk scoring, and audit evidence generation.",
          "Platform capabilities include: (a) AI System Inventory and risk classification registries; (b) Adversarial test case generation using multi-strategy attack vectors; (c) Model Context Protocol (MCP) tool-execution inspection and OpenTelemetry trace evaluation; (d) Quantitative 5x5 inherent and residual risk matrix calculations; (e) Cryptographically hashed audit evidence generation with exportable JSON, CSV, PDF, and HTML report packages.",
          "Evaluation Architecture: The Platform operates under the architectural principle 'The LLM Proposes, the Backend Disposes.' Generative AI models propose test vectors and semantic evaluations, but all severity dispositions, compliance thresholds, and policy gates are strictly enforced by deterministic backend rules.",
        ],
      },
      {
        id: "account-responsibilities",
        title: "3. Account Registration, Workspaces, and Security",
        content: [
          "To access the Platform, you must register an account and establish or join an enterprise Workspace. You agree to provide accurate, current, and complete registration information and to maintain its accuracy.",
          "Role-Based Access Control (RBAC): Workspaces enforce granular access roles (Owner, Admin, Governance Lead, Assessor, Auditor). Workspace Owners and Admins are solely responsible for provisioning member access and assigning appropriate privileges.",
          "Credential Protection: You are responsible for safeguarding your login credentials and session tokens. You must notify us immediately at [CONFIRMATION REQUIRED: security@redteamailabs.com] upon discovering any unauthorized access, compromised passwords, or security incidents affecting your account.",
          "Multi-Tenant Isolation: RedTeam AI Labs utilizes PostgreSQL Row-Level Security (RLS) to enforce strict workspace boundary isolation. Any attempt to probe, bypass, or execute cross-workspace object reference (IDOR/BOLA) attacks is a material breach of these Terms.",
        ],
      },
      {
        id: "permitted-and-prohibited-use",
        title: "4. Permitted Use and Testing Authorization",
        content: [
          "Mandatory Authorization Warranty: You expressly represent and warrant that you own, operate, or possess explicit, documented legal authorization to subject any AI model, endpoint, or system to testing on this Platform.",
          "Prohibited Conduct: You shall not: (a) Use the Platform to probe, scan, or attack external AI endpoints or APIs without express authorization from the system owner; (b) Weaponize generated adversarial prompts, evasion techniques, or exploit vectors for unlawful cyberattacks, fraud, defamation, or malware delivery; (c) Reverse-engineer, decompile, or extract the proprietary heuristics, evaluation rulesets, or source code of the Platform; (d) Introduce malware, viruses, or malicious payloads into the Platform infrastructure; (e) Attempt to bypass our SSRF guards, rate limiters, or network security controls; (f) Use the Platform in any manner that violates the Nigerian Cybercrimes Act 2015 or international computer misuse statutes.",
        ],
      },
      {
        id: "subscriptions-and-billing",
        title: "5. Subscriptions, Tiers, and Commercial Terms",
        content: [
          "Service Tiers: RedTeam AI Labs offers multiple tiers: (a) Enterprise Tier (custom contractual SLA, dedicated compute, extended evidence retention); (b) Pro Tier (scheduled campaigns, full framework library); (c) Pilot Tier (time-bound evaluation for prospective enterprise customers); (d) Demonstration Tier (read-only sandboxed evaluation).",
          "Billing and Fees: Fees are invoiced or charged in accordance with the specific order form, quotation, or online checkout process agreed between you and Lisumen Innovative Hub. All payment terms, currency designations (NGN/USD), and recurring renewal intervals are specified in your commercial order form.",
          "Taxes: Unless expressly stated otherwise, fees are exclusive of applicable taxes, including Value Added Tax (VAT) administered by the Federal Inland Revenue Service (FIRS) of Nigeria, withholding taxes, or other statutory levies, which shall be added to the customer invoice where applicable.",
        ],
      },
      {
        id: "intellectual-property",
        title: "6. Intellectual Property Rights",
        content: [
          "Platform IP: Lisumen Innovative Hub retains exclusive ownership of all right, title, and interest in and to RedTeam AI Labs, including its software, architecture, algorithms, user interface, brand assets, and proprietary heuristics.",
          "Customer Data: As between the parties, you retain 100% ownership of your proprietary target AI system specifications, private policy documents, and confidential business requirements submitted to the Platform.",
          "Generated Reports and Evidence: Subject to full payment of applicable fees, you receive a perpetual, non-exclusive, worldwide license to retain, share with auditors and regulators, and commercially utilize the exportable audit reports, PDF summaries, and test evidence bundles generated for your Workspace.",
        ],
      },
      {
        id: "disclaimer-and-warranties",
        title: "7. Disclaimer of Warranties",
        content: [
          "THE PLATFORM IS PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.",
          "LISUMEN INNOVATIVE HUB SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT: (A) THE PLATFORM WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) ASSURANCE REPORTS OR TESTING CAMPAIGNS WILL IDENTIFY EVERY VULNERABILITY, JAILBREAK, BIAS, OR SAFETY DEFECT; (C) THE RESULTS OF USING THE PLATFORM CONSTITUTE LEGAL ADVICE, STATUTORY CERTIFICATION, OR REGULATORY IMMUNITY UNDER THE NIGERIA DATA PROTECTION ACT, EU AI ACT, OR ANY OTHER STATUTORY SCHEME.",
        ],
      },
      {
        id: "limitation-of-liability",
        title: "8. Limitation of Liability",
        content: [
          "TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE NIGERIAN LAW, IN NO EVENT SHALL LISUMEN INNOVATIVE HUB, ITS DIRECTORS, EMPLOYEES, PARTNERS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE PLATFORM.",
          "IN ALL CIRCUMSTANCES, OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL BE LIMITED TO THE TOTAL AMOUNT PAID BY YOU TO LISUMEN INNOVATIVE HUB FOR ACCESS TO THE PLATFORM DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY, OR FIFTY THOUSAND NIGERIAN NAIRA (NGN 50,000) IF NO FEES HAVE BEEN PAID.",
          "NOTHING IN THESE TERMS PURPORTS TO EXCLUDE OR RESTRICT LIABILITY FOR FRAUD, WILLFUL MISCONDUCT, DEATH, OR PERSONAL INJURY CAUSED BY GROSS NEGLIGENCE, OR ANY OTHER LIABILITY THAT CANNOT LAWFULLY BE EXCLUDED UNDER NIGERIAN LAW.",
        ],
      },
      {
        id: "termination",
        title: "9. Suspension and Termination",
        content: [
          "We reserve the right to suspend or terminate your account and access to the Platform immediately, without prior notice or liability, if: (a) you materially breach any provision of these Terms or the Acceptable Use Policy; (b) we are required to do so by a court of competent jurisdiction, the Nigeria Data Protection Commission (NDPC), or law enforcement authorities; (c) your account activities present a critical security hazard to the Platform, third-party systems, or other tenants.",
          "Upon termination, your right to use the Platform immediately ceases. You may request the export of your audit evidence bundles within thirty (30) days of termination, subject to the Data Retention and Deletion Policy.",
        ],
      },
      {
        id: "governing-law-and-disputes",
        title: "10. Governing Law, Dispute Resolution, and Jurisdiction",
        content: [
          "Governing Law: These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the substantive laws of the Federal Republic of Nigeria.",
          "Good-Faith Negotiation: In the event of any dispute, controversy, or claim, the parties agree to first attempt to resolve the matter through informal, good-faith executive negotiations within thirty (30) days of written notice.",
          "Mediation and Arbitration: If informal negotiations do not resolve the dispute, the parties agree to submit the dispute to formal mediation administered by the [CONFIRMATION REQUIRED: Lagos Court of Arbitration (LCA) or Lagos State Multi-Door Courthouse]. If mediation fails, the dispute shall be finally settled under the Arbitration and Mediation Act 2023 of Nigeria by a sole arbitrator appointed in accordance with the said rules. The seat and venue of arbitration shall be Lagos, Nigeria, and proceedings shall be conducted in the English language.",
          "Judicial Relief: Nothing in this section precludes either party from seeking urgent injunctive, equitable, or conservatory relief before the Federal High Court of Nigeria to prevent irreparable harm or intellectual property infringement.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. PRIVACY POLICY
  // ===========================================================================
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy Policy",
    category: "legal",
    categoryLabel: "Legal",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Nigeria Data Protection Act 2023 (NDPA)",
    summary:
      "This Privacy Policy explains how Lisumen Innovative Hub collects, processes, stores, and protects personal data through RedTeam AI Labs in strict compliance with the Nigeria Data Protection Act 2023 (NDPA), GDPR, UK GDPR, and applicable global privacy regulations.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Appointed Data Protection Officer (DPO) name and contact email]",
      "[CONFIRMATION REQUIRED: NDPC Data Controller Registration Number once issued]",
      "[CONFIRMATION REQUIRED: Physical Nigerian mailing address for formal statutory notices]",
    ],
    sections: [
      {
        id: "privacy-overview",
        title: "1. Operating Entity, Scope, and Controller Roles",
        content: [
          "This Privacy Policy applies to the processing of personal data by Lisumen Innovative Hub ('Company', 'we', 'us', 'our') through the RedTeam AI Labs platform (red-team-ai-labs.vercel.app) and associated services.",
          "Dual Role Architecture: Under the Nigeria Data Protection Act 2023 (NDPA) and international frameworks (such as GDPR Article 4):",
          "(a) Data Controller Role: We act as a Data Controller in respect of user registration data, billing information, account credentials, workspace membership records, and direct communications with us.",
          "(b) Data Processor Role: We act as a Data Processor on behalf of our enterprise customers in respect of customer-provided AI system architectures, target endpoint prompts, custom policy requirements, and generated test execution evidence stored within customer Workspaces. Customer data processing is governed by our Data Processing Agreement (DPA).",
        ],
      },
      {
        id: "data-collected",
        title: "2. Categories of Personal Data Collected",
        content: [
          "We collect and process only the minimal personal data necessary to deliver our enterprise assurance services (Data Minimization Principle under NDPA Section 24(1)(c)):",
          "A. Account & Profile Information: Full name, enterprise business email address, encrypted authentication password hash (managed via Supabase Auth), assigned workspace role, and enterprise organization name.",
          "B. Operational Audit & Telemetry Logs: User ID, actor email address, action performed (e.g. POLICY_CREATED, CAMPAIGN_LAUNCHED), target entity ID, IP address, user-agent string, and timestamp (stored in our immutable audit_events table).",
          "C. Customer AI Governance Records: AI system inventory names, technical owner contact details, deployment environment, human oversight arrangement descriptions, and assessment findings submitted by workspace members.",
          "D. Technical Session Data: Secure, HTTP-only authentication session tokens (sb-*-auth-token) and sandboxed demo session identifiers. We do NOT deploy third-party advertising cookies, social trackers, or cross-site profiling pixels.",
          "E. Children's Data: The Platform is an enterprise business software tool. We do not knowingly collect or solicit personal data from persons under eighteen (18) years of age.",
        ],
      },
      {
        id: "lawful-bases",
        title: "3. Purposes and Lawful Bases of Processing",
        content: [
          "Under Section 25 of the Nigeria Data Protection Act 2023 and Article 6 of the GDPR, we process personal data exclusively under the following lawful bases:",
          "1. Contractual Necessity (NDPA s. 25(1)(b) / GDPR Art. 6(1)(b)): To register your account, manage workspace multi-tenancy, authenticate users, execute scheduled red-teaming campaigns, and generate audit reports.",
          "2. Legitimate Business Interests (NDPA s. 25(1)(e) / GDPR Art. 6(1)(f)): To maintain platform security, prevent unauthorized cross-tenant data access, monitor API rate limits, neutralize SSRF attacks, and enhance automated evaluation heuristics.",
          "3. Legal & Statutory Obligation (NDPA s. 25(1)(c) / GDPR Art. 6(1)(c)): To retain immutable audit logs as mandated by cybersecurity legislation, respond to lawful supervisory orders from the Nigeria Data Protection Commission (NDPC), and comply with tax and corporate reporting laws.",
          "4. Consent (NDPA s. 25(1)(a) / GDPR Art. 6(1)(a)): Where you explicitly opt in to voluntary feedback channels, beta evaluation programs, or optional platform announcements.",
        ],
      },
      {
        id: "security-and-storage",
        title: "4. Data Storage, Architecture, and Security Safeguards",
        content: [
          "We implement technical and organizational measures (TOMs) designed to ensure a level of security appropriate to the risk, in compliance with NDPA Section 39 and GDPR Article 32:",
          "A. Database Hardening & Multi-Tenancy: Primary database infrastructure is hosted via Supabase PostgreSQL on Amazon Web Services (AWS us-east-1). All tables enforce database-level Row-Level Security (RLS) policies with SECURITY DEFINER functions, ensuring cross-tenant isolation and IDOR prevention.",
          "B. Cryptographic Protection: Data in transit is protected using Transport Layer Security (TLS 1.3/1.2) with strict HSTS (max-age=63072000). Passwords are never stored in plaintext and are hashed using salted cryptographic algorithms. Audit evidence records are verified against SHA-256 cryptographic hashes.",
          "C. Defense-in-Depth HTTP Security: Production deployments enforce strict Content-Security-Policy (CSP), X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy, and Permissions-Policy disabling unused browser hardware capabilities.",
          "D. Boundary Protection: API endpoints enforce IP sliding-window rate limiting (15 req/min on login; 120 req/min on general APIs) and kernel-level SSRF filters blocking loopback, IPv6 evasion, and cloud metadata endpoints (169.254.169.254).",
        ],
      },
      {
        id: "third-party-processors",
        title: "5. Subprocessors and Service Providers",
        content: [
          "We engage a strictly vetted group of third-party subprocessors to deliver platform infrastructure. All subprocessors are subject to written data processing agreements requiring equivalent confidentiality and data protection standards:",
          "1. Supabase Inc. (USA / AWS us-east-1): Database hosting, authentication management, user identity storage, and PostgreSQL RLS engine.",
          "2. Vercel Inc. (USA / Global Edge Network): Serverless application hosting, Next.js framework execution, Edge caching, and static asset distribution.",
          "3. Google LLC - Google Generative AI / Gemini API (USA): Large language model inference for adversarial prompt synthesis and semantic evaluation. Data submitted via enterprise API is processed statelessly and is NOT used to train base foundation models.",
          "A comprehensive list of subprocessors, roles, and safeguards is maintained in our public Subprocessors Document.",
        ],
      },
      {
        id: "international-transfers",
        title: "6. International Data Transfers",
        content: [
          "Because our infrastructure subprocessors (Supabase, Vercel, Google) operate cloud infrastructure in the United States and the European Union, personal data collected from Nigeria or other jurisdictions may be transferred across international borders.",
          "Compliance with NDPA Section 41: Cross-border transfers are executed in compliance with Section 41 of the Nigeria Data Protection Act 2023 based on: (a) adequacy designations or regulatory frameworks approved by the NDPC; (b) contractual standard contractual clauses (SCCs) providing enforceable data subject rights and effective legal remedies; (c) explicit contractual necessity to execute the platform assurance services requested by the customer.",
          "Compliance with GDPR Chapter V: Transfers from the EEA/UK are governed by standard contractual clauses approved by the European Commission and the UK International Data Transfer Addendum.",
        ],
      },
      {
        id: "retention-and-deletion",
        title: "7. Data Retention and Deletion",
        content: [
          "We adhere to the Storage Limitation Principle (NDPA Section 24(1)(e)) and retain personal data only for as long as necessary to fulfill the operational purposes for which it was collected:",
          "(a) Account & Profile Data: Retained for the active duration of the user's workspace membership and deleted within thirty (30) days of explicit account deletion.",
          "(b) Campaign Runs & Test Cases: Retained until purged or modified by authorized Workspace Admins.",
          "(c) Audit Evidence & Event Logs: Retained for up to twelve (12) months (or custom contractual retention periods up to seven years for regulated Enterprise customers) to support statutory compliance audits and security forensic reviews.",
          "(d) Disaster Recovery Backups: Automated encrypted database backups are overwritten on a rolling 30-day retention cycle.",
        ],
      },
      {
        id: "user-rights",
        title: "8. Data Subject Privacy Rights and How to Exercise Them",
        content: [
          "Under Section 29 of the Nigeria Data Protection Act 2023, Articles 15-22 of the GDPR, and applicable privacy enactments, data subjects possess the following statutory rights:",
          "1. Right of Access: You have the right to request a copy of the personal data we hold about you.",
          "2. Right to Rectification: You may request the correction of inaccurate or incomplete personal data.",
          "3. Right to Erasure ('Right to be Forgotten'): You may request the deletion of your personal data where retention is no longer justified under law.",
          "4. Right to Restriction of Processing: You may request that we suspend processing your personal data during active dispute resolution.",
          "5. Right to Data Portability: You may request your personal data in a structured, commonly used, and machine-readable format.",
          "6. Right to Object: You may object to data processing grounded in legitimate interests.",
          "7. Right to Withdraw Consent: Where processing relies on consent, you may withdraw it at any time without affecting prior lawful processing.",
          "Exercising Your Rights: To submit a statutory privacy request, visit our Data Subject Rights Portal at /legal/privacy-requests or email our Data Protection Officer at [CONFIRMATION REQUIRED: dpo@redteamailabs.com]. We will acknowledge your request within forty-eight (48) hours and fulfill it within thirty (30) calendar days as prescribed by NDPA guidelines.",
        ],
      },
      {
        id: "complaints-and-supervisory",
        title: "9. Regulatory Authority and Complaint Procedures",
        content: [
          "If you believe our processing of your personal data infringes the Nigeria Data Protection Act 2023 or your statutory rights, we encourage you to contact our DPO first to achieve prompt resolution.",
          "You have the absolute right to lodge a formal complaint directly with the national regulatory authority in Nigeria:",
          "Nigeria Data Protection Commission (NDPC)\nPlot 1238, Cadastral Zone B03, Garki II, Abuja, Nigeria\nWebsite: https://ndpc.gov.ng\nEmail: info@ndpc.gov.ng",
          "If you are resident in the European Economic Area (EEA) or the United Kingdom, you may also lodge a complaint with your local supervisory authority (e.g., the UK Information Commissioner's Office - ICO at https://ico.org.uk).",
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. COOKIE POLICY
  // ===========================================================================
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    shortTitle: "Cookie Policy",
    category: "legal",
    categoryLabel: "Legal",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Nigeria Data Protection Act 2023 & ePrivacy Framework",
    summary:
      "This Cookie Policy provides transparent disclosure regarding the cookies and local storage mechanisms utilized on RedTeam AI Labs. The Platform utilizes strictly essential technical session cookies and zero third-party advertising or tracking cookies.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Confirmation that no third-party marketing tags (e.g. Google Tag Manager) will be introduced without prior notice]",
    ],
    sections: [
      {
        id: "cookies-introduction",
        title: "1. What Are Cookies and Scope of Policy",
        content: [
          "Cookies are small text files placed on your device by websites that you visit. They are widely used to make web applications function efficiently, preserve user session state, and provide necessary security features.",
          "This Cookie Policy applies to the web platform accessible at red-team-ai-labs.vercel.app, operated by Lisumen Innovative Hub.",
          "Our Architectural Commitment: RedTeam AI Labs is an enterprise AI assurance tool. We believe in privacy by design. We do NOT deploy third-party advertising cookies, behavioral tracking pixels, social media widgets, or commercial ad-network beacons.",
        ],
      },
      {
        id: "cookies-used",
        title: "2. Detailed Inventory of Cookies and Storage Actually Used",
        content: [
          "The following technical cookies and local storage keys are deployed within the application:",
          "A. Essential Authentication Tokens ('sb-*-auth-token', chunked tokens 'sb-*-auth-token.0', 'sb-*-auth-token.1'):\n• Provider: Supabase Auth / RedTeam AI Labs\n• Type: First-party, HTTP-only, Secure, SameSite=Lax\n• Purpose: Holds the encrypted JSON Web Token (JWT) establishing your authenticated workspace session. Enables secure API communication and Row-Level Security checks.\n• Lifespan: Session duration or up to 7 days on active devices.",
          "B. Demonstration Session Cookie ('redteam_demo_session'):\n• Provider: RedTeam AI Labs\n• Type: First-party, HTTP-only, Secure\n• Purpose: Maintains sandboxed session state when accessing the pre-configured evaluation workspace in Fellowship/Demo Mode.\n• Lifespan: Current browser session.",
          "C. Cookie Notice Acknowledgment ('redteam_cookie_ack'):\n• Provider: RedTeam AI Labs\n• Type: Local Storage (client-side key)\n• Purpose: Remembers that you have acknowledged our technical cookie notice so the banner does not repetitively display.\n• Lifespan: Persistent until cleared in browser settings.",
        ],
      },
      {
        id: "legal-status",
        title: "3. Legal Basis for Essential Cookies",
        content: [
          "Under the Nigeria Data Protection Act 2023, the European ePrivacy Directive (2002/58/EC as amended), UK Privacy and Electronic Communications Regulations (PECR), and global guidance:",
          "Cookies that are strictly necessary for the technical transmission of communications or for the provision of an information society service explicitly requested by the user are exempt from prior opt-in consent requirements.",
          "Because all cookies deployed by RedTeam AI Labs are strictly necessary for secure authentication and core platform operations, they are enabled automatically upon user login.",
        ],
      },
      {
        id: "managing-cookies",
        title: "4. How to Manage and Disable Cookies in Your Browser",
        content: [
          "You have the right to accept or decline cookies through your web browser settings. Most web browsers automatically accept cookies, but you can modify your settings to decline them or alert you when a cookie is placed.",
          "Browser Guidance:\n• Google Chrome: Settings > Privacy and Security > Third-party cookies\n• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data\n• Apple Safari: Preferences > Privacy > Block all cookies\n• Microsoft Edge: Settings > Cookies and site permissions",
          "Impact of Blocking: If you configure your browser to block strictly essential cookies, you will be unable to log in, authenticate your workspace session, or access protected RedTeam AI Labs dashboard features.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. LEGAL NOTICE
  // ===========================================================================
  notice: {
    slug: "notice",
    title: "Legal Notice & Operating Disclosures",
    shortTitle: "Legal Notice",
    category: "legal",
    categoryLabel: "Legal",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Companies and Allied Matters Act 2020 (CAMA) & Laws of Nigeria",
    summary:
      "Statutory legal disclosures identifying Lisumen Innovative Hub as the operating business behind RedTeam AI Labs, corporate headquarters, hosting infrastructure providers, and regulatory standing.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: CAC Registration Number (RC/BN Number) of Lisumen Innovative Hub]",
      "[CONFIRMATION REQUIRED: Verified Corporate Headquarters Address in Nigeria]",
      "[CONFIRMATION REQUIRED: Official Telephone Number for corporate communications]",
    ],
    sections: [
      {
        id: "operating-entity",
        title: "1. Business Identity and Operating Entity",
        content: [
          "The enterprise web application and services provided under the brand name 'RedTeam AI Labs' are developed, operated, and maintained by Lisumen Innovative Hub.",
          "Operator Distinction: 'RedTeam AI Labs' is a specialized technology product brand and software platform. All contractual, financial, and legal liabilities are held by Lisumen Innovative Hub.",
          "Corporate Registration:\n• Operating Business: Lisumen Innovative Hub\n• Country of Registration: Federal Republic of Nigeria\n• Corporate Affairs Commission (CAC) Status: Registered Enterprise / Business Entity\n• CAC Registration Number: [CONFIRMATION REQUIRED: RC/BN Number, e.g. BN-XXXXXXX]\n• Tax Identification Number (TIN): [CONFIRMATION REQUIRED: FIRS TIN]",
        ],
      },
      {
        id: "contact-information",
        title: "2. Official Business Contact Details",
        content: [
          "Corporate Headquarters:\nLisumen Innovative Hub\n[CONFIRMATION REQUIRED: Street Address, City, State, Federal Republic of Nigeria]",
          "Communications Directory:\n• General Enquiries: contact@redteamailabs.com / [CONFIRMATION REQUIRED: contact@lisumen.hub]\n• Legal & Regulatory Affairs: legal@redteamailabs.com\n• Data Protection Officer (DPO): dpo@redteamailabs.com\n• Security & Vulnerability Disclosures: security@redteamailabs.com\n• Enterprise Sales & Partnerships: enterprise@redteamailabs.com",
        ],
      },
      {
        id: "hosting-infrastructure",
        title: "3. Hosting and Technical Infrastructure Disclosures",
        content: [
          "Application Frontend & Serverless Compute Provider:\nVercel Inc.\n440 N Barranca Ave #4133, Covina, CA 91723, United States\nWebsite: https://vercel.com",
          "Database & Authentication Infrastructure Provider:\nSupabase Inc.\n970 Toa Payoh North #07-04, Singapore / Amazon Web Services (AWS us-east-1, North Virginia, USA)\nWebsite: https://supabase.com",
          "Generative AI Inference API Provider:\nGoogle LLC (Google Generative AI / Gemini API)\n1600 Amphitheatre Parkway, Mountain View, CA 94043, United States\nWebsite: https://ai.google.dev",
        ],
      },
      {
        id: "regulatory-standing",
        title: "4. Professional Disclaimers and Regulatory Standing",
        content: [
          "Not a Law Firm: RedTeam AI Labs provides automated testing, risk evaluation, and evidence generation software. Lisumen Innovative Hub is not a law firm, certified audit body, or accredited conformity assessment body under the EU AI Act or ISO/IEC 42001.",
          "No Legal Advice: The software outputs, risk scores, and compliance mapping recommendations provided by the Platform are informational technical aids and do not constitute formal legal advice, statutory certification, or regulatory clearance.",
          "Customers must engage qualified legal practitioners and certified auditors to review consequential AI compliance determinations.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ACCEPTABLE USE POLICY (AUP)
  // ===========================================================================
  "acceptable-use": {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    shortTitle: "Acceptable Use",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 & Laws of Nigeria",
    summary:
      "Defines mandatory rules of engagement for conducting AI red-teaming, model evaluations, and MCP tool inspections on RedTeam AI Labs. Prohibits unauthorized targeting, weaponization of adversarial prompts, and abuse.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Security Operations escalation phone contact]",
    ],
    sections: [
      {
        id: "aup-purpose",
        title: "1. Purpose and Scope of Testing Activities",
        content: [
          "RedTeam AI Labs is built exclusively for authorized AI safety research, governance validation, risk management, and empirical red-teaming of AI systems.",
          "This Acceptable Use Policy ('AUP') applies to all users, workspace members, API clients, and automated agents accessing RedTeam AI Labs. Compliance with this AUP is a mandatory condition of platform access.",
        ],
      },
      {
        id: "mandatory-authorization",
        title: "2. Mandatory Authorization and Target Ownership",
        content: [
          "Authorized Targets Only: You must only execute red-team campaigns, prompt injection probes, or MCP tool evaluations against AI models, APIs, and agent endpoints that: (a) are owned and operated directly by your organization; or (b) you possess explicit, documented written authorization from the system owner to evaluate.",
          "Prohibition on Third-Party Probing: You are strictly prohibited from targeting third-party public AI endpoints, competitor platforms, or government systems without documented authorization.",
          "Audit Trail Cooperation: In the event of an inquiry regarding unauthorized probing, you agree to immediately produce written proof of authorization upon request by Lisumen Innovative Hub.",
        ],
      },
      {
        id: "prohibited-activities",
        title: "3. Strictly Prohibited Activities",
        content: [
          "You must not engage in any of the following activities on or through the Platform:",
          "A. Weaponization & Malicious Exploitation: Using the Platform's adversarial test generators or evasion heuristics to construct real-world attack vectors for malware deployment, ransomware operations, cyber-extortion, or targeted harassment.",
          "B. Infrastructure Abuse & Denial of Service: Executing volumetric stress tests, denial of service (DoS/DDoS) attacks, or unbounded recursive tool loops designed to overwhelm our servers, database, or downstream AI API providers.",
          "C. Circumvention of Security Controls: Attempting to bypass the Platform's kernel SSRF filters, token blacklists, sliding-window rate limiters, or Row-Level Security (RLS) tenant isolation policies.",
          "D. Dissemination of Prohibited Content: Inputting or synthesizing prompts containing child sexual abuse material (CSAM), non-consensual intimate imagery, violent extremist recruitment, or instructions for constructing chemical, biological, radiological, or nuclear (CBRN) weapons.",
          "E. Violation of Cybercrime Legislation: Engaging in conduct that constitutes an offense under the Cybercrimes (Prohibition, Prevention, etc.) Act 2015 of Nigeria or equivalent global computer crime statutes.",
        ],
      },
      {
        id: "monitoring-and-enforcement",
        title: "4. Telemetry Monitoring, Suspension, and Enforcement",
        content: [
          "Security Telemetry: We monitor platform usage, API consumption, audit events, and anomalous traffic patterns to identify abuse, unauthorized testing, and security breaches.",
          "Remedial Actions: In the event of a suspected or confirmed violation of this AUP, Lisumen Innovative Hub reserves the right to: (a) Immediately terminate active campaigns; (b) Suspend or delete the offending user account and Workspace; (c) Retain forensic evidence logs for legal analysis; (d) Report unlawful activities to law enforcement agencies, including the Nigeria Police Force National Cybercrime Centre (NPF-NCCC) and the Economic and Financial Crimes Commission (EFCC).",
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. AI USAGE, ACCURACY AND DISCLAIMER
  // ===========================================================================
  "ai-disclaimer": {
    slug: "ai-disclaimer",
    title: "AI Usage, Accuracy and Governance Disclaimer",
    shortTitle: "AI Disclaimer",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Laws of the Federal Republic of Nigeria",
    summary:
      "Clarifies the operational mechanics of RedTeam AI Labs ('The LLM Proposes, the Backend Disposes'), limitations of synthetic adversarial testing, potential for false positives/negatives, and the necessity of human governance oversight.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Review by specialized AI regulatory counsel]",
    ],
    sections: [
      {
        id: "operational-architecture",
        title: "1. Dual-Engine Architecture ('The LLM Proposes, the Backend Disposes')",
        content: [
          "RedTeam AI Labs employs an advanced dual-engine assurance architecture:",
          "(a) Generative LLM Proposal Layer: Google Gemini models are utilized to generate multi-strategy adversarial prompts (instruction overrides, BOLA boundary tests, demographic bias probes) and propose semantic pass/fail scores for open-ended model outputs.",
          "(b) Deterministic Backend Disposition Layer: Generative proposals are strictly non-authoritative. All final risk scoring, statutory framework mappings, severity classifications (Critical, High, Medium, Low), and policy gate dispositions are computed by deterministic backend rules in PostgreSQL. Zero hallucinated passes. Zero evaluator drift.",
        ],
      },
      {
        id: "accuracy-limitations",
        title: "2. Inherent Limitations of Automated AI Testing",
        content: [
          "Users acknowledge and agree that automated AI red-teaming carries inherent technical limitations:",
          "A. False Positives & False Negatives: Automated evaluators may misinterpret subtle linguistic nuances, leading to false alarms (reporting a failure where an AI output was safe) or false negatives (failing to detect an evasion vector).",
          "B. Non-Exhaustive Testing: AI systems exhibit vast, non-deterministic input spaces. Achieving a 100% pass rate across a RedTeam AI Labs campaign demonstrates empirical resilience against tested vectors but does not prove the total absence of undiscovered vulnerabilities, novel jailbreaks, or catastrophic alignment failures.",
          "C. Model Drift & Environmental Variance: External AI models updated by third-party providers (OpenAI, Anthropic, Google) may alter their behavioral dispositions without notice. Historical assurance reports reflect system posture at the exact timestamp of campaign execution.",
        ],
      },
      {
        id: "human-in-the-loop",
        title: "3. Mandatory Human Review and Professional Oversight",
        content: [
          "Informational Tool Only: All campaign findings, incident reports, risk scores, and evidence packages produced by RedTeam AI Labs are advisory decision-support tools. They are designed to augment—not replace—human judgment.",
          "Consequential Decisions: Customers remain solely responsible for all consequential business, deployment, legal, clinical, or financial decisions made regarding their AI systems. A human governance lead must review critical findings before approving high-liability models for production use.",
          "No Substitute for Legal or Technical Counsel: The Platform does not replace bespoke legal advice from qualified Nigerian or international privacy lawyers, nor does it eliminate the necessity of periodic manual penetration testing by certified cybersecurity professionals.",
        ],
      },
      {
        id: "no-regulatory-certification",
        title: "4. No Official Regulatory Endorsement or Certification",
        content: [
          "Reference to Statutory Frameworks: The Platform cross-walks empirical test results to standards such as NIST AI RMF 1.0, ISO/IEC 42001, the EU AI Act (Regulation (EU) 2024/1689), and the NDPA 2023.",
          "No Official Certification: References to these frameworks signify structural alignment and evidence mapping only. Utilizing RedTeam AI Labs does NOT constitute formal accreditation, conformity certification, or official approval by the European Commission, the Nigeria Data Protection Commission (NDPC), NIST, or the International Organization for Standardization (ISO).",
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. DATA RETENTION AND DELETION POLICY
  // ===========================================================================
  retention: {
    slug: "retention",
    title: "Data Retention and Deletion Policy",
    shortTitle: "Data Retention",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Nigeria Data Protection Act 2023 (NDPA Section 24(1)(e))",
    summary:
      "Specifies the empirical retention intervals, automated deletion triggers, customer-initiated purging procedures, and disaster recovery backup lifecycles implemented in RedTeam AI Labs.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Specific enterprise tier retention expansion addendums]",
    ],
    sections: [
      {
        id: "retention-principles",
        title: "1. Core Principles of Storage Limitation",
        content: [
          "In accordance with Section 24(1)(e) of the Nigeria Data Protection Act 2023 and Article 5(1)(e) of the GDPR, RedTeam AI Labs enforces strict storage limitation principles.",
          "Personal and customer data is retained only for as long as is strictly necessary to satisfy the commercial, operational, forensic, and statutory purposes for which it was captured.",
        ],
      },
      {
        id: "retention-schedule",
        title: "2. Verified Empirical Retention Schedules",
        content: [
          "Data Categories and Specific Retention Intervals:",
          "A. User Account Credentials & Workspace Membership:\n• Retention: Maintained for the active lifecycle of the user's workspace membership.\n• Deletion Trigger: Deleted within thirty (30) calendar days following account termination or removal by a Workspace Admin.",
          "B. AI System Registry, Policies & Risk Registers:\n• Retention: Retained dynamically while active in the workspace to track lifecycle governance.\n• Deletion Trigger: Immediate database deletion upon user deletion via the interface, cascading to associated child records (ON DELETE CASCADE).",
          "C. Campaign Runs, Test Cases & Findings:\n• Retention: Retained for the duration of the customer's subscription to enable longitudinal regression tracking.\n• Deletion Trigger: Workspace Admins can purge individual campaigns or findings at any time.",
          "D. Cryptographic Evidence & Audit Event Logs (evidence, audit_events):\n• Retention: Standard tier retains logs for twelve (12) months. Enterprise contractual agreements may extend retention up to seven (7) years to satisfy financial or health statutory audit requirements.\n• Deletion Trigger: Automated scheduled pruning of records exceeding the applicable retention horizon.",
          "E. Technical Authentication Sessions:\n• Retention: Supabase JWT access tokens expire after one (1) hour and are refreshed via secure refresh tokens. Explicit logout immediately deletes all session cookies.",
        ],
      },
      {
        id: "customer-deletion-procedures",
        title: "3. Customer-Initiated Deletion and Account Termination",
        content: [
          "Workspace Purge: Workspace Owners can initiate a full workspace purge through Workspace Settings or by submitting a verified request to our DPO. Deleting a workspace invokes PostgreSQL cascade deletion across all relational records (ai_systems, policies, campaigns, findings, evidence).",
          "Export Prior to Deletion: Customers are strongly advised to export their compliance reports (JSON, CSV, PDF) prior to initiating deletion, as database purging is permanent and cryptographically irreversible.",
        ],
      },
      {
        id: "backup-retention",
        title: "4. Disaster Recovery Backups and Legal Exceptions",
        content: [
          "Disaster Recovery Lifecycle: Encrypted point-in-time backups of the primary database are retained for operational recovery purposes on a rolling thirty (30) day lifecycle. Once a record is purged from the production database, it will completely expire from backup media within thirty (30) days.",
          "Statutory Hold Exceptions: We reserve the right to preserve specific audit logs beyond standard retention horizons where required by an active court subpoena, formal NDPC investigation, or pending litigation under Nigerian law.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 8. SECURITY AND VULNERABILITY DISCLOSURE POLICY
  // ===========================================================================
  "security-disclosure": {
    slug: "security-disclosure",
    title: "Security and Vulnerability Disclosure Policy",
    shortTitle: "Security & Disclosure",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Cybercrimes (Prohibition, Prevention, etc.) Act 2015 of Nigeria",
    summary:
      "Outlines our responsible disclosure guidelines, safe harbor protections for good-faith ethical security researchers, communication channels, and prohibited testing methods.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Dedicated PGP/GPG key fingerprint for encrypted security reporting]",
    ],
    sections: [
      {
        id: "security-commitment",
        title: "1. Our Commitment to Platform Security",
        content: [
          "Lisumen Innovative Hub takes the security of RedTeam AI Labs and our customer data with utmost seriousness. We value the contributions of ethical security researchers and believe in responsible, coordinated vulnerability disclosure.",
          "This Vulnerability Disclosure Policy provides clear guidelines for conducting security research on RedTeam AI Labs and establishes safe harbor terms for researchers acting in good faith.",
        ],
      },
      {
        id: "safe-harbor",
        title: "2. Safe Harbor for Good-Faith Researchers",
        content: [
          "If you conduct vulnerability research in strict adherence to this policy, Lisumen Innovative Hub commits to the following:",
          "(a) We will consider your research authorized under applicable cybercrime legislation, including the Cybercrimes (Prohibition, Prevention, etc.) Act 2015 of Nigeria;",
          "(b) We will not initiate legal action or report you to law enforcement for accidental or good-faith security disclosures;",
          "(c) We will work collaboratively with you to understand, validate, and remediate the issue promptly;",
          "(d) We will recognize your responsible disclosure publicly (with your permission) upon successful remediation.",
        ],
      },
      {
        id: "testing-rules",
        title: "3. Responsible Research Rules and Prohibited Activities",
        content: [
          "To remain within the scope of this policy and safe harbor protection, you must adhere strictly to the following:",
          "A. Prohibited Testing Vectors:\n• Do NOT execute Denial of Service (DoS/DDoS) attacks against our servers, APIs, or database;\n• Do NOT perform physical attacks against personnel, offices, or data centers;\n• Do NOT employ social engineering, phishing, or pretexting against employees or contractors;\n• Do NOT destroy, modify, or exfiltrate data belonging to any other user or workspace tenant.",
          "B. Mandatory Restraint: If you encounter private customer data, stop testing immediately, do not view or copy additional data, and notify us immediately.",
          "C. Coordinated Disclosure: Give us a reasonable period of at least thirty (30) days to remediate the vulnerability before publicly disclosing any details.",
        ],
      },
      {
        id: "reporting-process",
        title: "4. How to Report a Vulnerability and Response SLA",
        content: [
          "Reporting Channel: Submit vulnerability reports directly to security@redteamailabs.com [CONFIRMATION REQUIRED: security@redteamailabs.com]. For sensitive disclosures, request our PGP public key.",
          "Report Contents: Include a clear description of the vulnerability, affected URL/endpoint, step-by-step reproduction instructions, and a minimal proof-of-concept (PoC).",
          "Response Commitments:\n• Acknowledgment: We will acknowledge receipt of your report within forty-eight (48) hours;\n• Triage & Assessment: We will complete initial triage within five (5) business days;\n• Remediation & Status: We will provide status updates at least every fourteen (14) days until the issue is resolved.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 9. INTELLECTUAL PROPERTY AND CUSTOMER DATA POLICY
  // ===========================================================================
  "intellectual-property": {
    slug: "intellectual-property",
    title: "Intellectual Property and Customer Data Policy",
    shortTitle: "Intellectual Property",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Copyright Act 2022 & Patents and Designs Act of Nigeria",
    summary:
      "Establishes platform IP ownership by Lisumen Innovative Hub, guarantees 100% customer ownership of submitted AI models and private data, and defines commercial usage rights over generated audit deliverables.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Trademark registration filing details for RedTeam AI Labs]",
    ],
    sections: [
      {
        id: "platform-ownership",
        title: "1. Ownership of Platform Intellectual Property",
        content: [
          "Lisumen Innovative Hub holds exclusive ownership of all right, title, interest, copyright, patent rights, trade secrets, and trademark rights in and to RedTeam AI Labs.",
          "Protected Assets include: (a) Platform source code, APIs, and software architecture; (b) Proprietary adversarial test generation strategies and heuristics; (c) Risk-scoring formulas, quantitative matrix algorithms, and severity reconciliation engines; (d) Visual design, branding, shield icons, typography, and website interfaces.",
          "No implied licenses are granted. You may not copy, reproduce, scrape, mirror, or create derivative works based on our platform software.",
        ],
      },
      {
        id: "customer-data-ownership",
        title: "2. Customer Ownership of Target Models and Submitted Data",
        content: [
          "Customer Retains Full Ownership: You retain complete and unencumbered ownership of all intellectual property rights in and to: (a) Your proprietary AI system architectures, model weights, and prompt configurations; (b) Your private corporate policies, governance standards, and business rules; (c) Target API credentials and custom endpoint configurations.",
          "Limited Processing License: You grant Lisumen Innovative Hub only a strictly limited, non-exclusive, worldwide, royalty-free license to host, process, and transmit your data solely to the extent necessary to perform the assurance and testing services requested by your Workspace.",
        ],
      },
      {
        id: "ai-deliverable-ownership",
        title: "3. Ownership and Commercial Rights in Generated Deliverables",
        content: [
          "Customer Ownership of Reports: All audit reports, PDF compliance summaries, finding records, CSV matrices, and JSON evidence bundles generated by RedTeam AI Labs for your Workspace belong exclusively to you.",
          "Commercial and Regulatory Usage: You have the unrestricted right to: (a) Present generated audit evidence to insurance underwriters, regulatory bodies (e.g. NDPC, EU AI Office), and third-party auditors; (b) Incorporate report findings into enterprise risk registers and board filings; (c) Share evidence bundles with your enterprise customers to demonstrate AI assurance.",
        ],
      },
      {
        id: "feedback-and-contributions",
        title: "4. User Feedback and Feature Suggestions",
        content: [
          "If you voluntarily submit comments, ideas, or feedback regarding platform improvements, you agree that Lisumen Innovative Hub may freely use, modify, and incorporate such feedback into our products without restriction, royalty, or compensation to you.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 10. REFUND AND CANCELLATION POLICY
  // ===========================================================================
  refunds: {
    slug: "refunds",
    title: "Refund and Cancellation Policy",
    shortTitle: "Refund & Cancellation",
    category: "policies",
    categoryLabel: "Policies",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Federal Competition and Consumer Protection Act 2018 (FCCPA)",
    summary:
      "Transparent commercial terms governing subscription cancellation workflows, refund eligibility, payment disputes, and enterprise contract termination under Nigerian consumer protection standards.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Designated billing inquiries email address]",
      "[CONFIRMATION REQUIRED: Supported payment gateway details (e.g. Paystack / Flutterwave / Stripe)]",
    ],
    sections: [
      {
        id: "cancellation-procedures",
        title: "1. Subscription Cancellation Workflows",
        content: [
          "Self-Service Cancellation: Workspace Owners can cancel active recurring subscriptions at any time via Workspace Settings > Billing or by emailing billing@redteamailabs.com [CONFIRMATION REQUIRED: billing@redteamailabs.com].",
          "Effective Date of Cancellation: When you cancel a subscription, your cancellation takes effect at the end of the current billing cycle (monthly or annual). You will retain full access to your Workspace and audit evidence until the end of that paid period.",
        ],
      },
      {
        id: "refund-eligibility",
        title: "2. Refund Eligibility and Commercial Terms",
        content: [
          "A. Monthly Recurring Subscriptions: Monthly subscription fees are non-refundable for partial months of service. We do not issue pro-rata refunds for mid-billing cycle cancellations.",
          "B. Annual Enterprise Contracts: Annual enterprise agreements are governed by the specific terms of the executed Master Services Agreement (MSA) or Enterprise Order Form. Where an MSA includes a statutory evaluation period (e.g. 14 days from workspace onboarding), refund requests submitted within that window will be honored less prorated infrastructure usage fees.",
          "C. Service Outages & SLA Breaches: If the Platform experiences extended, unscheduled downtime exceeding our contractual SLA commitments, eligible enterprise customers may request service credits in accordance with their executed SLA terms.",
          "D. Free Tiers and Pilot Accounts: Demonstration and Pilot tier accounts are offered free of charge. No payment liability or refund rights attach to non-paying evaluation tiers.",
        ],
      },
      {
        id: "payment-disputes",
        title: "3. Chargebacks and Payment Disputes",
        content: [
          "Notice Before Dispute: If you believe you have been billed in error, you agree to contact our billing team at billing@redteamailabs.com [CONFIRMATION REQUIRED] within thirty (30) days of the invoice date before initiating a payment dispute with your bank or payment processor.",
          "We commit to investigating billing discrepancies in good faith and issuing prompt credits for verified accounting errors.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 11. DATA PROCESSING AGREEMENT (DPA)
  // ===========================================================================
  dpa: {
    slug: "dpa",
    title: "Data Processing Agreement (DPA)",
    shortTitle: "Data Processing Agreement",
    category: "data-protection",
    categoryLabel: "Data Protection",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Nigeria Data Protection Act 2023 (Section 32/33) & GDPR Article 28",
    summary:
      "Statutory contract governing Lisumen Innovative Hub's role as a Data Processor on behalf of enterprise Customer Data Controllers. Sets forth data processing instructions, technical security controls, subprocessor rules, and breach notification SLAs.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: DPA execution procedure (click-wrap vs. signed counter-execution)]",
    ],
    sections: [
      {
        id: "dpa-preamble",
        title: "1. Scope, Purpose, and Parties",
        content: [
          "This Data Processing Agreement ('DPA') supplements the RedTeam AI Labs Terms of Service and applies to all processing of personal data conducted by Lisumen Innovative Hub on behalf of the Customer in the course of providing AI assurance services.",
          "Parties and Roles: The Customer acts as the 'Data Controller' (or Data Fiduciary under NDPA Section 65) and Lisumen Innovative Hub acts as the 'Data Processor' (or Data Processor under NDPA Section 65). Each party warrants compliance with the Nigeria Data Protection Act 2023 (NDPA), GDPR, UK GDPR, and applicable statutory frameworks.",
        ],
      },
      {
        id: "processing-details",
        title: "2. Details and Subject Matter of Processing",
        content: [
          "A. Subject Matter: The provision of automated AI governance, model red-teaming, prompt evaluation, MCP tool inspection, and evidence generation.",
          "B. Duration: The duration of the Customer's active subscription plus any post-termination retention period specified in the Retention Policy.",
          "C. Nature and Purpose: Ingesting, executing, analyzing, and storing AI prompts, model responses, system descriptions, and governance evidence to assess safety, security, and statutory compliance.",
          "D. Categories of Data: Business contact details, AI system prompt texts, model outputs, target system parameters, and operational audit telemetry.",
          "E. Categories of Data Subjects: Customer employees, enterprise users, and individuals interacting with customer AI systems whose responses are tested.",
        ],
      },
      {
        id: "processor-obligations",
        title: "3. Obligations of the Data Processor",
        content: [
          "Lisumen Innovative Hub undertakes and warrants that it shall:",
          "(a) Documented Instructions: Process Customer personal data strictly in accordance with documented instructions from the Customer, including with respect to international transfers, unless required to do so by applicable Nigerian or international law;",
          "(b) Confidentiality: Ensure that all personnel, contractors, and agents authorized to process personal data have committed themselves to binding confidentiality obligations;",
          "(c) Security Controls: Implement and maintain robust technical and organizational measures (TOMs) as detailed in Section 4 of this DPA and NDPA Section 39;",
          "(d) Data Subject Assistance: Provide reasonable technical assistance to enable the Customer to respond to statutory Data Subject Rights requests under NDPA Section 29 and GDPR Chapter III;",
          "(e) Audit Assistance: Make available to the Customer all information reasonably necessary to demonstrate compliance with these processor obligations and allow for audits conducted by the Customer or an agreed independent auditor.",
        ],
      },
      {
        id: "technical-measures",
        title: "4. Technical and Organizational Measures (TOMs)",
        content: [
          "The Processor maintains the following technical security architecture:",
          "• Strict Database-Level Multi-Tenancy: PostgreSQL Row-Level Security (RLS) policies isolating all customer records by workspace_id;",
          "• Cryptographic Transit Defense: TLS 1.3 / TLS 1.2 with strict HTTP Strict Transport Security (HSTS 2-year preload);",
          "• Modern Security Headers: Enforced CSP with frame-ancestors 'self', X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, Referrer-Policy, and Permissions-Policy;",
          "• Rate Limiting & SSRF Neutralization: Kernel-level IP filtering blocking cloud metadata endpoints (169.254.169.254) and sliding-window rate limiters;",
          "• Immutable Audit Records: Cryptographic SHA-256 content hashing across test evidence to guarantee tamper-resistance.",
        ],
      },
      {
        id: "subprocessors",
        title: "5. Subprocessor Management",
        content: [
          "Consent to Subprocessors: Customer grants general written authorization to Lisumen Innovative Hub to engage the subprocessors listed in our public Subprocessors Document (Vercel, Supabase, Google).",
          "Subprocessor Standards: We impose contractual data protection obligations on each subprocessor that are no less protective than those set forth in this DPA.",
          "Notice of Changes: We will publish updates to our Subprocessors Document at least fourteen (14) days prior to authorizing any new infrastructure subprocessor, giving Customers an opportunity to object on reasonable privacy grounds.",
        ],
      },
      {
        id: "breach-notification",
        title: "6. Personal Data Breach Notification",
        content: [
          "Notification SLA: In the event of a confirmed Personal Data Breach affecting Customer personal data, Lisumen Innovative Hub shall notify the Customer without undue delay and, in any event, within forty-eight (48) hours of becoming aware of the breach.",
          "Breach Report Details: The notification shall describe: (a) The nature and scope of the incident; (b) The categories and approximate number of data subjects affected; (c) Likely consequences of the breach; (d) Remedial measures taken or proposed to mitigate potential adverse effects.",
        ],
      },
      {
        id: "return-and-deletion",
        title: "7. Return and Deletion of Customer Personal Data",
        content: [
          "Upon termination of the Services, Lisumen Innovative Hub shall, at the choice of the Customer, delete or return all Customer personal data, and delete existing copies unless Nigerian or international law mandates continued storage.",
        ],
      },
    ],
  },

  // ===========================================================================
  // 12. SUBPROCESSORS AND THIRD-PARTY SERVICES
  // ===========================================================================
  subprocessors: {
    slug: "subprocessors",
    title: "Subprocessors and Third-Party Infrastructure Providers",
    shortTitle: "Subprocessors",
    category: "data-protection",
    categoryLabel: "Data Protection",
    effectiveDate: "November 1, 2026",
    lastUpdated: "November 9, 2026",
    version: "2.1.0",
    governingLaw: "Nigeria Data Protection Act 2023 & GDPR Article 28(2)",
    summary:
      "Full disclosure of verified infrastructure subprocessors engaged by Lisumen Innovative Hub to deliver RedTeam AI Labs. Details exact processing roles, physical server regions, and legal transfer mechanisms.",
    confirmationItems: [
      "[CONFIRMATION REQUIRED: Notification distribution list for prospective subprocessor additions]",
    ],
    sections: [
      {
        id: "subprocessor-overview",
        title: "1. Overview and Vetting Standards",
        content: [
          "To provide high-reliability enterprise AI governance and assurance, Lisumen Innovative Hub engages a minimal set of industry-leading infrastructure providers as subprocessors.",
          "Strict Vetting: Each subprocessor undergoes rigorous technical and legal evaluations regarding data privacy, SOC 2 Type II compliance, encryption standards, and cross-border transfer mechanisms.",
          "Zero Phantom Vendors: We disclose ONLY infrastructure providers that are actually utilized in our active codebase.",
        ],
      },
      {
        id: "verified-subprocessors",
        title: "2. Active Verified Infrastructure Subprocessors",
        content: [
          "The following three (3) infrastructure providers constitute our complete active subprocessor inventory:",
          "1. Supabase Inc.\n• Corporate Domicile: Singapore / USA\n• Server / Processing Location: Amazon Web Services (AWS us-east-1, North Virginia, USA)\n• Role & Processing Activities: Hosted PostgreSQL database, Row-Level Security policy enforcement, user authentication (Supabase Auth), password hash storage, and encrypted session management.\n• Safeguards & Certifications: SOC 2 Type II compliant, AES-256 database encryption at rest, TLS 1.3 in transit, Standard Contractual Clauses (SCCs).\n• Privacy Policy: https://supabase.com/privacy",
          "2. Vercel Inc.\n• Corporate Domicile: United States (Covina, CA)\n• Server / Processing Location: Global Edge Network / USA Serverless Functions\n• Role & Processing Activities: Frontend Next.js hosting, Edge CDN distribution, API route execution, middleware execution, and static asset delivery.\n• Safeguards & Certifications: SOC 2 Type II compliant, ISO 27001, DDoS mitigation, TLS 1.3 with strict HSTS, Standard Contractual Clauses (SCCs).\n• Privacy Policy: https://vercel.com/legal/privacy-policy",
          "3. Google LLC - Google Generative AI / Gemini API\n• Corporate Domicile: United States (Mountain View, CA)\n• Server / Processing Location: United States (Google Cloud Platform infrastructure)\n• Role & Processing Activities: Generative inference for synthesizing multi-strategy adversarial prompts and conducting semantic grading of model outputs.\n• Safeguards & Certifications: Enterprise API terms strictly prohibit the use of customer inputs or outputs to train Google foundation models; data is processed statelessly and encrypted in transit via TLS.\n• Privacy Policy: https://policies.google.com/privacy",
        ],
      },
      {
        id: "customer-configured-targets",
        title: "3. Customer-Configured External AI Targets",
        content: [
          "External Target Notice: When you configure custom target endpoints in your AI System Registry (e.g., custom enterprise OpenAI endpoints or private corporate APIs), RedTeam AI Labs transmits synthetic adversarial prompts directly to those endpoints at your explicit instruction.",
          "Customer Responsibility: Customer-configured AI targets are third-party endpoints managed directly by you. They are not subprocessors of Lisumen Innovative Hub.",
        ],
      },
      {
        id: "subprocessor-notifications",
        title: "4. Subprocessor Updates and Notification Mechanism",
        content: [
          "Notification Commitment: Lisumen Innovative Hub will notify customers of any planned additions or replacements to this subprocessor list at least fourteen (14) days prior to authorizing the new provider.",
          "Objection Rights: Customers may object to proposed subprocessors on reasonable data protection grounds by emailing dpo@redteamailabs.com within fourteen (14) days of notification.",
        ],
      },
    ],
  },
};

