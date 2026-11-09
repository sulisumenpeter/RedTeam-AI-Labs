"use client";

import React, { useState } from "react";
import { ShieldCheck, ExternalLink, CheckCircle2, Scale, BookOpen, Layers } from "lucide-react";

interface FrameworkItem {
  code: string;
  name: string;
  issuingBody: string;
  badge?: string;
  controlsCount: number;
  implementedCount: number;
  keyControls: string[];
  officialUri: string;
}

const FRAMEWORKS: FrameworkItem[] = [
  {
    code: "NIST_AI_RMF",
    name: "NIST AI Risk Management Framework 1.0",
    issuingBody: "National Institute of Standards and Technology (USA)",
    controlsCount: 4,
    implementedCount: 4,
    keyControls: ["GOVERN-1.1", "MAP-1.1", "MEASURE-2.6", "MANAGE-2.4"],
    officialUri: "https://www.nist.gov/itl/ai-risk-management-framework",
  },
  {
    code: "EU_AI_ACT",
    name: "EU Artificial Intelligence Act (Regulation 2024/1689)",
    issuingBody: "European Union / European Parliament",
    badge: "MANDATORY HIGH-RISK",
    controlsCount: 3,
    implementedCount: 3,
    keyControls: ["Article-9 (Risk Management)", "Article-13 (Transparency)", "Article-14 (Human Oversight)"],
    officialUri: "https://artificialintelligenceact.eu/",
  },
  {
    code: "ISO_42001",
    name: "ISO/IEC 42001:2023 AI Management System",
    issuingBody: "International Organization for Standardization",
    controlsCount: 2,
    implementedCount: 2,
    keyControls: ["A.6.1 (Impact Assessment)", "A.8.4 (Robustness & Security)"],
    officialUri: "https://www.iso.org/standard/81230.html",
  },
  {
    code: "OECD_AI",
    name: "OECD Recommendation on AI Principles",
    issuingBody: "Organization for Economic Co-operation and Development",
    controlsCount: 3,
    implementedCount: 3,
    keyControls: ["Principle-1.2 (Fairness)", "Principle-1.3 (Transparency)", "Principle-1.4 (Robustness)"],
    officialUri: "https://oecd.ai/en/dashboards/ai-principles",
  },
  {
    code: "OWASP_AGENTIC_TOP_10",
    name: "OWASP Top 10 for Agentic AI",
    issuingBody: "OWASP Foundation",
    badge: "2026 AGENTIC STANDARD",
    controlsCount: 4,
    implementedCount: 4,
    keyControls: ["ASI-01 (Goal Hijack)", "ASI-02 (Tool Abuse)", "ASI-03 (Broken HITL)", "ASI-04 (BOLA)"],
    officialUri: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
  },
];

export function FrameworkRadarVisual({ className = "" }: { className?: string }) {
  const [selectedFw, setSelectedFw] = useState<string>("OWASP_AGENTIC_TOP_10");

  const current = FRAMEWORKS.find((f) => f.code === selectedFw) || FRAMEWORKS[4];

  return (
    <div className={`glass-panel-elevated rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-xs font-mono font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            STATUTORY CROSS-WALK &bull; 5 INTERNATIONAL STANDARDS
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-100">
            Harmonized Governance Control Mapping
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            16 mapped technical controls cross-walked across US, EU, and global standards to generate unified, board-ready audit evidence.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-teal-400">16 / 16</span>
          <span className="text-xs text-slate-400 block font-mono">Controls Implemented</span>
        </div>
      </div>

      {/* Framework Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 py-6">
        {FRAMEWORKS.map((f) => {
          const isSelected = selectedFw === f.code;
          return (
            <button
              key={f.code}
              onClick={() => setSelectedFw(f.code)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800/90 border-teal-500 shadow-glow-teal ring-1 ring-teal-500/40"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {f.code}
                  </span>
                  {f.badge && (
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                      {f.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-2 mt-1">{f.name}</div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">{f.controlsCount} Controls</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> 100%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Framework Deep-Dive */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 font-mono">{current.code}</span>
            <span className="text-xs text-slate-400">&bull; {current.issuingBody}</span>
          </div>
          <div className="text-sm font-bold text-slate-200">{current.name}</div>
          <div className="flex flex-wrap gap-2 pt-1">
            {current.keyControls.map((ctrl, i) => (
              <span
                key={i}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center"
              >
                <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" />
                {ctrl}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={current.officialUri}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>Official Standard</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

