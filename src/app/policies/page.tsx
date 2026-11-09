"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { FileText, Plus, ShieldCheck, CheckCircle2, Lock, ArrowRight, Scale, Sparkles } from "lucide-react";
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
              <Scale className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Statutory &amp; Behavioral Guardrails
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Governance Policies</h1>
            <p className="text-sm text-slate-400 mt-1">
              Authoritative rubrics, mandatory behavioral boundaries, and immutable assessment baseline policies.
            </p>
          </div>
          <Link
            href="/policy"
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
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
                  className="glass-panel rounded-2xl border border-white/10 shadow-xl p-6 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-white/20">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center">
                          {p.name}
                          <span className="ml-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10 font-mono">
                            v{p.version}
                          </span>
                        </h2>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Target: <span className="text-slate-200">{p.target_type}</span> &bull; Jurisdiction: <span className="text-slate-200">{p.jurisdiction || "US Standard"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> {p.status}
                      </span>
                      {p.is_immutable && (
                        <span className="text-xs font-semibold px-2.5 py-1 glass-panel-subtle text-slate-300 rounded-full border border-white/10 flex items-center" title="Policy locked by assessment campaign">
                          <Lock className="w-3 h-3 mr-1 text-slate-400" /> Immutable
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

                  {/* Requirements List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Enforced Governance Requirements ({reqs.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      {reqs.map((r: any) => (
                        <div
                          key={r.id}
                          className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex items-start justify-between space-x-2"
                        >
                          <div>
                            <span className="font-semibold text-white block">{r.title}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">{r.category}</span>
                            <span className="text-[11px] text-teal-300/90 block mt-1 italic">&ldquo;{r.expected_behavior}&rdquo;</span>
                          </div>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border uppercase tracking-wider ${
                              r.severity_if_violated === "CRITICAL"
                                ? "bg-crimson-500/20 text-crimson-300 border-crimson-500/30"
                                : r.severity_if_violated === "HIGH"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                            }`}
                          >
                            {r.severity_if_violated}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Hash: {p.policy_hash ? `${p.policy_hash.slice(0, 16)}...` : "SHA256-UNSET"}
                    </span>
                    <Link
                      href={`/campaigns/new?policy_id=${p.id}`}
                      className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl border border-crimson-400/30 shadow-md transition-all"
                    >
                      Run Campaign with this Policy <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
