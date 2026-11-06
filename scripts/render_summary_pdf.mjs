import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function generateSummaryPdf() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1E293B;
    line-height: 1.38;
    font-size: 8.7pt;
    background: #FFFFFF;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    page-break-after: always;
    height: 275mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  .page:last-child {
    page-break-after: avoid;
  }

  /* Header Branding */
  .doc-header {
    border-bottom: 2px solid #0284C7;
    padding-bottom: 6px;
    margin-bottom: 9px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .title-area h1 {
    font-size: 17pt;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.4px;
    margin-bottom: 2px;
    line-height: 1.15;
  }

  .title-area .tagline {
    font-size: 8.8pt;
    font-weight: 600;
    color: #0284C7;
  }

  .meta-area {
    text-align: right;
    font-size: 7.6pt;
    color: #475569;
    line-height: 1.3;
  }

  .meta-area strong {
    color: #0F172A;
  }

  /* Section Styling */
  .section {
    margin-bottom: 8px;
  }

  .section-title {
    font-size: 9.6pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #0F172A;
    border-left: 3.5px solid #0284C7;
    padding-left: 6px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  p {
    margin-bottom: 4px;
    text-align: justify;
  }

  /* Callout Banner */
  .callout-box {
    background: #F0F9FF;
    border: 1px solid #BAE6FD;
    border-left: 3.5px solid #0284C7;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 4px 0 6px 0;
    font-size: 8.2pt;
    color: #0369A1;
    line-height: 1.35;
  }

  .callout-box strong {
    color: #0C4A6E;
  }

  /* Grids */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 6px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 7px;
    margin-bottom: 6px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 6px;
  }

  .card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 4px;
    padding: 6px 8px;
  }

  .card-title {
    font-size: 8.4pt;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card ul {
    list-style: none;
    padding-left: 0;
  }

  .card li {
    font-size: 7.8pt;
    color: #334155;
    margin-bottom: 2.5px;
    position: relative;
    padding-left: 10px;
    line-height: 1.25;
  }

  .card li::before {
    content: "•";
    color: #0284C7;
    font-size: 9pt;
    position: absolute;
    left: 0;
    top: -2px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.6pt;
    margin-bottom: 4px;
  }

  th {
    background: #0F172A;
    color: #FFFFFF;
    text-align: left;
    padding: 3.5px 5px;
    font-weight: 700;
    font-size: 7.4pt;
  }

  td {
    padding: 3px 5px;
    border-bottom: 1px solid #E2E8F0;
    color: #334155;
  }

  tr:nth-child(even) td {
    background: #F8FAFC;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.4pt;
  }

  .stat-badge {
    background: #ECFDF5;
    border: 1px solid #A7F3D0;
    color: #065F46;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 7.4pt;
    font-weight: 600;
    text-align: center;
  }

  .stat-num {
    font-size: 12pt;
    font-weight: 800;
    color: #047857;
    display: block;
    line-height: 1.1;
    margin-bottom: 1px;
  }

  /* Footer */
  .doc-footer {
    border-top: 1px solid #CBD5E1;
    padding-top: 4px;
    display: flex;
    justify-content: space-between;
    font-size: 7.2pt;
    color: #64748B;
  }
</style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="title-area">
          <h1>RedTeam AI Labs</h1>
          <div class="tagline">Enterprise AI Governance, Agentic Tool-Execution Assurance &amp; Risk Management Platform</div>
        </div>
        <div class="meta-area">
          <strong>Founder:</strong> Sulisumen Peter<br>
          <strong>GitHub:</strong> github.com/sulisumenpeter/RedTeam-AI-Labs<br>
          <strong>Focus:</strong> Legal AI, Autonomous Agentic Systems &amp; Regulated Verticals
        </div>
      </div>

      <!-- 1. Executive Summary -->
      <div class="section">
        <div class="section-title">1. Executive Overview</div>
        <p>
          <strong>RedTeam AI Labs</strong> is an integrated software platform that operationalizes trust, regulatory compliance, and safety assurance across the enterprise AI and autonomous agent lifecycle. While organizations are rapidly deploying Large Language Models (LLMs) and autonomous agent workflows for client intake, contract drafting, database queries, and external tool execution, traditional Governance, Risk, and Compliance (GRC) tools remain static spreadsheet questionnaires that cannot evaluate active model behavior. RedTeam AI Labs bridges this operational divide by uniting <strong>policy-driven adversarial red-teaming</strong> and <strong>Agentic Tool-Execution Assurance (Model Context Protocol / MCP &amp; OpenTelemetry trace inspection)</strong> with <strong>quantitative 5x5 risk registers</strong>, <strong>statutory framework cross-walking</strong> (NIST AI RMF 1.0, EU AI Act Reg. 2024/1689, ISO/IEC 42001:2023, OECD AI, and OWASP Agentic Top 10 2026), and <strong>tamper-evident SHA-256 audit trails</strong>.
        </p>
        <div class="callout-box">
          <strong>Core Architectural Tenet: "The LLM Proposes, the Backend Disposes."</strong><br>
          Generative models are leveraged to adversarially probe and evaluate target systems, but all final risk scores, severity classifications, and policy determinations are strictly calculated by deterministic backend rules in PostgreSQL.
        </div>
      </div>

      <!-- 2. The Problem -->
      <div class="section">
        <div class="section-title">2. The Problem: The Enterprise AI &amp; Agentic Trust Crisis</div>
        <div class="grid-3">
          <div class="card">
            <div class="card-title">Production &amp; Agentic Failure Modes</div>
            <ul>
              <li><strong>Autonomous Tool Misuse:</strong> Destructive SQL, shell escapes, unapproved MCP tool execution, and bypassed Human-in-the-Loop gates.</li>
              <li><strong>Cross-Tenant BOLA / IDOR:</strong> Object-level tenant parameter tampering exposing confidential client data.</li>
              <li><strong>Legal Hallucinations &amp; Bias:</strong> Fictitious statute citations, credential leaks, and demographic friction differentials.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">Regulatory Penalties</div>
            <ul>
              <li><strong>EU AI Act (Reg. 2024/1689):</strong> Mandatory pre-deployment testing and risk management for high-risk AI (fines up to €35M / 7% turnover).</li>
              <li><strong>Statutory Standards:</strong> NIST AI RMF &amp; ISO 42001 continuous empirical verification requirements.</li>
              <li><strong>Legal Ethics:</strong> State Bar rules enforce non-delegable duties of supervision over autonomous legal AI.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">The Post-Consolidation Tooling Void</div>
            <ul>
              <li><strong>Legacy GRC (OneTrust, Vanta):</strong> Passive documentation tracking without live behavioral testing.</li>
              <li><strong>Developer CLI Fuzzers:</strong> Isolated scripts lacking enterprise multi-tenant RBAC and audit vaults.</li>
              <li><strong>Urgent Independence Demand:</strong> OpenAI's acquisition of Promptfoo creates immediate market demand for model-agnostic assurance.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3. Key Capabilities -->
      <div class="section">
        <div class="section-title">3. Key Platform Capabilities (Six Core Modules)</div>
        <div class="grid-2">
          <div class="card">
            <div class="card-title">1. AI &amp; Agentic System Inventory</div>
            <ul>
              <li>Centralized asset registry tracking business/technical owners, versions, deployment tiers, and EU AI Act risk tiers (Minimal, Limited, High, Unacceptable).</li>
              <li>Supports targets: <span class="mono">SYNTHETIC</span>, <span class="mono">EXTERNAL_ENDPOINT</span>, <span class="mono">OPENAI_COMPATIBLE</span>, and <span class="mono">AGENTIC_MCP_ENDPOINT</span>.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">2. 5x5 Quantitative Risk Register</div>
            <ul>
              <li>Mathematical risk calculation: <span class="mono">Inherent = Likelihood × Impact</span>; <span class="mono">Residual = Res. Likelihood × Res. Impact</span>.</li>
              <li>Native PostgreSQL generated columns compute risk scores directly in the database engine, avoiding client calculation drift.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">3. Governance &amp; 5-Framework Library</div>
            <ul>
              <li>Immutable, version-controlled policies with cryptographic SHA-256 hashing.</li>
              <li>Direct control mappings across <strong>NIST AI RMF 1.0</strong>, <strong>EU AI Act</strong> (Arts 9, 13, 14, 50), <strong>ISO/IEC 42001</strong>, <strong>OECD AI</strong>, and <strong>OWASP Agentic Top 10</strong> (ASI-01 to ASI-04).</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">4. Adversarial Red-Team &amp; Agentic Fuzzing Engine</div>
            <ul>
              <li>1 anchor + 4 variants compiled concurrently in &lt;20s across 10 attack categories.</li>
              <li>Model Context Protocol (MCP) tool coercion, SQL/shell injection, and HITL bypass probing.</li>
              <li>Paired differential testing detecting subtle socioeconomic and demographic friction.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">5. Incident Management &amp; Trace Inspector</div>
            <ul>
              <li>1-click promotion of critical findings into tracked incident records with corrective action plans.</li>
              <li>Automated regression retesting loop verifying fixes against original vulnerability vectors.</li>
              <li>Interactive <strong>Visual MCP Tool Call &amp; OpenTelemetry (OTel) Waterfall Inspector</strong>.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">6. Cryptographic Evidence Vault</div>
            <ul>
              <li>Append-only audit trail logging every governance action and test run with SHA-256 hashes.</li>
              <li>Attests both raw model text responses and structured <span class="mono">toolCalls</span> / <span class="mono">otelSpans</span>.</li>
              <li>1-click export of signed PDF, XSS-sanitized interactive HTML, and JSON audit bundles.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>RedTeam AI Labs — Executive Project Summary</span>
      <span>Confidential  |  Page 1 of 2</span>
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div>
      <div class="doc-header">
        <div class="title-area">
          <h1 style="font-size: 15pt;">RedTeam AI Labs</h1>
          <div class="tagline">Technical Architecture, Commercial Model, Roadmap &amp; Validation</div>
        </div>
        <div class="meta-area">
          <strong>Website / Codebase:</strong> github.com/sulisumenpeter/RedTeam-AI-Labs<br>
          <strong>Status:</strong> Upgraded Prototype &amp; Production Verification Complete
        </div>
      </div>

      <!-- 4. Technology & Security -->
      <div class="section">
        <div class="section-title">4. Technical Architecture &amp; Enterprise Security</div>
        <div class="grid-3">
          <div class="card">
            <div class="card-title">Full-Stack Core</div>
            <ul>
              <li><strong>Next.js 14 App Router</strong> with standalone compilation and 20 prerendered static routes.</li>
              <li><strong>Supabase PostgreSQL</strong> with Row Level Security (RLS) &amp; transient retry backoff.</li>
              <li><strong>Parallelized AI Execution:</strong> Concurrent test plan compilation via <span class="mono">Promise.all</span>.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">Dual-Engine AI Pipeline</div>
            <ul>
              <li><strong>Deterministic:</strong> 9 zero-latency heuristic rules catching UPL, eviction advice, leaks, <span class="mono">UNAUTHORIZED_AGENTIC_TOOL_EXECUTION</span>, cross-tenant BOLA, FCRA lending redlining, and clinical triage safety.</li>
              <li><strong>Semantic:</strong> Gemini Pro structured evaluation with 2500ms circuit breaker.</li>
              <li><strong>Severity Mapper:</strong> Deterministic disposal capping proposal signals.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">Hardened AppSec</div>
            <ul>
              <li><strong>Kernel-Level SSRF Guard:</strong> Blocks 127.0.0.1, RFC-1918, metadata (169.254.169.254), decimal IPs, admin ports.</li>
              <li><strong>4-Tier RBAC:</strong> Owner, Admin, Assessor, Viewer roles with strict workspace perimeter isolation.</li>
              <li><strong>Session Shield:</strong> Resilient cookie management under rate limits.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5. Market & Business Model -->
      <div class="section">
        <div class="section-title">5. Market Beachhead &amp; Proposed Commercial Model</div>
        <div class="grid-2">
          <div>
            <p><strong>Initial Beachhead: Legal AI &amp; Legal Tech</strong><br>
            Legal technology is our initial wedge because AI errors create immediate malpractice liability, ethics violations, and statutory exposure (Unauthorized Practice of Law, unlawful evictions). Law firms and legal tech vendors urgently require empirical safety proof before deploying client-facing assistants.</p>
            <p><strong>Expansion Verticals:</strong> Fintech (FCRA/ECOA lending bias), Clinical Healthcare (HIPAA/FDA triage safety), HR Talent Tech (EEOC compliance), and Autonomous Enterprise Agents.</p>
          </div>
          <div>
            <table>
              <tr><th>Tier</th><th>Target Customer</th><th>Indicative Pricing</th></tr>
              <tr><td><strong>Community</strong></td><td>Open-source devs, researchers</td><td>Free (up to 50 runs/mo)</td></tr>
              <tr><td><strong>Professional</strong></td><td>Legal tech startups, boutique firms</td><td>$499 / month</td></tr>
              <tr><td><strong>Enterprise</strong></td><td>Large law firms, corporate legal depts</td><td>$2,500+ / month</td></tr>
              <tr><td><strong>Assessor</strong></td><td>Compliance auditors, consultants</td><td>$999 / seat / mo</td></tr>
            </table>
            <div style="font-size: 6.8pt; color: #64748B; font-style: italic;">*Note: Pricing and tiers are proposed models subject to pilot customer validation.</div>
          </div>
        </div>
      </div>

      <!-- 6. Current Progress & Traction -->
      <div class="section">
        <div class="section-title">6. Current Progress &amp; Empirical Validation</div>
        <div class="grid-4">
          <div class="stat-badge">
            <span class="stat-num">63 / 63</span>
            Unit &amp; Agentic Tests Passing (100%)
          </div>
          <div class="stat-badge">
            <span class="stat-num">15 / 15</span>
            Playwright E2E Tests (100%)
          </div>
          <div class="stat-badge">
            <span class="stat-num">19</span>
            Supabase DB Tables Active
          </div>
          <div class="stat-badge">
            <span class="stat-num">0</span>
            Browser Console / Build Errors
          </div>
        </div>
        <p style="font-size: 8pt; margin-top: 3px;">
          <strong>Verified Quality:</strong> 100% pass rate across 12 unit test suites and 4 Playwright E2E specs; Next.js 14 standalone build optimizes 20 static pages; live AI testing verified with Google Gemini and Model Context Protocol (MCP) telemetry; showcased at the <strong>LexHack Builders Fellowship</strong> evaluation.
        </p>
      </div>

      <!-- 7. Roadmap & The Ask -->
      <div class="section">
        <div class="section-title">7. 3–6 Month Roadmap &amp; Partnership / Funding Request</div>
        <div class="grid-2">
          <div class="card">
            <div class="card-title">3–6 Month Roadmap</div>
            <ul>
              <li><strong>Months 1–2:</strong> AWS Bedrock &amp; Azure AI Foundry adapters; Claude 4/Sonnet, Llama 4, Gemini 2.5 Pro; live MCP server proxy interceptor; GitHub Actions CI/CD runner.</li>
              <li><strong>Months 3–4:</strong> Deploy 3–5 legal tech &amp; fintech design partner pilots; State Bar ethics &amp; OWASP Agentic templates; SOC 2 Type I readiness.</li>
              <li><strong>Months 5–6:</strong> Self-serve Stripe billing, real-time Slack/Teams/PagerDuty webhooks, continuous OTel production trace assurance.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">The Request (Support &amp; Infrastructure)</div>
            <ul>
              <li><strong>Cloud &amp; AI Programs:</strong> AWS Activate credits, Microsoft for Startups Founders Hub (Azure OpenAI), Google for Startups (Vertex AI enterprise tier).</li>
              <li><strong>Model Access Grants:</strong> Developer credits from OpenAI, Anthropic &amp; Google Cloud.</li>
              <li><strong>Design Partnerships:</strong> 3–5 legal tech startups, boutique firms &amp; fintechs.</li>
              <li><strong>Capital Focus:</strong> 45% AI Compute &amp; Cloud; 35% Engineering &amp; AppSec; 20% Pilot Deployment.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 8. Long-Term Vision -->
      <div class="section" style="margin-bottom: 0;">
        <div class="section-title">8. Long-Term Vision</div>
        <p style="font-size: 8pt; margin-bottom: 0;">
          Just as Datadog became the industry standard for cloud observability and Vanta automated SOC 2 compliance, <strong>RedTeam AI Labs</strong> is building the indispensable assurance operating system every enterprise must run before deploying autonomous AI systems and agentic tools into the hands of real users.
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <span>RedTeam AI Labs — Executive Project Summary</span>
      <span>Founder: Sulisumen Peter  •  github.com/sulisumenpeter/RedTeam-AI-Labs</span>
      <span>Confidential  |  Page 2 of 2</span>
    </div>
  </div>

</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await page.evaluateHandle('document.fonts.ready');

  const pdfPath = path.resolve('RedTeam_AI_Labs_Project_Summary.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm',
    }
  });

  console.log(`Project summary PDF saved to ${pdfPath}`);
  await browser.close();
}

generateSummaryPdf().catch(console.error);

