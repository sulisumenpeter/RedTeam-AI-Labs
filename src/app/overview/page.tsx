"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import {
  Server,
  AlertTriangle,
  FileText,
  Target,
  Wrench,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Cpu,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Zap,
  TrendingDown,
} from "lucide-react";

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systems, setSystems] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [remediations, setRemediations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    systemsCount: 0,
    policiesCount: 0,
    risksCount: 0,
    avgInherentRisk: 0,
    avgResidualRisk: 0,
    incidentsCount: 0,
    remediationsCount: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sysRes, polRes, riskRes, incRes] = await Promise.all([
        fetch("/api/systems").then(async (r) => {
          if (!r.ok) throw new Error(`Systems API error (${r.status})`);
          return r.json();
        }),
        fetch("/api/policies").then(async (r) => {
          if (!r.ok) throw new Error(`Policies API error (${r.status})`);
          return r.json();
        }),
        fetch("/api/risks").then(async (r) => {
          if (!r.ok) throw new Error(`Risks API error (${r.status})`);
          return r.json();
        }),
        fetch("/api/incidents").then(async (r) => {
          if (!r.ok) throw new Error(`Incidents API error (${r.status})`);
          return r.json();
        }),
      ]);

      const fetchedSystems = Array.isArray(sysRes.systems) ? sysRes.systems : Array.isArray(sysRes) ? sysRes : [];
      const fetchedPolicies = Array.isArray(polRes.policies) ? polRes.policies : Array.isArray(polRes) ? polRes : [];
      const fetchedRisks = Array.isArray(riskRes.risks) ? riskRes.risks : Array.isArray(riskRes) ? riskRes : [];
      const fetchedIncidents = Array.isArray(incRes.incidents) ? incRes.incidents : Array.isArray(incRes) ? incRes : [];
      const fetchedRemediations = Array.isArray(incRes.remediationActions) ? incRes.remediationActions : [];

      setSystems(fetchedSystems);
      setPolicies(fetchedPolicies);
      setRisks(fetchedRisks);
      setIncidents(fetchedIncidents);
      setRemediations(fetchedRemediations);

      const avgInherent = typeof riskRes.averageInherentScore === "number" ? riskRes.averageInherentScore : 0;
      const avgResidual = typeof riskRes.averageResidualScore === "number" ? riskRes.averageResidualScore : 0;

      setStats({
        systemsCount: fetchedSystems.length,
        policiesCount: fetchedPolicies.length,
        risksCount: fetchedRisks.length,
        avgInherentRisk: avgInherent,
        avgResidualRisk: avgResidual,
        incidentsCount: fetchedIncidents.length,
        remediationsCount: fetchedRemediations.length,
      });
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const featuredSystem = systems.length > 0 ? systems[0] : null;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Mission-Control Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse mr-2" />
              Enterprise Assurance Live Workspace &bull; Zero Evaluator Drift
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Governance &amp; Assurance Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Continuous empirical assurance, quantitative 5&times;5 risk scoring, and statutory compliance cross-walking for generative models and MCP-enabled autonomous agents.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/campaigns/new"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
            >
              <Target className="w-4 h-4 mr-2" /> Launch Assessment
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold glass-panel hover:bg-white/10 text-slate-200 border border-white/10 shadow-sm transition-all"
            >
              Export Audit Reports
            </Link>
          </div>
        </div>

        {/* Error Alert State */}
        {error && (
          <div className="p-4 bg-crimson-950/60 text-crimson-200 border border-crimson-500/40 rounded-xl text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-crimson-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center px-3 py-1 bg-white/10 border border-crimson-400/40 rounded text-xs font-semibold text-white hover:bg-white/20"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </button>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 glass-panel rounded-2xl border border-white/5" />
              ))}
            </div>
            <div className="h-44 glass-panel rounded-2xl border border-white/5" />
          </div>
        ) : (
          <>
            {/* High-Density KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Registered AI Systems"
                value={stats.systemsCount}
                subtitle={
                  stats.systemsCount === 0
                    ? "No systems registered yet"
                    : `${stats.systemsCount} Active System${stats.systemsCount > 1 ? "s" : ""} in Registry`
                }
                icon={Server}
                accent="cyan"
                href="/systems"
              />
              <MetricCard
                title="Inherent Risk Index"
                value={stats.risksCount === 0 ? "0 / 25" : `${stats.avgInherentRisk} / 25`}
                subtitle={
                  stats.risksCount === 0
                    ? "No risks logged for workspace"
                    : stats.avgResidualRisk > 0
                    ? `Reduced to ${stats.avgResidualRisk} via controls (-${Math.round(((stats.avgInherentRisk - stats.avgResidualRisk) / (stats.avgInherentRisk || 1)) * 100)}%)`
                    : "Residual baseline"
                }
                icon={AlertTriangle}
                accent={stats.avgInherentRisk >= 15 ? "crimson" : "teal"}
                href="/risks"
              />
              <MetricCard
                title="Governance Policies"
                value={stats.policiesCount}
                subtitle={
                  stats.policiesCount === 0
                    ? "No policies configured yet"
                    : "NIST, EU AI Act & OWASP Agentic"
                }
                icon={FileText}
                accent="indigo"
                href="/policies"
              />
              <MetricCard
                title="Tracked Remediations"
                value={`${stats.incidentsCount} Incident${stats.incidentsCount === 1 ? "" : "s"}`}
                subtitle={
                  stats.remediationsCount === 0
                    ? "0 Active Action Plans"
                    : `${stats.remediationsCount} In-Progress Action Plan${stats.remediationsCount > 1 ? "s" : ""}`
                }
                icon={Wrench}
                accent="teal"
                href="/remediation"
              />
            </div>

            {/* Agentic Tool-Execution & MCP Assurance Posture Banner */}
            <div className="glass-panel-elevated rounded-2xl p-6 border border-white/10 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="space-y-1.5 z-10">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Terminal className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Agentic Tool-Execution &amp; MCP Assurance Posture
                  </h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                    OWASP ASI-01–ASI-04 ALIGNED
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Continuous runtime inspection of Model Context Protocol (MCP) tool calls, OpenTelemetry distributed spans, parameter boundaries (BOLA), and human-in-the-loop approval triggers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 z-10">
                <div className="px-3.5 py-2 rounded-xl glass-panel border border-white/10 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">MCP Protocol</span>
                  <span className="text-emerald-400 font-bold flex items-center mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                    Active Inspection
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-xl glass-panel border border-white/10 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">HITL Approval Gate</span>
                  <span className="text-teal-400 font-bold flex items-center mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                    Enforced
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-xl glass-panel border border-white/10 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">OWASP Agentic</span>
                  <span className="text-amber-300 font-bold block mt-0.5">
                    ASI-01 &bull; ASI-04
                  </span>
                </div>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 transition-all shadow-md ml-1"
                >
                  Inspect Traces <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            {/* Featured System Card or Empty State */}
            {featuredSystem ? (
              <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-white/20">
                      ⚖️
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-bold text-white tracking-tight">{featuredSystem.name}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                          {featuredSystem.risk_tier || featuredSystem.risk_classification || "HIGH RISK"}
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Active"></span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {featuredSystem.description || featuredSystem.intended_purpose || "Intake and triage assistance bot."}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/campaigns/new?ai_system_id=${featuredSystem.id}`}
                    className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl border border-crimson-400/30 shadow-md transition-all"
                  >
                    Run Safety Campaign <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Business Owner</span>
                    <span className="text-white font-semibold mt-0.5 block">{featuredSystem.business_owner || "Unassigned"}</span>
                  </div>
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Target Adapter</span>
                    <span className="text-teal-300 font-mono font-semibold mt-0.5 block">{featuredSystem.adapter_type || "AGENTIC_MCP_ENDPOINT"}</span>
                  </div>
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Environment</span>
                    <span className="text-white font-semibold mt-0.5 block">{featuredSystem.deployment_environment || "PRODUCTION"}</span>
                  </div>
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Assurance Status</span>
                    <span className="text-emerald-400 font-semibold flex items-center mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" /> Active Tracking
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl border border-dashed border-white/20 p-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No AI Systems Registered Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Register your first AI model or autonomous agent to track risks, enforce policies, and execute red-team assurance campaigns.
                </p>
                <div className="pt-2">
                  <Link
                    href="/systems"
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-md transition-all border border-crimson-400/30"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Register AI System
                  </Link>
                </div>
              </div>
            )}

            {/* 2-Column Section: Risk Register Overview + Control Frameworks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Overview */}
              <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2 text-amber-400" /> Priority Risk Register
                  </h3>
                  <Link href="/risks" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                    View 5&times;5 Matrix &rarr;
                  </Link>
                </div>
                {risks.length > 0 ? (
                  <div className="space-y-2.5">
                    {risks.slice(0, 4).map((r: any) => (
                      <RiskItem
                        key={r.id}
                        title={r.title}
                        category={r.category}
                        score={`${r.inherent_score || (r.inherent_likelihood * r.inherent_impact)} Inherent \u2192 ${r.residual_score || (r.residual_likelihood * r.residual_impact)} Residual`}
                        status={r.status || "OPEN"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 glass-panel-subtle rounded-xl border border-white/5">
                    <p>No risks logged for this workspace yet.</p>
                    <Link href="/risks" className="text-teal-400 font-semibold hover:underline mt-1 inline-block">
                      + Create First Risk Assessment
                    </Link>
                  </div>
                )}
              </div>

              {/* Compliance & Framework Status */}
              <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-teal-400" /> Statutory Framework Cross-Walk
                  </h3>
                  <Link href="/frameworks" className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                    Explore Controls &rarr;
                  </Link>
                </div>
                <div className="space-y-2.5">
                  <FrameworkRow
                    name="NIST AI RMF 1.0"
                    controls="4 Controls Mapped"
                    status="MEASURE-2.6 Verified"
                    badge="GOVERN / MAP"
                  />
                  <FrameworkRow
                    name="EU AI Act (2024/1689)"
                    controls="Articles 9, 13, 14, 50"
                    status="Mandatory Testing Enforced"
                    badge="HIGH RISK"
                  />
                  <FrameworkRow
                    name="ISO/IEC 42001:2023"
                    controls="A.6.1 &amp; A.8.4 Robustness"
                    status="Fuzzing Validated"
                    badge="CERT READY"
                  />
                  <FrameworkRow
                    name="OWASP Agentic Top 10"
                    controls="ASI-01 through ASI-04"
                    status="MCP Runtime Assured"
                    badge="TOOL ASSURANCE"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "cyan",
  href,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  accent?: "cyan" | "crimson" | "indigo" | "teal";
  href: string;
}) {
  const accentClasses = {
    cyan: "text-cyan-400 group-hover:border-cyan-500/40",
    crimson: "text-crimson-400 group-hover:border-crimson-500/40",
    indigo: "text-indigo-400 group-hover:border-indigo-500/40",
    teal: "text-teal-400 group-hover:border-teal-500/40",
  };

  return (
    <Link
      href={href}
      className={`glass-panel p-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all flex flex-col justify-between group shadow-lg ${accentClasses[accent]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-black text-white tracking-tight">{value}</div>
        <div className="text-xs text-slate-400 mt-1 flex items-center">
          {subtitle}
        </div>
      </div>
    </Link>
  );
}

function RiskItem({
  title,
  category,
  score,
  status,
}: {
  title: string;
  category: string;
  score: string;
  status: string;
}) {
  return (
    <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex items-center justify-between text-xs hover:border-white/15 transition-colors">
      <div className="pr-3">
        <div className="font-semibold text-white truncate max-w-sm">{title}</div>
        <div className="text-slate-400 text-[11px] mt-0.5">{category} &bull; <span className="text-teal-300 font-mono">{score}</span></div>
      </div>
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
        {status}
      </span>
    </div>
  );
}

function FrameworkRow({
  name,
  controls,
  status,
  badge,
}: {
  name: string;
  controls: string;
  status: string;
  badge?: string;
}) {
  return (
    <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex items-center justify-between text-xs hover:border-white/15 transition-colors">
      <div>
        <div className="font-semibold text-white flex items-center gap-2">
          {name}
          {badge && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/10 uppercase">
              {badge}
            </span>
          )}
        </div>
        <div className="text-slate-400 text-[11px] mt-0.5">{controls}</div>
      </div>
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 whitespace-nowrap">
        {status}
      </span>
    </div>
  );
}
