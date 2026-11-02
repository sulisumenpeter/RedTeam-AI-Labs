"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { FileText, Plus, ShieldCheck, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolicies() {
      try {
        const res = await fetch("/api/policies");
        const json = await res.json();
        setPolicies(json.policies || []);
      } catch (err) {
        console.error("Failed to load policies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();
  }, []);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Governance Policies</h1>
            <p className="text-sm text-slate-500 mt-1">
              Authoritative rubrics, mandatory behavioral boundaries, and immutable assessment baseline policies.
            </p>
          </div>
          <Link
            href="/policy"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Policy Builder
          </Link>
        </div>

        {/* Policy Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading governance policies...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {policies.map((p) => {
              const reqs = p.requirements || [];
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center">
                          {p.name}
                          <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            v{p.version}
                          </span>
                        </h2>
                        <div className="text-xs text-slate-500">
                          Target: {p.target_type} &bull; Jurisdiction: {p.jurisdiction || "US Standard"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {p.status}
                      </span>
                      {p.is_immutable && (
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded flex items-center" title="Policy locked by assessment campaign">
                          <Lock className="w-3 h-3 mr-1 text-slate-400" /> Immutable
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                  {/* Requirements List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Enforced Governance Requirements ({reqs.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {reqs.map((r: any) => (
                        <div
                          key={r.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between space-x-2"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 block">{r.title}</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{r.category}</span>
                            <span className="text-[11px] text-slate-600 block mt-1 italic">&ldquo;{r.expected_behavior}&rdquo;</span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 border ${
                              r.severity_if_violated === "CRITICAL"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : r.severity_if_violated === "HIGH"
                                ? "bg-orange-100 text-orange-800 border-orange-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {r.severity_if_violated}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Hash: {p.policy_hash?.slice(0, 16)}...
                    </span>
                    <Link
                      href={`/campaigns/new?policy_id=${p.id}`}
                      className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                    >
                      Run Campaign with this Policy <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

