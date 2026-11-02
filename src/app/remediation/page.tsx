"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Wrench, CheckCircle2, Clock, RotateCcw, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RemediationPage() {
  const [remediations, setRemediations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retestMessage, setRetestMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadRemediations() {
      try {
        const res = await fetch("/api/incidents");
        const json = await res.json();
        setRemediations(json.remediationActions || []);
      } catch (err) {
        console.error("Failed to load remediation actions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRemediations();
  }, []);

  const handleRetest = (rem: any) => {
    setRetestMessage(`Initiated regression retest for '${rem.title}'. Navigating to verification campaign...`);
    setTimeout(() => {
      window.location.href = `/campaigns/new`;
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Remediation Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Corrective action plans, system guardrail deployments, and retest verification for flagged findings.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            Launch Retest Campaign &rarr;
          </Link>
        </div>

        {retestMessage && (
          <div className="p-3.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold flex items-center animate-pulse">
            <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600" /> {retestMessage}
          </div>
        )}

        {/* Remediation Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading remediation actions...</div>
        ) : remediations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No active remediation actions recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {remediations.map((rem) => (
              <div
                key={rem.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rem.title}</h3>
                      <div className="text-xs text-slate-500">
                        Type: <span className="font-mono text-[11px] font-semibold text-slate-700">{rem.remediation_type}</span> &bull; Due: {rem.due_date || "2026-11-20"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {rem.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rem.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Assigned Engineer: <strong className="text-slate-800">{rem.assigned_owner}</strong></span>
                  <button
                    onClick={() => handleRetest(rem)}
                    className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retest &amp; Verify Remediation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

