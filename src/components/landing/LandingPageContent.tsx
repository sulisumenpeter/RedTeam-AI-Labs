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
  Zap,
} from "lucide-react";
import { AgenticArchitectureVisual } from "../visuals/AgenticArchitectureVisual";
import { RiskHeatmapVisual } from "../visuals/RiskHeatmapVisual";
import { ThreatMatrixVisual } from "../visuals/ThreatMatrixVisual";
import { FrameworkRadarVisual } from "../visuals/FrameworkRadarVisual";

const FAQ_ITEMS = [
  {
    question: "Does RedTeam AI Labs store or train on our proprietary model data or confidential prompts?",
    answer:
      "No. RedTeam AI Labs enforces a strict zero-retention policy for model training. External endpoint probing sends inputs directly to your target over TLS with kernel-level SSRF defense. All test evidence is hashed with SHA-256 and stored strictly within your isolated tenant workspace.",
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
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-crimson-600 selection:text-white flex flex-col font-sans ambient-mesh">
      {/* =========================================================================
          TOP NAVIGATION BAR
          ========================================================================= */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-crimson-600/30 ring-1 ring-white/20 group-hover:scale-105 transition-all">
              🛡️
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-tight flex items-center">
                RedTeam AI{" "}
                <span className="text-crimson-400 ml-1.5 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-crimson-500/10 border border-crimson-500/20">
                  Labs
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Enterprise AI Governance &amp; Assurance
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <a href="#what-it-is" className="hover:text-white transition-colors">
              What It Is
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#what-we-catch" className="hover:text-white transition-colors">
              What We Catch
            </a>
            <a href="#who-its-for" className="hover:text-white transition-colors">
              Who It&apos;s For
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* CTA Buttons & Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                href="/overview"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-crimson-600/30 hover:brightness-110 transition-all border border-crimson-400/30"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-crimson-600/30 hover:brightness-110 transition-all border border-crimson-400/30"
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
              className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-crimson-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2 text-sm font-semibold text-slate-200">
              <a
                href="#what-it-is"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                What It Is
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#what-we-catch"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                What We Catch
              </a>
              <a
                href="#who-its-for"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                Who It&apos;s For
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                Frequently Asked Questions
              </a>
            </nav>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-slate-200 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                Sign In
              </Link>
              <Link
                href={isAuthenticated ? "/overview" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 rounded-xl hover:brightness-110 shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
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
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Regulatory & Standards Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-crimson-500 animate-pulse" />
              NIST AI RMF &bull; EU AI Act &bull; ISO 42001 &bull; OECD AI &bull; OWASP Agentic Top 10
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
              The Mandatory Assurance Layer for Autonomous Enterprise AI <br />
              <span className="bg-gradient-to-r from-crimson-400 via-rose-400 to-teal-300 bg-clip-text text-transparent block text-2xl sm:text-4xl lg:text-5xl mt-3 font-extrabold">
                Make Sure Your AI Doesn&apos;t Go Rogue Before Your Customers Use It
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 font-normal max-w-3xl mx-auto mb-10 leading-relaxed">
              Test, govern, and assure high-liability AI agents before your users and regulators do. Automated adversarial red-teaming, quantitative 5x5 risk scoring, and statutory compliance cross-walking for generative models and MCP-enabled autonomous agents.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                href={isAuthenticated ? "/overview" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white text-base font-bold shadow-xl shadow-crimson-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px] border border-crimson-400/40"
              >
                <span>{isAuthenticated ? "Open Your Workspace" : "Test Your First AI Assistant"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl glass-panel hover:bg-white/10 border border-white/20 text-slate-200 hover:text-white text-base font-bold transition-all min-h-[48px]"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* 3 Core Architecture Reassurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left">
              <div className="flex items-start space-x-3 p-4 glass-panel rounded-xl border border-white/10">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">100% Verified Testing</div>
                  <div className="text-xs text-slate-400 mt-0.5">63 unit &amp; 15 Playwright E2E tests passing with zero regressions.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 glass-panel rounded-xl border border-white/10">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Zero-Retention Privacy</div>
                  <div className="text-xs text-slate-400 mt-0.5">Target credentials encrypted, ephemeral memory, no model retraining.</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 glass-panel rounded-xl border border-white/10">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Model-Agnostic Assurance</div>
                  <div className="text-xs text-slate-400 mt-0.5">Independent third-party verification for OpenAI, Gemini, Claude &amp; MCP.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: WHAT IT IS (4 CORE VALUE PILLARS & ARCHITECTURE VISUAL)
            ========================================================================= */}
        <section id="what-it-is" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-crimson-400 uppercase tracking-widest mb-3">
                Core Architectural Tenets
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                What Exactly Is RedTeam AI Labs?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                RedTeam AI Labs is the <strong>enterprise assurance and risk governance layer</strong> that sits between high-liability AI systems and production deployment. We replace passive compliance checklists with active, empirical fuzzing and deterministic backend verification.
              </p>
            </div>

            {/* Embedded Interactive Architecture Pipeline */}
            <div className="mb-16">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Interactive Architecture Explorer</span>
                  <h3 className="text-lg font-bold text-white">5-Stage Agentic Assurance Engine Pipeline</h3>
                </div>
                <span className="text-xs text-slate-400">Click any stage to inspect payload mechanics &amp; telemetry</span>
              </div>
              <AgenticArchitectureVisual />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pillar 1 */}
              <div className="p-8 rounded-2xl glass-panel-elevated border border-white/10 hover:border-crimson-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-crimson-500/20 text-crimson-300 border border-crimson-500/30 uppercase tracking-wider">
                    Empirical Testing
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">1. Active Empirical Fuzzing (vs. Static Checklists)</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Legacy GRC platforms (OneTrust, Vanta) rely on static paper questionnaires that never execute a single prompt. RedTeam AI Labs actively subjects live models and agents to multi-strategy adversarial attacks, producing empirical, test-backed proof across 10 distinct attack categories.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-crimson-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-400" /> Automated generation of 1 anchor + 4 variants in &lt;20s
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-8 rounded-2xl glass-panel-elevated border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Binary className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    Zero Evaluator Drift
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">2. The LLM Proposes, the Backend Disposes</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Generative models are used to probe and semantically evaluate target systems, but all risk scoring, severity dispositions, and policy gates are strictly executed by deterministic backend rules in PostgreSQL. Zero hallucinated passes. Zero evaluator drift.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-amber-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-400" /> Deterministic severity reconciliation &amp; circuit breakers
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-8 rounded-2xl glass-panel-elevated border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
                    OWASP Agentic Top 10
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">3. Agentic Tool-Execution Assurance</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Deep inspection of Model Context Protocol (MCP) tool calls, OpenAI-compatible function executions, and OpenTelemetry (OTel) distributed traces to catch unapproved database writes, privilege escalation, cross-tenant BOLA parameters, and bypassed human approval gates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-teal-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-400" /> Runtime inspection of tool names, arguments &amp; execution status
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-8 rounded-2xl glass-panel-elevated border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Archive className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    Statutory Attestation
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-3">4. Cryptographic Proof of Governance</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Tamper-evident SHA-256 evidence vaults that produce signed PDF reports, XSS-sanitized HTML assurance logs, and complete JSON audit bundles ready for corporate boards, malpractice insurers, and statutory regulators (EU AI Act Arts. 9, 13, 14, 50).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-indigo-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-400" /> 1-click regulatory export bundles with SHA-256 hashes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: HOW IT WORKS (4-STEP PIPELINE & RISK MATRIX)
            ========================================================================= */}
        <section id="how-it-works" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-teal-400 uppercase tracking-widest mb-3">
                Full Lifecycle Governance
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                How It Works: The 4-Step Agentic Assurance Pipeline
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                From initial asset inventory to cryptographically attested compliance, our automated pipeline evaluates models and autonomous agents against high-liability failure modes in minutes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Step 1 */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-crimson-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-crimson-600/30">
                    1
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Inventory &amp; Classify</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Register AI and autonomous agent assets with business/technical owners, operational environments (Production, Staging, Pilot), target adapter configurations (<code className="text-[10px] bg-white/10 px-1 py-0.5 rounded font-mono text-crimson-300">SYNTHETIC</code>, <code className="text-[10px] bg-white/10 px-1 py-0.5 rounded font-mono text-crimson-300">EXTERNAL_ENDPOINT</code>, <code className="text-[10px] bg-white/10 px-1 py-0.5 rounded font-mono text-crimson-300">AGENTIC_MCP_ENDPOINT</code>), and EU AI Act risk tiers (Minimal, Limited, High, Unacceptable).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-slate-400 flex items-center">
                  <Server className="w-3.5 h-3.5 mr-1 text-crimson-400" /> System Inventory &amp; Adapters
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-amber-600/30">
                    2
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Bind Policies &amp; Cross-Walks</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Select immutable, SHA-256 versioned governance requirements mapped directly across 5 statutory frameworks: NIST AI RMF 1.0, EU AI Act (Arts. 9, 13, 14, 50), ISO/IEC 42001:2023, OECD AI Principles, and OWASP Agentic Top 10 (ASI-01 through ASI-04).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-slate-400 flex items-center">
                  <Scale className="w-3.5 h-3.5 mr-1 text-amber-400" /> 5 Supported Frameworks
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-teal-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-teal-600/30">
                    3
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Fuzz &amp; Intercept Agentic Traces</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Parallel compilation generates 1 deterministic anchor + 4 dynamic variants per requirement in &lt;20s. Dual-Engine Pipeline pairs pattern matching with Gemini Pro semantic evaluation under <code className="text-[10px] bg-white/10 px-1 py-0.5 rounded font-mono text-teal-300">[UNTRUSTED]</code> delimiters while intercepting MCP tool traces and OpenTelemetry spans.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-slate-400 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1 text-teal-400" /> Dual-Engine &amp; MCP Traces
                </div>
              </div>

              {/* Step 4 */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
                    4
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Remediate, Audit &amp; Attest</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1-click promotion of critical and high findings to tracked enterprise incidents with assigned corrective action plans (guardrails, prompt fixes, retraining). Verify fixes via automated regression re-tests and cryptographically attest results in an append-only SHA-256 evidence vault.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-semibold text-slate-400 flex items-center">
                  <FileCheck className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Incident Loops &amp; Vaults
                </div>
              </div>
            </div>

            {/* Embedded Risk Matrix Showcase */}
            <div className="pt-8 border-t border-white/10">
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Quantitative Risk Intelligence</span>
                  <h3 className="text-xl font-bold text-white mt-1">Interactive 5&times;5 Likelihood &times; Impact Risk Matrix</h3>
                  <p className="text-xs text-slate-300 mt-1">Toggle between Inherent (unmitigated) and Residual (post-guardrail) risk to observe risk exposure delta</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> PostgreSQL Generated Columns: <code className="text-teal-300 font-mono">inherent_score = L * I</code>
                </div>
              </div>
              <RiskHeatmapVisual />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: WHAT WE CATCH (5 CRITICAL VECTORS & THREAT MATRIX)
            ========================================================================= */}
        <section id="what-we-catch" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <span id="mistakes-we-catch" className="sr-only" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-crimson-400 uppercase tracking-widest mb-3">
                High-Liability Defenses
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                What We Catch: 5 Critical Vulnerability &amp; Risk Vectors
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                When autonomous agents and LLMs fail in high-stakes environments, the fallout includes regulatory sanctions, corporate data breaches, unauthorized financial transactions, and malpractice liability:
              </p>
            </div>

            {/* Interactive Threat Matrix Visual */}
            <div className="mb-16">
              <ThreatMatrixVisual />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category 1 */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-crimson-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-crimson-400 uppercase tracking-wider">Vector #1</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">OWASP ASI-01 &amp; ASI-03</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Autonomous Tool Misuse &amp; Excessive Agency</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Destructive SQL executions (<code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-crimson-300">DROP TABLE</code>, unapproved <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-crimson-300">DELETE FROM / TRUNCATE</code>), shell command injections (<code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-crimson-300">rm -rf</code>, eval, host filesystem access), and privileged tool execution when Human-in-the-Loop approval gates are bypassed.
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-200">
                  🛡️ Defense: Deep MCP tool inspection, parameter schema validation &amp; mandatory approval gate verification.
                </div>
              </div>

              {/* Category 2 */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Vector #2</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">OWASP ASI-02 &amp; ASI-04</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cross-Tenant BOLA &amp; Context Injection</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Broken Object Level Authorization (BOLA) where agent tool parameters reference foreign <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-amber-300">tenant_id</code> or <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-amber-300">workspace_id</code>, plus indirect prompt injection payloads embedded in retrieved RAG context, PDFs, or external database records.
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-200">
                  🛡️ Defense: Parameter-level tenant boundary isolation &amp; delimiter containment evaluation.
                </div>
              </div>

              {/* Category 3 */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-rose-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">Vector #3</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Beachhead Domain</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Legal AI Malpractice &amp; Compliance Breaches</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Unauthorized Practice of Law (UPL), illegal self-help eviction counsel (changing door locks, cutting power/water), fabricated case law citations (hallucinated judicial precedents), and unlawful omission of mandatory non-lawyer AI disclaimers.
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-200">
                  🛡️ Defense: Deterministic statutory regex matching + legal intake triage behavioral fences.
                </div>
              </div>

              {/* Category 4 */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-teal-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Vector #4</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">OECD &amp; EU AI Act</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Algorithmic &amp; Socioeconomic Bias</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Paired differential testing exposing unequal documentation hurdles imposed on low-income prompt variants vs. wealthy users, alongside Fintech Fair Credit Reporting Act (FCRA) and ECOA credit redlining (disqualifying zip codes or demographic proxies).
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-200">
                  🛡️ Defense: Automated paired demographic fuzzing &amp; disparate impact friction measurement.
                </div>
              </div>

              {/* Category 5 */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Vector #5</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Infra Defense</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Security &amp; Infrastructure Leakage</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Direct prompt injection hijacking, system instruction extraction attacks, and accidental leakage of internal routing keys, service role tokens, database credentials, or internal cloud metadata IP addresses (<code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px] text-purple-300">169.254.169.254</code>).
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-medium text-slate-200">
                  🛡️ Defense: Kernel-level SSRF guard, port blocklists, and automated secret pattern matchers.
                </div>
              </div>

              {/* Bonus Assurance Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-obsidian-950 border border-white/15 text-white flex flex-col justify-between shadow-xl">
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
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs font-semibold text-teal-300 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-teal-400 shrink-0" />
                  2500ms semantic circuit breaker with offline fallback guarantee.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WHO IT'S FOR (4 ENTERPRISE PERSONAS & FRAMEWORK RADAR)
            ========================================================================= */}
        <section id="who-its-for" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-extrabold text-teal-400 uppercase tracking-widest mb-3">
                Tailored Enterprise Solutions
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Who Uses RedTeam AI Labs?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Engineered for enterprise cross-functional risk, legal, and engineering leaders deploying high-consequence AI systems:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Persona 1 */}
              <div className="glass-panel p-7 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-crimson-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 flex items-center justify-center font-bold mb-4 shadow-sm">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Legal Tech Startups &amp; Law Firms</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ensure legal intake triage bots and contract assistants never give unauthorized legal advice, commit malpractice, or violate state bar supervisory rules. Deliver signed PDF audit trails to managing partners and malpractice insurers.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-semibold text-crimson-400">
                  &bull; UPL &amp; Eviction Guardrails
                </div>
              </div>

              {/* Persona 2 */}
              <div className="glass-panel p-7 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-teal-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold mb-4 shadow-sm">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Autonomous Agent &amp; MCP Developers</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Verify multi-step agents before giving them access to production databases, APIs, and tools. Catch tool-parameter poisoning and excessive agency in automated CI/CD pipelines with OpenTelemetry trace inspection.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-semibold text-teal-400">
                  &bull; MCP &amp; OTel Trace Inspection
                </div>
              </div>

              {/* Persona 3 */}
              <div className="glass-panel p-7 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold mb-4 shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Regulated Enterprise AI Teams</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Comply with EU AI Act mandatory pre-deployment testing (penalties up to &euro;35M / 7%), NIST AI RMF continuous governance, and EEOC/FCRA anti-bias requirements using mathematical 5x5 risk registers.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-semibold text-amber-400">
                  &bull; Fintech, Healthcare &amp; HR
                </div>
              </div>

              {/* Persona 4 */}
              <div className="glass-panel p-7 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold mb-4 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Assurance Assessors &amp; Auditors</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Replace static spreadsheets with empirical model testing. Manage multiple client audits using workspace isolation, 4-tier RBAC (<code className="font-mono text-[10px] text-indigo-300">OWNER</code>, <code className="font-mono text-[10px] text-indigo-300">ADMIN</code>, <code className="font-mono text-[10px] text-indigo-300">ASSESSOR</code>, <code className="font-mono text-[10px] text-indigo-300">VIEWER</code>), and white-labeled cryptographic export packs.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] font-semibold text-indigo-400">
                  &bull; Multi-Tenant Audit Vaults
                </div>
              </div>
            </div>

            {/* Embedded Multi-Framework Radar */}
            <div className="pt-8 border-t border-white/10">
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-crimson-400 uppercase tracking-wider">Statutory Harmonization</span>
                  <h3 className="text-xl font-bold text-white mt-1">Unified Multi-Framework Compliance Cross-Walk</h3>
                  <p className="text-xs text-slate-300 mt-1">Cross-map empirical test runs across 5 leading global AI standards and statutory regulations</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span> 16 Harmonized Governance Controls
                </div>
              </div>
              <FrameworkRadarVisual />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS (ACCESSIBLE ACCORDION)
            ========================================================================= */}
        <section id="faq" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-extrabold text-crimson-400 uppercase tracking-widest mb-3">
                Due Diligence &amp; Compliance FAQ
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3">
                Authoritative answers regarding our zero-retention privacy model, agentic MCP inspection, regulatory mapping, and independent architecture:
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="group glass-panel border border-white/10 rounded-2xl p-6 transition-all duration-200 hover:border-crimson-500/30 open:border-crimson-500/40 open:bg-slate-900/80"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-base font-bold text-white group-hover:text-crimson-300 transition-colors">
                    <span>{item.question}</span>
                    <span className="ml-4 shrink-0 p-1.5 rounded-full text-slate-400 group-hover:text-crimson-400 group-hover:bg-white/5 transition-transform duration-200 group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
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
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-crimson-900/80 via-slate-900/90 to-obsidian-950 border border-crimson-500/40 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40"></div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
                  Assure Your AI in Less Than 2 Minutes
                </h2>
                <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
                  Explore our pre-configured Synthetic Legal Intake Assistant or connect your own external endpoint. Watch live adversarial attacks compile in &lt;20s, inspect intercepted MCP tool traces, and export cryptographic compliance certificates.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={isAuthenticated ? "/overview" : "/login"}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-crimson-600/30 transition-all min-h-[48px] flex items-center justify-center border border-crimson-400/40 hover:scale-[1.02]"
                  >
                    <span>{isAuthenticated ? "Open Your Workspace" : "Test Your First AI Assistant"}</span>
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white border border-white/20 text-sm font-bold transition-all min-h-[48px] flex items-center justify-center"
                  >
                    <span>Create an Account</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="glass-panel border-t border-white/10 py-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-crimson-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              🛡️
            </div>
            <span className="font-extrabold text-white">RedTeam AI Labs</span>
            <span className="text-slate-500">&bull; The Mandatory Assurance Layer for Autonomous Enterprise AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-300">
            <Link href="/overview" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <a href="#what-it-is" className="hover:text-white transition-colors">
              What It Is
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#what-we-catch" className="hover:text-white transition-colors">
              What We Catch
            </a>
            <a href="#who-its-for" className="hover:text-white transition-colors">
              Who It&apos;s For
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <p className="text-slate-500 font-mono text-[11px]">
            RedTeam AI Labs &bull; Enterprise AI Governance &amp; Risk Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
