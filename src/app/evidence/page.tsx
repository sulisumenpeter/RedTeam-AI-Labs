"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Archive, ShieldCheck, CheckCircle2, Hash, FileCheck, Clock, User } from "lucide-react";

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence Vault &amp; Audit Trail</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-evident cryptographic repository of policy snapshots, test outputs, and append-only audit event logs.
          </p>
        </div>

        {/* Evidence Items Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center">
            <Archive className="w-4 h-4 mr-2 text-teal-600" /> Verified Governance Evidence Records ({evidence.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <div className="text-xs text-slate-500">
                        Type: <span className="font-semibold text-slate-700">{item.evidence_type}</span> &bull; Source: {item.source}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> {item.verification_status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-500 gap-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">SHA-256 Content Hash: {item.content_hash}</span>
                  </div>
                  <span className="shrink-0 text-slate-400 font-sans">
                    Verified by: <strong className="text-slate-700">{item.verified_by || "System Assurance"}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Append-Only Audit Trail */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">Append-Only Audit Log</h2>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditEvents.map((ae: any) => (
              <div key={ae.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block font-mono text-[11px]">
                      {ae.action}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Actor: {ae.actor_email} &bull; Entity: {ae.entity_type} ({ae.entity_id?.slice(0, 8)}...)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
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

