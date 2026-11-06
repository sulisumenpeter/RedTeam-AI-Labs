"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Server,
  AlertTriangle,
  FileText,
  Target,
  Wrench,
  Archive,
  ArrowRight,
  CheckCircle2,
  Lock,
  Scale,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Cpu,
  Layers,
  Database,
  Eye,
  Check,
  AlertCircle,
  FileCheck,
  HelpCircle,
  Users,
  Menu,
  X,
  Terminal,
  Activity,
  ShieldAlert,
  KeyRound,
  Building2,
  Binary,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Does RedTeam AI Labs store or train on our proprietary model data or confidential prompts?",
    answer:
      "No. RedTeam AI Labs enforces a zero-retention policy for model training. External endpoint probing sends inputs directly to your target over TLS with kernel-level SSRF defense. All test evidence is hashed with SHA-256 and stored strictly within your isolated tenant workspace.",
  },
  {
    question: "How is RedTeam AI Labs different from developer CLI tools like Promptfoo, Giskard, or Garak?",
    answer:
      "Developer CLI tools are isolated testing scripts that lack enterprise infrastructure. RedTeam AI Labs is an enterprise governance platform featuring multi-tenant workspace isolation, 4-tier RBAC, relational 5x5 risk registers, incident tracking loops, MCP tool-call telemetry inspection, and cryptographic audit vaults. Furthermore, following OpenAI's acquisition of Promptfoo, RedTeam AI Labs provides critical independent, model-agnostic third-party assurance.",
  },
  {
    question: "How is this different from legacy GRC platforms like OneTrust or Vanta?",
    answer:
      "Traditional GRC platforms are passive checklist repositories—they track policies on paper but have zero capability to execute prompts, inspect model outputs, or trace tool executions. RedTeam AI Labs actively attacks and evaluates live models, converting static policies into empirical evidence of compliance.",
  },
  {
    question: "Can RedTeam AI Labs evaluate closed-source or custom proprietary models?",
    answer:
      "Yes. Through our target adapter architecture, RedTeam AI Labs tests external REST endpoints, OpenAI-compatible APIs, and Model Context Protocol (MCP) endpoints via standard network interfaces. No access to underlying model weights is required.",
  },
  {
    question: "Does running an assessment grant automatic EU AI Act or ISO 42001 certification?",
    answer:
      "No automated tool can grant legal certification. However, RedTeam AI Labs generates the exact empirical risk management evidence, testing logs, and technical documentation required under Articles 9, 13, 14, and 50 of the EU AI Act and ISO/IEC 42001, providing defensible proof for notified bodies, regulators, and insurers.",
  },
  {
    question: "How does the platform evaluate agentic tools and Model Context Protocol (MCP) interactions?",
    answer:
      "Beyond analyzing text output, our engine intercepts structured ToolCallTrace payloads and OpenTelemetry distributed spans. We deterministically inspect tool names, argument parameters, and execution flags to ensure agents do not execute destructive queries, access unauthorized tenant data, or bypass required Human-in-the-Loop approval gates.",
  },
  {
    question: "What deployment options and pricing tiers are available?",
    answer:
      "We offer a free Community pilot tier for researchers and open-source developers, a Professional tier ($499/mo) for legal tech startups, an Enterprise tier ($2,500+/mo) with custom fuzzers and SSO, and specialized Assessor seats ($999/seat/mo) for compliance consultants and law firm innovation groups.",
  },
];

export function LandingPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(Boolean(data.authenticated));
        }
      } catch {
        // Not authenticated
      }
    }
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-500 selection:text-white flex flex-col">
      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-red-500/20 group-hover:bg-red-700 transition-colors">
              🛡️
            </div>
            <div>
              <div className="text-xl font-extrabold text-red-700 tracking-tight flex items-center">
                RedTeam AI <span className="text-red-500 ml-1.5 text-sm font-bold uppercase tracking-wider">Labs</span>
              </div>
              <div className="text-[10px] text-red-600 font-semibold uppercase tracking-widest">
                AI Governance &amp; Assurance
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
            <a href="#what-it-is" className="hover:text-red-600 transition-colors">
              What It Is
            </a>
            <a href="#how-it-works" className="hover:text-red-600 transition-colors">
              How It Works
            </a>
            <a href="#what-we-catch" className="hover:text-red-600 transition-colors">
              What We Catch
            </a>
            <a href="#who-its-for" className="hover:text-red-600 transition-colors">
              Who It&apos;s For
            </a>
            <a href="#faq" className="hover:text-red-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Buttons & Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                href="/overview"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-md shadow-red-600/30 hover:bg-red-700 hover:shadow-lg transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-red-700 hover:text-red-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold shadow-md shadow-red-600/30 hover:bg-red-700 hover:shadow-lg transition-all"
                >
                  <span>Try It Out</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-red-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3 text-sm font-semibold text-slate-800">
              <a
                href="#what-it-is"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                What It Is
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#what-we-catch"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                What We Catch
              </a>
              <a
                href="#who-its-for"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Who It&apos;s For
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Frequently Asked Questions
              </a>
            </nav>

            <div className="pt-3 border-t border-red-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={isAuthenticated ? "/overview" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-600/30 transition-colors"
              >
                {isAuthenticated ? "Go to Dashboard" : "Test Your First AI Assistant"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="main-content" className="flex-1">
        {/* =========================================================================
            HERO SECTION
            ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-red-50 bg-gradient-to-b from-white via-red-50/20 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Regulatory & Standards Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              NIST AI RMF &bull; EU AI Act &bull; ISO 42001 &bull; OWASP Agentic Top 10
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-red-700 tracking-tight leading-[1.15] mb-6">
              The Mandatory Assurance Layer for Autonomous Enterprise AI <br />
              <span className="text-red-600 block text-2xl sm:text-4xl lg:text-5xl mt-3 font-extrabold">
                Make Sure Your AI Doesn&apos;t Go Rogue Before Your Customers Use It
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-700 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              Test, govern, and assure high-liability AI agents before your users and regulators do. Automated adversarial red-teaming, quantitative 5x5 risk scoring, and statutory compliance cross-walking for generative models and MCP-enabled autonomous agents.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href={isAuthenticated ? "/overview" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-base font-bold shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px]"
              >
                <span>{isAuthenticated ? "Open Your Workspace" : "Test Your First AI Assistant"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-white hover:bg-red-50 border-2 border-red-200 text-red-700 text-base font-bold hover:border-red-300 transition-colors min-h-[48px]"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* 3 Core Architecture Reassurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8 border-t border-red-100 text-left">
              <div className="flex items-start space-x-3 p-3.5 bg-white rounded-xl border border-red-100 shadow-xs">
                <Check className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-700 uppercase">100% Verified Testing</div>
                  <div className="text-xs text-slate-600 mt-0.5">63 unit &amp; 15 Playwright E2E tests passing with zero regressions.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 bg-white rounded-xl border border-red-100 shadow-xs">
                <Check className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-700 uppercase">Zero-Retention Privacy</div>
                  <div className="text-xs text-slate-600 mt-0.5">Target credentials encrypted, ephemeral memory, no model retraining.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 bg-white rounded-xl border border-red-100 shadow-xs">
                <Check className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-700 uppercase">Model-Agnostic Assurance</div>
                  <div className="text-xs text-slate-600 mt-0.5">Independent third-party verification for OpenAI, Gemini, Claude &amp; MCP.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: WHAT IT IS (4 CORE VALUE PILLARS)
            ========================================================================= */}
        <section id="what-it-is" className="py-16 md:py-20 bg-white border-b border-red-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">
                Core Architectural Tenets
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight">
                What Exactly Is RedTeam AI Labs?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                RedTeam AI Labs is the <strong>enterprise assurance and risk governance layer</strong> that sits between high-liability AI systems and production deployment. We replace passive compliance checklists with active, empirical fuzzing and deterministic backend verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="p-8 rounded-2xl bg-white border-2 border-red-100 hover:border-red-300 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase tracking-wider">
                    Empirical Testing
                  </span>
                  <h3 className="text-xl font-bold text-red-700 mt-2 mb-3">1. Active Empirical Fuzzing (vs. Static Checklists)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Legacy GRC platforms (OneTrust, Vanta) rely on static paper questionnaires that never execute a single prompt. RedTeam AI Labs actively subjects live models and agents to multi-strategy adversarial attacks, producing empirical, test-backed proof across 10 distinct attack categories.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-red-700 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-red-600" /> Automated generation of 1 anchor + 4 variants in &lt;20s
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-8 rounded-2xl bg-white border-2 border-red-100 hover:border-red-300 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                    <Binary className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                    Zero Evaluator Drift
                  </span>
                  <h3 className="text-xl font-bold text-red-700 mt-2 mb-3">2. The LLM Proposes, the Backend Disposes</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generative models are used to probe and semantically evaluate target systems, but all risk scoring, severity dispositions, and policy gates are strictly executed by deterministic backend rules in PostgreSQL. Zero hallucinated passes. Zero evaluator drift.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-red-700 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-red-600" /> Deterministic severity reconciliation &amp; circuit breakers
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-8 rounded-2xl bg-white border-2 border-red-100 hover:border-red-300 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    OWASP Agentic Top 10
                  </span>
                  <h3 className="text-xl font-bold text-red-700 mt-2 mb-3">3. Agentic Tool-Execution Assurance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Deep inspection of Model Context Protocol (MCP) tool calls, OpenAI-compatible function executions, and OpenTelemetry (OTel) distributed traces to catch unapproved database writes, privilege escalation, cross-tenant BOLA parameters, and bypassed human approval gates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-red-700 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-red-600" /> Runtime inspection of tool names, arguments &amp; execution status
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-8 rounded-2xl bg-white border-2 border-red-100 hover:border-red-300 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                    <Archive className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    Statutory Attestation
                  </span>
                  <h3 className="text-xl font-bold text-red-700 mt-2 mb-3">4. Cryptographic Proof of Governance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Tamper-evident SHA-256 evidence vaults that produce signed PDF reports, XSS-sanitized HTML assurance logs, and complete JSON audit bundles ready for corporate boards, malpractice insurers, and statutory regulators (EU AI Act Arts. 9, 13, 14, 50).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-red-700 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-red-600" /> 1-click regulatory export bundles with SHA-256 hashes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: HOW IT WORKS (4-STEP AGENTIC PIPELINE)
            ========================================================================= */}
        <section id="how-it-works" className="py-16 md:py-20 bg-red-50/40 border-b border-red-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">
                Full Lifecycle Governance
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight">
                How It Works: The 4-Step Agentic Assurance Pipeline
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                From initial asset inventory to cryptographically attested compliance, our automated pipeline evaluates models and autonomous agents against high-liability failure modes in minutes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm shadow-red-600/30">
                    1
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Inventory &amp; Classify</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Register AI and autonomous agent assets with business/technical owners, operational environments (Production, Staging, Pilot), target adapter configurations (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">SYNTHETIC</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">EXTERNAL_ENDPOINT</code>, <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">AGENTIC_MCP_ENDPOINT</code>), and EU AI Act risk tiers (Minimal, Limited, High, Unacceptable).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-600 flex items-center">
                  <Server className="w-3.5 h-3.5 mr-1" /> System Inventory &amp; Adapters
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm shadow-red-600/30">
                    2
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Bind Policies &amp; Cross-Walks</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select immutable, SHA-256 versioned governance requirements mapped directly across 5 statutory frameworks: NIST AI RMF 1.0, EU AI Act (Arts. 9, 13, 14, 50), ISO/IEC 42001:2023, OECD AI Principles, and OWASP Agentic Top 10 (ASI-01 through ASI-04).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-600 flex items-center">
                  <Scale className="w-3.5 h-3.5 mr-1" /> 5 Supported Frameworks
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm shadow-red-600/30">
                    3
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Fuzz &amp; Intercept Agentic Traces</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Parallel compilation generates 1 deterministic anchor + 4 dynamic variants per requirement in &lt;20s. Dual-Engine Pipeline pairs pattern matching with Gemini Pro semantic evaluation under <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">[UNTRUSTED]</code> delimiters while intercepting MCP tool traces and OpenTelemetry spans.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-600 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1" /> Dual-Engine &amp; MCP Traces
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm shadow-red-600/30">
                    4
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Remediate, Audit &amp; Attest</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    1-click promotion of critical and high findings to tracked enterprise incidents with assigned corrective action plans (guardrails, prompt fixes, retraining). Verify fixes via automated regression re-tests and cryptographically attest results in an append-only SHA-256 evidence vault.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-600 flex items-center">
                  <FileCheck className="w-3.5 h-3.5 mr-1" /> Incident Loops &amp; Vaults
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: WHAT WE CATCH (5 CRITICAL VECTORS)
            ========================================================================= */}
        <section id="what-we-catch" className="py-16 md:py-20 bg-white border-b border-red-100 scroll-mt-20">
          <span id="mistakes-we-catch" className="sr-only" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">
                High-Liability Defenses
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight">
                What We Catch: 5 Critical Vulnerability &amp; Risk Vectors
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                When autonomous agents and LLMs fail in high-stakes environments, the fallout includes regulatory sanctions, corporate data breaches, unauthorized financial transactions, and malpractice liability:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category 1 */}
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Vector #1</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">OWASP ASI-01 &amp; ASI-03</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">Autonomous Tool Misuse &amp; Excessive Agency</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Destructive SQL executions (<code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">DROP TABLE</code>, unapproved <code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">DELETE FROM / TRUNCATE</code>), shell command injections (<code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">rm -rf</code>, eval, host filesystem access), and privileged tool execution when Human-in-the-Loop approval gates are bypassed.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-semibold text-red-800">
                  🛡️ Defense: Deep MCP tool inspection, parameter schema validation &amp; mandatory approval gate verification.
                </div>
              </div>

              {/* Category 2 */}
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Vector #2</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">OWASP ASI-02 &amp; ASI-04</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">Cross-Tenant BOLA &amp; Context Injection</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Broken Object Level Authorization (BOLA) where agent tool parameters reference foreign <code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">tenant_id</code> or <code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">workspace_id</code>, plus indirect prompt injection payloads embedded in retrieved RAG context, PDFs, or external database records.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-semibold text-red-800">
                  🛡️ Defense: Parameter-level tenant boundary isolation &amp; delimiter containment evaluation.
                </div>
              </div>

              {/* Category 3 */}
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Vector #3</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">Beachhead Domain</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">Legal AI Malpractice &amp; Compliance Breaches</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Unauthorized Practice of Law (UPL), illegal self-help eviction counsel (changing door locks, cutting power/water), fabricated case law citations (hallucinated judicial precedents), and unlawful omission of mandatory non-lawyer AI disclaimers.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-semibold text-red-800">
                  🛡️ Defense: Deterministic statutory regex matching + legal intake triage behavioral fences.
                </div>
              </div>

              {/* Category 4 */}
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Vector #4</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">OECD &amp; EU AI Act</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">Algorithmic &amp; Socioeconomic Bias</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Paired differential testing exposing unequal documentation hurdles imposed on low-income prompt variants vs. wealthy users, alongside Fintech Fair Credit Reporting Act (FCRA) and ECOA credit redlining (disqualifying zip codes or demographic proxies).
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-semibold text-red-800">
                  🛡️ Defense: Automated paired demographic fuzzing &amp; disparate impact friction measurement.
                </div>
              </div>

              {/* Category 5 */}
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">Vector #5</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">Infra Defense</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">Security &amp; Infrastructure Leakage</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Direct prompt injection hijacking, system instruction extraction attacks, and accidental leakage of internal routing keys, service role tokens, database credentials, or internal cloud metadata IP addresses (<code className="font-mono bg-white px-1 py-0.5 rounded text-[11px]">169.254.169.254</code>).
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-semibold text-red-800">
                  🛡️ Defense: Kernel-level SSRF guard, port blocklists, and automated secret pattern matchers.
                </div>
              </div>

              {/* Bonus Assurance Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Assurance Engine</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Dual-Engine</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Dual-Engine Severity Mapper</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    High-speed regex heuristics fire instantly on exact pattern breaches. When edge cases require semantic nuance, Gemini Pro proposals are verified and reconciled against quantitative 5x5 Likelihood &times; Impact tables in PostgreSQL.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700 text-xs font-semibold text-teal-300">
                  ⚡ 2500ms semantic circuit breaker with offline fallback guarantee.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WHO IT'S FOR (4 ENTERPRISE PERSONAS)
            ========================================================================= */}
        <section id="who-its-for" className="py-16 md:py-20 bg-red-50/50 border-b border-red-100 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">
                Tailored Enterprise Solutions
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight">
                Who Uses RedTeam AI Labs?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
                Engineered for enterprise cross-functional risk, legal, and engineering leaders deploying high-consequence AI systems:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Persona 1 */}
              <div className="bg-white p-7 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4 shadow-xs">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Legal Tech Startups &amp; Law Firms</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ensure legal intake triage bots and contract assistants never give unauthorized legal advice, commit malpractice, or violate state bar supervisory rules. Deliver signed PDF audit trails to managing partners and malpractice insurers.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-700">
                  &bull; UPL &amp; Eviction Guardrails
                </div>
              </div>

              {/* Persona 2 */}
              <div className="bg-white p-7 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4 shadow-xs">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Autonomous Agent &amp; MCP Developers</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verify multi-step agents before giving them access to production databases, APIs, and tools. Catch tool-parameter poisoning and excessive agency in automated CI/CD pipelines with OpenTelemetry trace inspection.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-700">
                  &bull; MCP &amp; OTel Trace Inspection
                </div>
              </div>

              {/* Persona 3 */}
              <div className="bg-white p-7 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Regulated Enterprise AI Teams</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Comply with EU AI Act mandatory pre-deployment testing (penalties up to &euro;35M / 7%), NIST AI RMF continuous governance, and EEOC/FCRA anti-bias requirements using mathematical 5x5 risk registers.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-700">
                  &bull; Fintech, Healthcare &amp; HR
                </div>
              </div>

              {/* Persona 4 */}
              <div className="bg-white p-7 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold mb-4 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-red-700 mb-2">Assurance Assessors &amp; Auditors</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Replace static spreadsheets with empirical model testing. Manage multiple client audits using workspace isolation, 4-tier RBAC (<code className="font-mono text-[10px]">OWNER</code>, <code className="font-mono text-[10px]">ADMIN</code>, <code className="font-mono text-[10px]">ASSESSOR</code>, <code className="font-mono text-[10px]">VIEWER</code>), and white-labeled cryptographic export packs.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-red-700">
                  &bull; Multi-Tenant Audit Vaults
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS (ACCESSIBLE ACCORDION)
            ========================================================================= */}
        <section id="faq" className="py-16 md:py-20 bg-white border-b border-red-100 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-extrabold text-red-600 uppercase tracking-widest mb-3">
                Due Diligence &amp; Compliance FAQ
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-3">
                Authoritative answers regarding our zero-retention privacy model, agentic MCP inspection, regulatory mapping, and independent architecture:
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="group bg-white border border-red-100 rounded-2xl p-6 transition-all duration-200 hover:border-red-300 shadow-xs open:shadow-sm"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                    <span>{item.question}</span>
                    <span className="ml-4 shrink-0 p-1 rounded-full text-slate-400 group-hover:text-red-600 transition-transform duration-200 group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="mt-4 pt-3 border-t border-red-50 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            CALL TO ACTION BANNER
            ========================================================================= */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-14 rounded-3xl bg-red-600 text-white shadow-2xl shadow-red-600/30">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Assure Your AI in Less Than 2 Minutes
              </h2>
              <p className="text-sm sm:text-lg text-red-100 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                Explore our pre-configured Synthetic Legal Intake Assistant or connect your own external endpoint. Watch live adversarial attacks compile in &lt;20s, inspect intercepted MCP tool traces, and export cryptographic compliance certificates.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={isAuthenticated ? "/overview" : "/login"}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-red-700 hover:bg-red-50 text-sm font-bold shadow-lg hover:scale-[1.02] transition-all min-h-[48px] flex items-center justify-center"
                >
                  <span>{isAuthenticated ? "Open Your Workspace" : "Test Your First AI Assistant"}</span>
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white border border-red-500 text-sm font-bold transition-colors min-h-[48px] flex items-center justify-center"
                >
                  <span>Create an Account</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="bg-white border-t border-red-100 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-red-600 text-white flex items-center justify-center text-xs font-bold">
              🛡️
            </div>
            <span className="font-extrabold text-red-700">RedTeam AI Labs</span>
            <span className="text-slate-400">&bull; The Mandatory Assurance Layer for Autonomous Enterprise AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
            <Link href="/overview" className="hover:text-red-700 transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-red-700 transition-colors">
              Sign In
            </Link>
            <a href="#what-it-is" className="hover:text-red-700 transition-colors">
              What It Is
            </a>
            <a href="#how-it-works" className="hover:text-red-700 transition-colors">
              How It Works
            </a>
            <a href="#what-we-catch" className="hover:text-red-700 transition-colors">
              What We Catch
            </a>
            <a href="#who-its-for" className="hover:text-red-700 transition-colors">
              Who It&apos;s For
            </a>
            <a href="#faq" className="hover:text-red-700 transition-colors">
              FAQ
            </a>
          </div>

          <p className="text-slate-400 font-mono text-[11px]">
            RedTeam AI Labs &bull; Enterprise AI Governance &amp; Risk Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
