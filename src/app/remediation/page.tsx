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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
              <Wrench className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Corrective Action Lifecycle
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Remediation Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Corrective action plans, system guardrail deployments, and retest verification for flagged findings.
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
          >
            Launch Retest Campaign &rarr;
          </Link>
        </div>

        {retestMessage && (
          <div className="p-4 bg-teal-950/60 text-teal-200 border border-teal-500/40 rounded-xl text-xs font-semibold flex items-center shadow-lg animate-pulse">
            <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" /> {retestMessage}
          </div>
        )}

        {/* Remediation Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading remediation actions...</div>
        ) : remediations.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 text-xs text-slate-400">
            No active remediation actions recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {remediations.map((rem) => (
              <div
                key={rem.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white flex items-center justify-center font-bold shadow-md border border-white/20">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{rem.title}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Type: <span className="font-mono text-[11px] font-semibold text-teal-300">{rem.remediation_type}</span> &bull; Due: <span className="font-mono text-slate-300">{rem.due_date || "2026-11-20"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                      {rem.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rem.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-white/10">
                  <span>Assigned Engineer: <strong className="text-white">{rem.assigned_owner}</strong></span>
                  <button
                    onClick={() => handleRetest(rem)}
                    className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl border border-crimson-400/30 shadow-md transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retest &amp; Verify Remediation
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
