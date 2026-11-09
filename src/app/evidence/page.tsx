"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Archive, ShieldCheck, CheckCircle2, Hash, FileCheck, Clock, User, Lock, Sparkles } from "lucide-react";

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [evRes, auditRes] = await Promise.all([
          fetch("/api/evidence").then((r) => r.json()).catch(() => ({ evidence: [] })),
          fetch("/api/audit").then((r) => r.json()).catch(() => ({ auditEvents: [] })),
        ]);
        setEvidence(evRes.evidence || []);
        setAuditEvents(auditRes.auditEvents || []);
      } catch (err) {
        console.error("Failed to load evidence data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Tamper-Evident SHA-256 Immutability
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Evidence Vault &amp; Audit Trail</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-evident cryptographic repository of policy snapshots, test outputs, and append-only audit event logs.
          </p>
        </div>

        {/* Evidence Items Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center">
            <Archive className="w-4 h-4 mr-2 text-teal-400" /> Verified Governance Evidence Records ({evidence.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-3 hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white flex items-center justify-center font-bold shadow-md border border-white/20">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Type: <span className="font-semibold text-slate-200">{item.evidence_type}</span> &bull; Source: <span className="text-slate-300">{item.source}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> {item.verification_status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center space-x-2 truncate">
                    <Hash className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate text-teal-300">SHA-256: {item.content_hash}</span>
                  </div>
                  <span className="shrink-0 text-slate-400 font-sans">
                    Verified by: <strong className="text-white">{item.verified_by || "System Assurance"}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Append-Only Audit Trail */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold text-white">Append-Only Audit Log</h2>
          </div>
          <div className="divide-y divide-white/5 text-xs">
            {auditEvents.map((ae: any) => (
              <div key={ae.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block font-mono text-[11px]">
                      {ae.action}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Actor: {ae.actor_email} &bull; Entity: {ae.entity_type} ({ae.entity_id?.slice(0, 8)}...)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(ae.created_at || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
