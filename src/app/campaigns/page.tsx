"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Target, Plus, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight, Activity, Terminal } from "lucide-react";
import Link from "next/link";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load existing demo campaigns or mock assessments
    setCampaigns([
      {
        id: "demo",
        name: "LexHack Main Evaluation (Demo Baseline)",
        target_name: "Synthetic Legal Intake Assistant",
        policy_name: "Legal AI Responsible Use Policy v1.0",
        status: "COMPLETED",
        tests_count: 30,
        findings_count: 5,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Empirical Assessment Runs
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Assurance Campaigns</h1>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic fuzzing, adversarial safety evaluation, MCP tool inspection, and paired bias audits across registered AI systems.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Safety Campaign
          </Link>
        </div>

        {/* Campaign List */}
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-white/20">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Target: <span className="text-slate-200 font-semibold">{c.target_name}</span> &bull; Policy: <span className="text-slate-200">{c.policy_name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> {c.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                  <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Tests Executed</span>
                  <span className="text-white font-semibold font-mono mt-0.5 block">{c.tests_count} Tests (100% complete)</span>
                </div>
                <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                  <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Deficiencies Flagged</span>
                  <span className="text-crimson-400 font-semibold flex items-center mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-crimson-400" /> {c.findings_count} Findings Recorded
                  </span>
                </div>
                <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                  <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Execution Protocol</span>
                  <span className="text-teal-300 font-semibold font-mono mt-0.5 block">MCP &amp; Synthetic Dual-Engine</span>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <Link
                  href={`/campaigns/${c.id}`}
                  className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl border border-crimson-400/30 shadow-md transition-all"
                >
                  View Findings &amp; Export Audit Report <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
