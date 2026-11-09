"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { ShieldCheck, BookOpen, ExternalLink, CheckCircle2, Clock, Scale, Layers, Sparkles } from "lucide-react";

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState<string>("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/frameworks");
        const json = await res.json();
        setFrameworks(json.frameworks || []);
        setControls(json.controls || []);
        setMappings(json.mappings || []);
      } catch (err) {
        console.error("Failed to load frameworks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredControls =
    selectedFramework === "ALL"
      ? controls
      : controls.filter((c: any) => c.framework_code === selectedFramework);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
            <Scale className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Multi-Jurisdictional Cross-Walks
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Governance Framework Library</h1>
          <p className="text-sm text-slate-400 mt-1">
            Harmonized control mapping across international AI governance frameworks, statutory regulations, and OWASP agentic standards.
          </p>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {frameworks.map((f: any) => {
            const isOwasp = f.short_code === "OWASP_AGENTIC_TOP_10";
            const isSelected = selectedFramework === f.short_code;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFramework(isSelected ? "ALL" : f.short_code)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "glass-panel-elevated border-teal-500/60 ring-2 ring-teal-500/30 shadow-xl"
                    : "glass-panel border-white/10 hover:border-white/20 hover:bg-white/5 shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono truncate border border-white/10">
                      {f.short_code}
                    </span>
                    {f.official_uri && (
                      <a
                        href={f.official_uri}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                        title="Official standard link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {isOwasp && (
                    <div className="mb-2">
                      <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 tracking-wider uppercase">
                        2026 AGENTIC STANDARD
                      </span>
                    </div>
                  )}
                  <h3 className="text-xs font-bold text-white line-clamp-1">{f.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{f.description}</p>
                </div>
                <div className="text-[10px] text-slate-400 mt-3 pt-2.5 border-t border-white/10 font-medium truncate">
                  {f.issuing_body}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 glass-panel-subtle border border-white/10 rounded-2xl text-xs text-slate-300 leading-relaxed flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Framework Mapping Disclaimer:</strong> Cross-walking internal governance policies to international frameworks (e.g., NIST AI RMF, EU AI Act, ISO/IEC 42001, OECD AI, and OWASP Agentic Top 10 ASI-01–ASI-04) assists organizations in structuring audit evidence, evaluating tool-execution guardrails, and establishing assurance metrics. Framework mappings do not automatically confer official certification or guarantee statutory compliance.
          </div>
        </div>

        {/* Controls Table */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-sm font-bold text-white flex items-center">
              Mapped Governance Controls ({filteredControls.length})
              {selectedFramework !== "ALL" && (
                <span className="ml-2.5 text-xs font-semibold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                  {selectedFramework}
                </span>
              )}
            </h2>
            {selectedFramework !== "ALL" && (
              <button
                onClick={() => setSelectedFramework("ALL")}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="divide-y divide-white/5">
            {filteredControls.map((ctrl: any) => {
              const mapping = mappings.find((m: any) => m.framework_control_id === ctrl.id);
              return (
                <div key={ctrl.id} className="p-6 space-y-3 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-lg border border-teal-500/30">
                        {ctrl.control_code}
                      </span>
                      {ctrl.framework_code && (
                        <span className="text-[10px] font-semibold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                          {ctrl.framework_code}
                        </span>
                      )}
                      <span className="text-sm font-bold text-white">{ctrl.title}</span>
                    </div>
                    <div>
                      {mapping ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> {mapping.implementation_status}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-400 border border-white/10">
                          Control Cataloged
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{ctrl.description}</p>

                  {ctrl.guidance && (
                    <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 text-xs text-slate-300">
                      <span className="font-semibold text-teal-300 block mb-1">Assurance Guidance:</span>
                      {ctrl.guidance}
                    </div>
                  )}

                  {mapping && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                      <span>Control Owner: <strong className="text-slate-200 font-semibold">{mapping.control_owner}</strong></span>
                      <span>Assigned Requirement: <strong className="text-slate-200 font-mono">{mapping.requirement_id}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
