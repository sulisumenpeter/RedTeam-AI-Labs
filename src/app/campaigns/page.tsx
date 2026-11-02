"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Target, Plus, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Assurance Campaigns</h1>
            <p className="text-sm text-slate-500 mt-1">
              Deterministic fuzzing, adversarial safety evaluation, and paired bias audits across registered AI systems.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Safety Campaign
          </Link>
        </div>

        {/* Campaign List */}
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                    <div className="text-xs text-slate-500">
                      Target: {c.target_name} &bull; Policy: {c.policy_name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {c.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Tests Executed</span>
                  <span className="text-slate-800 font-semibold">{c.tests_count} Tests (100% complete)</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Safety Deficiencies Flagged</span>
                  <span className="text-red-700 font-semibold flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" /> {c.findings_count} Findings Recorded
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Execution Mode</span>
                  <span className="text-slate-800 font-semibold">Simulated Legal Target (Safe)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Link
                  href={`/campaigns/${c.id}`}
                  className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                >
                  View Findings &amp; Export Audit Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

