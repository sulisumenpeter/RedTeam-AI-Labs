"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { ShieldCheck, BookOpen, ExternalLink, CheckCircle2, Clock } from "lucide-react";

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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Governance Framework Library</h1>
          <p className="text-sm text-slate-500 mt-1">
            Harmonized control mapping across international AI governance frameworks and legal standards.
          </p>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {frameworks.map((f: any) => {
            const isOwasp = f.short_code === "OWASP_AGENTIC_TOP_10";
            const isSelected = selectedFramework === f.short_code;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFramework(isSelected ? "ALL" : f.short_code)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-teal-50/70 border-teal-500 shadow-sm ring-1 ring-teal-500/30"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate">
                      {f.short_code}
                    </span>
                    {f.official_uri && (
                      <a
                        href={f.official_uri}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-400 hover:text-slate-600 shrink-0"
                        title="Official standard link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {isOwasp && (
                    <div className="mb-2">
                      <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 tracking-wide uppercase">
                        2026 AGENTIC STANDARD
                      </span>
                    </div>
                  )}
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{f.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{f.description}</p>
                </div>
                <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 font-medium">
                  {f.issuing_body}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
          <strong>Framework Mapping Disclaimer:</strong> Cross-walking internal governance policies to international frameworks (e.g., NIST AI RMF, EU AI Act, ISO/IEC 42001, OECD AI, and OWASP Agentic Top 10 ASI-01–ASI-04) assists organizations in structuring audit evidence, evaluating tool-execution guardrails, and establishing assurance metrics. Framework mappings do not automatically confer official certification or guarantee statutory compliance.
        </div>

        {/* Controls Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">
              Mapped Governance Controls ({filteredControls.length})
              {selectedFramework !== "ALL" && (
                <span className="ml-2 text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {selectedFramework}
                </span>
              )}
            </h2>
            {selectedFramework !== "ALL" && (
              <button
                onClick={() => setSelectedFramework("ALL")}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {filteredControls.map((ctrl: any) => {
              const mapping = mappings.find((m: any) => m.framework_control_id === ctrl.id);
              return (
                <div key={ctrl.id} className="p-6 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {ctrl.control_code}
                      </span>
                      {ctrl.framework_code && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {ctrl.framework_code}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900">{ctrl.title}</span>
                    </div>
                    <div>
                      {mapping ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {mapping.implementation_status}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Control Cataloged
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{ctrl.description}</p>

                  {ctrl.guidance && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">Assurance Guidance:</span>
                      {ctrl.guidance}
                    </div>
                  )}

                  {mapping && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Control Owner: <strong className="text-slate-800">{mapping.control_owner}</strong></span>
                      <span>Assigned Requirement: <strong className="text-slate-800 font-mono">{mapping.requirement_id}</strong></span>
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

