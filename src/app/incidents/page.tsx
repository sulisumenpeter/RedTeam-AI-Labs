"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Flame, ShieldAlert, CheckCircle2, Clock, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIncidents() {
      try {
        const res = await fetch("/api/incidents");
        const json = await res.json();
        setIncidents(json.incidents || []);
      } catch (err) {
        console.error("Failed to load incidents:", err);
      } finally {
        setLoading(false);
      }
    }
    loadIncidents();
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 mb-2">
              <Flame className="w-3.5 h-3.5 mr-1.5 text-crimson-400" /> Active Governance Deficiencies
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Incident Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Tracked governance violations, empirical test failures, and safety breaches requiring remediation.
            </p>
          </div>
          <Link
            href="/remediation"
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
          >
            View Remediation Plans <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Incident List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 text-xs text-slate-400">
            No open incidents currently recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-md border border-white/20">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{inc.title}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Category: <span className="text-slate-200">{inc.category}</span> &bull; Detected: <span className="text-slate-300 font-mono">{new Date(inc.detected_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                        inc.severity === "CRITICAL"
                          ? "bg-crimson-500/20 text-crimson-300 border-crimson-500/30"
                          : inc.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold glass-panel-subtle text-slate-300 border border-white/10 uppercase tracking-wider">
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                  <span>Assigned Owner: <strong className="text-slate-200">{inc.assigned_owner}</strong></span>
                  <Link
                    href="/remediation"
                    className="text-teal-400 hover:text-teal-300 font-bold inline-flex items-center"
                  >
                    View Remediation Action &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
