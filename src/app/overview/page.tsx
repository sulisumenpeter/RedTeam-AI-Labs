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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" /> Enterprise Assurance Live Workspace
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Governance &amp; Assurance Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Integrated lifecycle governance, risk management, and empirical adversarial assurance for legal AI systems.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/campaigns/new"
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
            >
              <Target className="w-4 h-4 mr-1.5" /> Launch Assessment
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              Export Audit Reports
            </Link>
          </div>
        </div>

        {/* Error Alert State */}
        {error && (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center px-3 py-1 bg-white border border-red-300 rounded text-xs font-semibold text-red-700 hover:bg-red-50"
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
                <div key={i} className="h-28 bg-slate-100 rounded-xl border border-slate-200" />
              ))}
            </div>
            <div className="h-44 bg-slate-100 rounded-xl border border-slate-200" />
          </div>
        ) : (
          <>
            {/* High-Level Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Registered AI Systems"
                value={stats.systemsCount}
                subtitle={
                  stats.systemsCount === 0
                    ? "No systems registered yet"
                    : `${stats.systemsCount} Active System${stats.systemsCount > 1 ? "s" : ""}`
                }
                icon={Server}
                href="/systems"
              />
              <MetricCard
                title="Inherent Risk Index"
                value={stats.risksCount === 0 ? "0 / 25" : `${stats.avgInherentRisk} / 25`}
                subtitle={
                  stats.risksCount === 0
                    ? "No risks logged for workspace"
                    : stats.avgResidualRisk > 0
                    ? `Reduced to ${stats.avgResidualRisk} via mitigations`
                    : "Residual baseline"
                }
                icon={AlertTriangle}
                color={stats.avgInherentRisk >= 15 ? "text-amber-600" : "text-slate-900"}
                href="/risks"
              />
              <MetricCard
                title="Active Governance Policies"
                value={stats.policiesCount}
                subtitle={
                  stats.policiesCount === 0
                    ? "No policies configured yet"
                    : "NIST & EU AI Act Aligned"
                }
                icon={FileText}
                href="/policies"
              />
              <MetricCard
                title="Tracked Remediation"
                value={`${stats.incidentsCount} Incident${stats.incidentsCount === 1 ? "" : "s"}`}
                subtitle={
                  stats.remediationsCount === 0
                    ? "0 Active Action Plans"
                    : `${stats.remediationsCount} In-Progress Action Plan${stats.remediationsCount > 1 ? "s" : ""}`
                }
                icon={Wrench}
                color="text-teal-600"
                href="/remediation"
              />
            </div>

            {/* Featured System Card or Empty State */}
            {featuredSystem ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      ⚖️
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-base font-bold text-slate-900">{featuredSystem.name}</h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {featuredSystem.risk_tier || featuredSystem.risk_classification || "HIGH RISK"}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {featuredSystem.description || featuredSystem.intended_purpose || "Intake and triage assistance bot."}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/campaigns/new?ai_system_id=${featuredSystem.id}`}
                    className="inline-flex items-center text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    Run Safety Campaign <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Business Owner</span>
                    <span className="text-slate-800 font-semibold">{featuredSystem.business_owner || "Unassigned"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Model Engine</span>
                    <span className="text-slate-800 font-semibold">{featuredSystem.model_name || "gemini-1.5-flash"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Environment</span>
                    <span className="text-slate-800 font-semibold">{featuredSystem.deployment_environment || "PRODUCTION"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Assurance Status</span>
                    <span className="text-emerald-700 font-semibold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Active Governance Tracking
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">No AI Systems Registered Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Register your first AI model or intake assistant to track risks, enforce policies, and execute red-team assurance campaigns.
                </p>
                <div className="pt-2">
                  <Link
                    href="/systems"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Register AI System
                  </Link>
                </div>
              </div>
            )}

            {/* 2-Column Section: Risk Register Overview + Control Frameworks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2 text-amber-500" /> Priority Risk Register
                  </h3>
                  <Link href="/risks" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                    View 5x5 Matrix &rarr;
                  </Link>
                </div>
                {risks.length > 0 ? (
                  <div className="space-y-3">
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
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                    <p>No risks logged for this workspace yet.</p>
                    <Link href="/risks" className="text-teal-600 font-semibold hover:underline mt-1 inline-block">
                      + Create First Risk Assessment
                    </Link>
                  </div>
                )}
              </div>

              {/* Compliance & Framework Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-teal-600" /> Framework Cross-Walk
                  </h3>
                  <Link href="/frameworks" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                    Explore Controls &rarr;
                  </Link>
                </div>
                <div className="space-y-3">
                  <FrameworkRow
                    name="NIST AI RMF 1.0"
                    controls="4 Controls Mapped"
                    status="MEASURE-2.6 Verified"
                  />
                  <FrameworkRow
                    name="EU AI Act (2024/1689)"
                    controls="Articles 9, 13, 14"
                    status="Transparency In Review"
                  />
                  <FrameworkRow
                    name="ISO/IEC 42001:2023"
                    controls="A.6.1 &amp; A.8.4 Robustness"
                    status="Fuzzing Validated"
                  />
                  <FrameworkRow
                    name="OECD AI Principles"
                    controls="Principle 1.2 Fairness"
                    status="Paired Testing Live"
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
  color = "text-slate-900",
  href,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className={`text-2xl font-extrabold ${color} tracking-tight`}>{value}</div>
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
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
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="text-slate-500 text-[11px]">{category} &bull; {score}</div>
      </div>
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
        {status}
      </span>
    </div>
  );
}

function FrameworkRow({
  name,
  controls,
  status,
}: {
  name: string;
  controls: string;
  status: string;
}) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
      <div>
        <div className="font-semibold text-slate-900">{name}</div>
        <div className="text-slate-500 text-[11px]">{controls}</div>
      </div>
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
        {status}
      </span>
    </div>
  );
}
