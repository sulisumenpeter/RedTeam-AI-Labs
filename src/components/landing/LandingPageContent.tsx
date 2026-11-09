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
import { SiteFooter } from "../layout/SiteFooter";

const FAQ_ITEMS = [
  {
    question: "What is the current stage of RedTeam AI Labs?",
    answer:
      "RedTeam AI Labs is currently an active architectural Proof-of-Concept (PoC) and technical preview developed by Lisumen Innovative Hub. We are currently demonstrating our core deterministic Dual-Engine Evaluator and MCP interception pipeline to pre-seed investors, grant committees, and select engineering design partners ahead of commercial scale.",
  },
  {
    question: "Does RedTeam AI Labs store or train on proprietary model data or confidential prompts?",
    answer:
      "No. The architecture enforces a strict zero-retention design for model training. During this PoC preview, we recommend testing with our pre-configured Synthetic Legal Intake Assistant or non-sensitive staging endpoints. All test evidence in the sandbox is hashed with SHA-256 inside isolated workspace tables.",
  },
  {
    question: "How is RedTeam AI Labs different from developer CLI tools like Promptfoo, Giskard, or Garak?",
    answer:
      "CLI tools are great for local prompt testing, but enterprises need continuous runtime governance. RedTeam AI Labs is architected as a full-stack assurance layer combining multi-tenant workspace isolation, relational 5x5 risk registers, MCP tool-call telemetry inspection, and deterministic PostgreSQL disposition ('The LLM Proposes, the Backend Disposes') for independent, model-agnostic verification.",
  },
  {
    question: "How is this different from legacy GRC platforms like OneTrust or Vanta?",
    answer:
      "Traditional GRC platforms are passive checklist repositories—they track policies on paper but have zero capability to execute prompts, inspect model outputs, or trace tool executions. This prototype actively attacks and evaluates live models, converting static policies into empirical evidence of compliance.",
  },
  {
    question: "Can RedTeam AI Labs evaluate closed-source or custom proprietary models?",
    answer:
      "Yes. Through our target adapter architecture, RedTeam AI Labs tests external REST endpoints, OpenAI-compatible APIs, and Model Context Protocol (MCP) endpoints via standard network interfaces. No access to underlying model weights is required.",
  },
  {
    question: "Does running an assessment grant automatic EU AI Act or ISO 42001 certification?",
    answer:
      "No software tool grants automatic legal certification. This prototype demonstrates how automated red-teaming and runtime MCP trace capture can systematically generate the empirical risk management logs required under Articles 9, 13, 14, and 50 of the EU AI Act and ISO/IEC 42001.",
  },
  {
    question: "How does the platform evaluate agentic tools and Model Context Protocol (MCP) interactions?",
    answer:
      "Beyond analyzing text output, our engine intercepts structured ToolCallTrace payloads and OpenTelemetry distributed spans. We deterministically inspect tool names, argument parameters, and execution flags to ensure agents do not execute destructive queries, access unauthorized tenant data, or bypass required Human-in-the-Loop approval gates.",
  },
  {
    question: "How can teams, design partners, or grant evaluators access the platform?",
    answer:
      "The platform is currently accessible as an open technical sandbox preview. Pre-seed investors, grant evaluators, and engineering design partners can evaluate the live reference architecture or get in touch with Lisumen Innovative Hub to participate in our early pilot cohort.",
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
              <div className="text-xl font-black text-white tracking-tight">
                RedTeam AI Labs
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                Agentic Assurance PoC &bull; Technical Preview
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
                  Sandbox Login
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-crimson-600/30 hover:brightness-110 transition-all border border-crimson-400/30"
                >
                  <span>Launch PoC Sandbox</span>
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
                Sandbox Login
              </Link>
              <Link
                href={isAuthenticated ? "/overview" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 rounded-xl hover:brightness-110 shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
              >
                {isAuthenticated ? "Go to Dashboard" : "Explore the Interactive Sandbox"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="main-content" className="flex-1">
        {/* =========================================================================
            PROPER EDITORIAL HERO SECTION (SPLIT-LAYOUT WITH ORIGINAL ARTWORK)
            ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline, Narrative & CTAs */}
              <div className="lg:col-span-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono font-bold mb-4">
                  <span>ARCHITECTURAL PROOF OF CONCEPT &bull; DESIGN PARTNER PREVIEW</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
                  Make Sure Your AI Doesn&apos;t Go Rogue Before It Hits Production.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
                  An interactive reference architecture and runtime assurance prototype for LLMs and MCP-enabled autonomous agents. Built to demonstrate deterministic adversarial fuzzing, tool-call interception, and 5&times;5 quantitative risk scoring.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                  <Link
                    href={isAuthenticated ? "/overview" : "/login"}
                    className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white text-sm font-bold shadow-xl shadow-crimson-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px] border border-crimson-400/40"
                  >
                    <span>{isAuthenticated ? "Open Your Workspace" : "Explore the Interactive Sandbox"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl glass-panel hover:bg-white/10 border border-white/20 text-slate-200 hover:text-white text-sm font-bold transition-all min-h-[48px]"
                  >
                    <span>Inspect the Architecture</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Grounded Assurance Tenets */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300">
                  <div>
                    <div className="text-white font-bold text-sm">63 Tests</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Baseline regression suite</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Zero Drift</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Deterministic PostgreSQL engine</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">MCP Ready</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Tool &amp; trace interception PoC</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Hero Visual Asset */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden glass-panel-elevated border border-white/15 shadow-2xl group">
                  {/* Real Generated Editorial Hero Image */}
                  <img
                    src="/images/hero-assurance.jpg"
                    alt="AI Governance and Assurance specialist analyzing autonomous agent tool-execution paths and compliance controls"
                    className="w-full h-auto object-cover max-h-[520px] transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                  
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Integrated Live Telemetry Glass Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass-panel-elevated rounded-xl border border-white/15 flex items-center justify-between text-xs backdrop-blur-md shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <div>
                        <div className="text-white font-bold">Autonomous Agent Telemetry Active</div>
                        <div className="text-slate-400 text-[11px]">Runtime MCP Tool Inspection &bull; HITL Enforced</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-400 font-mono font-bold text-xs">EU AI ACT &bull; NIST</div>
                      <div className="text-slate-400 text-[10px]">Harmonized Controls</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: WHAT IT IS (INTERACTIVE ARCHITECTURE VISUAL & 4 PILLARS)
            ========================================================================= */}
        <section id="what-it-is" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Empirical Assurance, Not Paper Checklists
              </h2>
              <p className="text-base text-slate-300 mt-3 leading-relaxed">
                Legacy GRC tools rely on passive questionnaires that never fire a prompt. This proof-of-concept demonstrates how deterministic backend rules and runtime MCP interception can actively block rogue agent actions and generate verifiable safety telemetry.
              </p>
            </div>

            {/* Embedded Interactive Architecture Pipeline */}
            <div className="mb-14">
              <AgenticArchitectureVisual />
            </div>

            {/* 4 Core Value Pillars (Concise & Human) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Active Empirical Fuzzing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automated parallel compilation generates 1 anchor and 4 dynamic variants per requirement in under 20 seconds across 10 failure categories.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Binary className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">The LLM Proposes, the Backend Disposes</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generative models probe targets, but risk dispositions are strictly executed by deterministic rules in PostgreSQL. Zero hallucinated passes.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Agentic Tool Assurance</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Runtime inspection of Model Context Protocol (MCP) calls, argument boundaries, and OpenTelemetry spans to prevent unauthorized actions.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Archive className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Cryptographic Proof</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tamper-evident SHA-256 evidence vaults generating signed PDF, HTML, and JSON audit bundles for insurers and statutory regulators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: HOW IT WORKS & ACTUAL PRODUCT INTERFACE SHOWCASE
            ========================================================================= */}
        <section id="how-it-works" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                How It Works: Continuous Governance Lifecycle
              </h2>
              <p className="text-base text-slate-300 mt-3 leading-relaxed">
                A streamlined 4-step workflow that transforms high-level risk policies into empirical tests and verifiable remediation.
              </p>
            </div>

            {/* 4 Lifecycle Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-teal-400 font-mono text-xs font-bold">STEP 01</div>
                <h3 className="text-sm font-bold text-white">Inventory &amp; Adapters</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Register models and autonomous agents with assigned owners and connection protocols (MCP, REST, Synthetic).
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-amber-400 font-mono text-xs font-bold">STEP 02</div>
                <h3 className="text-sm font-bold text-white">Policy &amp; Frameworks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bind immutable behavioral rules cross-walked to NIST, EU AI Act, ISO 42001, and OWASP Agentic Top 10.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-crimson-400 font-mono text-xs font-bold">STEP 03</div>
                <h3 className="text-sm font-bold text-white">Fuzz &amp; Intercept</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Execute multi-turn adversarial attacks while intercepting structured tool calls and OpenTelemetry distributed spans.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-indigo-400 font-mono text-xs font-bold">STEP 04</div>
                <h3 className="text-sm font-bold text-white">Remediate &amp; Attest</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Track findings into incidents, execute regression retests, and lock cryptographic evidence in an immutable vault.
                </p>
              </div>
            </div>

            {/* Embedded Quantitative Risk Heatmap */}
            <div className="mt-14 pt-10 border-t border-white/10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Quantitative 5&times;5 Risk Scoring</h3>
                <p className="text-xs text-slate-300 mt-1">Mathematical risk registers evaluating inherent vs. residual exposure reduction.</p>
              </div>
              <RiskHeatmapVisual />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: WHAT WE CATCH (THREAT MATRIX & VECTORS)
            ========================================================================= */}
        <section id="what-we-catch" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20">
          <span id="mistakes-we-catch" className="sr-only" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                What We Catch: 5 High-Liability Failure Modes
              </h2>
              <p className="text-base text-slate-300 mt-3 leading-relaxed">
                When autonomous agents and generative models fail in regulated environments, the consequences include malpractice liability, unauthorized database writes, and regulatory fines.
              </p>
            </div>

            {/* Threat Matrix Visual Component */}
            <div className="mb-12">
              <ThreatMatrixVisual />
            </div>

            {/* 5 Vectors Grid (Concise & Human) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Autonomous Tool Misuse &amp; Excessive Agency</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Destructive SQL executions (<code className="font-mono text-crimson-300">DROP TABLE</code>), unapproved file writes, and bypassed human-in-the-loop approval gates.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: Parameter schema validation &amp; mandatory gate enforcement.
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Cross-Tenant BOLA &amp; Context Injection</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Broken Object Level Authorization where tool parameters target foreign <code className="font-mono text-amber-300">tenant_id</code> boundaries or parse indirect injection in RAG documents.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: Parameter-level tenant boundary isolation.
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Legal AI Malpractice &amp; UPL</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unauthorized practice of law, illegal self-help eviction counsel (changing door locks, cutting power), and fabricated statutory citations.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: Deterministic statutory pattern matching &amp; disclaimer guards.
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Algorithmic &amp; Socioeconomic Bias</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Paired differential testing exposing excessive documentation hurdles for low-income profiles or discriminatory credit redlining.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: Automated paired demographic fuzzing &amp; friction analysis.
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Security &amp; Infrastructure Leakage</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct prompt injection hijacking, system prompt extraction, and accidental disclosure of internal routing tokens or cloud metadata endpoints.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: Kernel-level SSRF filters &amp; token blocklists.
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2.5">
                <h3 className="text-base font-bold text-white">Dual-Engine Severity Mapper</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-speed regex heuristics fire instantly on exact pattern breaches, while Gemini Pro semantic proposals are verified against quantitative 5x5 tables in PostgreSQL.
                </p>
                <div className="text-[11px] text-teal-400 font-medium pt-2 border-t border-white/5">
                  &bull; Defense: 2500ms semantic circuit breaker with offline fallback.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WHO IT'S FOR & STATUTORY FRAMEWORK RADAR
            ========================================================================= */}
        <section id="who-its-for" className="py-16 md:py-24 border-b border-white/10 scroll-mt-20 bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Target Use Cases: Built for High-Liability AI Workflows
              </h2>
              <p className="text-base text-slate-300 mt-3 leading-relaxed">
                Designed in consultation with engineering and compliance workflows across regulated sectors—currently onboarding early design partners to validate production adapters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Legal Tech &amp; Law Firms</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assure legal triage assistants never commit malpractice, and export signed audit trails directly to malpractice insurers.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Agent &amp; MCP Developers</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Verify multi-step agents before giving them production database access, catching tool-parameter poisoning in CI/CD pipelines.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Regulated AI Teams</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Comply with EU AI Act mandatory pre-deployment testing and NIST AI RMF continuous governance across fintech and healthcare.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Assessors &amp; Auditors</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Replace static spreadsheets with empirical model testing across multi-tenant client workspaces with 4-tier RBAC.
                </p>
              </div>
            </div>

            {/* Statutory Compliance Cross-Walk Radar */}
            <div className="pt-8 border-t border-white/10">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Unified Multi-Framework Compliance Cross-Walk</h3>
                <p className="text-xs text-slate-300 mt-1">16 technical controls mapped across US, EU, and global standards—demonstrating automated cross-walking from runtime test telemetry to regulatory frameworks.</p>
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
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                Clear answers regarding data privacy, MCP tool inspection, and independent assurance.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="group glass-panel border border-white/10 rounded-2xl p-6 transition-all duration-200 hover:border-white/20 open:bg-slate-900/80"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none text-base font-bold text-white group-hover:text-slate-200 transition-colors">
                    <span>{item.question}</span>
                    <span className="ml-4 shrink-0 p-1.5 rounded-full text-slate-400 group-hover:text-white transition-transform duration-200 group-open:rotate-180">
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
            <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-crimson-900/80 via-slate-900/90 to-slate-950 border border-crimson-500/40 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
                  Experience the PoC Sandbox or Partner With Us
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
                  Test our pre-configured Synthetic Legal Intake Assistant inside the live prototype, watch deterministic MCP interception in action, or reach out regarding design partnerships and seed funding.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={isAuthenticated ? "/overview" : "/login"}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-crimson-600/30 transition-all min-h-[48px] flex items-center justify-center border border-crimson-400/40 hover:scale-[1.02]"
                  >
                    <span>{isAuthenticated ? "Open Your Workspace" : "Enter Live PoC Sandbox"}</span>
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white border border-white/20 text-sm font-bold transition-all min-h-[48px] flex items-center justify-center"
                  >
                    <span>Request Design Partner Access</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          GLOBAL ENTERPRISE & LEGAL FOOTER
          ========================================================================= */}
      <SiteFooter />
    </div>
  );
}
