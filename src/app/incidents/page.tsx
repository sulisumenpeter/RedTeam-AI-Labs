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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incident Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Tracked governance violations, empirical test failures, and safety breaches requiring remediation.
            </p>
          </div>
          <Link
            href="/remediation"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            View Remediation Plans &rarr;
          </Link>
        </div>

        {/* Incident List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No open incidents currently recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{inc.title}</h3>
                      <div className="text-xs text-slate-500">
                        Category: {inc.category} &bull; Detected: {new Date(inc.detected_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
                        inc.severity === "CRITICAL"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : inc.severity === "HIGH"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{inc.description}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Assigned Owner: <strong className="text-slate-800">{inc.assigned_owner}</strong></span>
                  <Link
                    href="/remediation"
                    className="text-teal-600 hover:text-teal-700 font-bold inline-flex items-center"
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

