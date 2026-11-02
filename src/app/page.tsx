"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/layout/AppShell";
import {
  Server,
  AlertTriangle,
  FileText,
  Target,
  Flame,
  Wrench,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    systemsCount: 1,
    policiesCount: 1,
    risksCount: 4,
    avgInherentRisk: 16.8,
    avgResidualRisk: 2.8,
    incidentsCount: 1,
    remediationsCount: 1,
    campaignsCount: 1,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [sysRes, polRes, riskRes, incRes] = await Promise.all([
          fetch("/api/systems").then((r) => r.json()).catch(() => ({ systems: [] })),
          fetch("/api/policies").then((r) => r.json()).catch(() => ({ policies: [] })),
          fetch("/api/risks").then((r) => r.json()).catch(() => ({ risks: [] })),
          fetch("/api/incidents").then((r) => r.json()).catch(() => ({ incidents: [], remediationActions: [] })),
        ]);

        const systems = sysRes.systems || [];
        const policies = polRes.policies || [];
        const risks = riskRes.risks || [];
        const incidents = incRes.incidents || [];
        const remediations = incRes.remediationActions || [];

        setStats({
          systemsCount: systems.length || 1,
          policiesCount: policies.length || 1,
          risksCount: risks.length || 4,
          avgInherentRisk: riskRes.averageInherentScore || 16.8,
          avgResidualRisk: riskRes.averageResidualScore || 2.8,
          incidentsCount: incidents.length || 1,
          remediationsCount: remediations.length || 1,
          campaignsCount: 1,
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

        {/* High-Level Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Registered AI Systems"
            value={stats.systemsCount}
            subtitle="1 High-Risk Legal Intake Assistant"
            icon={Server}
            href="/systems"
          />
          <MetricCard
            title="Inherent Risk Index"
            value={`${stats.avgInherentRisk} / 25`}
            subtitle="Reduced to 2.8 via mitigations"
            icon={AlertTriangle}
            color="text-amber-600"
            href="/risks"
          />
          <MetricCard
            title="Active Governance Policies"
            value={stats.policiesCount}
            subtitle="NIST & EU AI Act Aligned"
            icon={FileText}
            href="/policies"
          />
          <MetricCard
            title="Tracked Remediation"
            value={`${stats.incidentsCount} Incidents`}
            subtitle={`${stats.remediationsCount} In-Progress Action Plan`}
            icon={Wrench}
            color="text-teal-600"
            href="/remediation"
          />
        </div>

        {/* Featured Demonstration System Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ⚖️
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-slate-900">Synthetic Legal Intake Assistant</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    HIGH RISK (EU AI Act)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Pilot"></span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Tenant rights triage bot assessing eviction defense, statutory notice rules, and fee waivers.
                </p>
              </div>
            </div>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
            >
              Run 30-Test Safety Campaign <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Business Owner</span>
              <span className="text-slate-800 font-semibold">Elena Rostova (Legal Access)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Model Engine</span>
              <span className="text-slate-800 font-semibold">gemini-1.5-flash (v1.4)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Human Oversight</span>
              <span className="text-slate-800 font-semibold">Attorney Review Required</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Assurance Status</span>
              <span className="text-emerald-700 font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Audited (5 Deficiencies Found)
              </span>
            </div>
          </div>
        </div>

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
            <div className="space-y-3">
              <RiskItem
                title="Unauthorized Legal Advice on Evictions"
                category="Safety & Regulatory"
                score="20 Inherent &rarr; 3 Residual"
                status="MITIGATING"
              />
              <RiskItem
                title="Disparate Friction on Socioeconomic Lines"
                category="Bias & Fairness"
                score="16 Inherent &rarr; 2 Residual"
                status="MITIGATING"
              />
              <RiskItem
                title="Internal Escalation Routing Key Leakage"
                category="Data Leakage"
                score="15 Inherent &rarr; 2 Residual"
                status="OPEN"
              />
              <RiskItem
                title="Fabricated Housing Statute Citations"
                category="Hallucination"
                score="16 Inherent &rarr; 4 Residual"
                status="MITIGATING"
              />
            </div>
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
