"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ArrowRight, ShieldAlert, Sparkles, Filter } from "lucide-react";

interface RiskEntry {
  id: string;
  title: string;
  category: string;
  inherent_l: number;
  inherent_i: number;
  residual_l: number;
  residual_i: number;
  status?: string;
  mitigation?: string;
}

const DEFAULT_SAMPLE_RISKS: RiskEntry[] = [
  {
    id: "r-1",
    title: "Unauthorized Practice of Law (UPL) via Hallucinated Eviction Advice",
    category: "Safety & Regulatory",
    inherent_l: 5,
    inherent_i: 5,
    residual_l: 2,
    residual_i: 2,
    status: "MITIGATING",
    mitigation: "Deterministic regex fence + attorney-in-the-loop sign-off enforcement.",
  },
  {
    id: "r-2",
    title: "Cross-Tenant BOLA via Tampered Workspace ID in MCP Database Query",
    category: "Access Control & Agentic",
    inherent_l: 4,
    inherent_i: 5,
    residual_l: 1,
    residual_i: 3,
    status: "MITIGATING",
    mitigation: "Strict kernel-level tenant context isolation in tool call executor.",
  },
  {
    id: "r-3",
    title: "Excessive Agency: Autonomous Execution of Destructive SQL Without Approval",
    category: "Inappropriate Tool Use",
    inherent_l: 4,
    inherent_i: 4,
    residual_l: 1,
    residual_i: 2,
    status: "RESOLVED",
    mitigation: "Runtime approval gate interceptor (approvalGateTriggered === true).",
  },
  {
    id: "r-4",
    title: "Disparate Documentation Friction on Low-Income Tenant Inquiries",
    category: "Bias & Fairness",
    inherent_l: 4,
    inherent_i: 3,
    residual_l: 1,
    residual_i: 2,
    status: "MITIGATING",
    mitigation: "Automated paired testing baseline comparing low-income vs wealthy personas.",
  },
  {
    id: "r-5",
    title: "Internal Telemetry Escalation Routing Key Leakage",
    category: "Security & Confidentiality",
    inherent_l: 3,
    inherent_i: 4,
    residual_l: 1,
    residual_i: 1,
    status: "RESOLVED",
    mitigation: "Regex secret scraper + SHA-256 automated redaction.",
  },
];

export function RiskHeatmapVisual({
  risks = DEFAULT_SAMPLE_RISKS,
  className = "",
}: {
  risks?: any[];
  className?: string;
}) {
  const [viewMode, setViewMode] = useState<"INHERENT" | "RESIDUAL">("INHERENT");
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>({ l: 5, i: 5 });

  const activeRisks: RiskEntry[] = risks.map((r) => ({
    id: r.id || `r-${Math.random()}`,
    title: r.title || "AI Safety Risk",
    category: r.category || "General Governance",
    inherent_l: Number(r.inherent_likelihood || r.inherent_l || 4),
    inherent_i: Number(r.inherent_impact || r.inherent_i || 4),
    residual_l: Number(r.residual_likelihood || r.residual_l || 2),
    residual_i: Number(r.residual_impact || r.residual_i || 2),
    status: r.status || "MITIGATING",
    mitigation: r.mitigation_plan || r.mitigation || "Enforced safety guardrails and regression fuzzing.",
  }));

  // Helper to get color of 5x5 cell
  const getCellColor = (score: number) => {
    if (score >= 15) return "bg-rose-500/25 border-rose-500/40 text-rose-300 hover:bg-rose-500/40";
    if (score >= 10) return "bg-orange-500/25 border-orange-500/40 text-orange-300 hover:bg-orange-500/40";
    if (score >= 5) return "bg-amber-500/25 border-amber-500/40 text-amber-300 hover:bg-amber-500/40";
    return "bg-emerald-500/25 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/40";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 15) return "bg-rose-500/20 text-rose-400 border-rose-500/40";
    if (score >= 10) return "bg-orange-500/20 text-orange-400 border-orange-500/40";
    if (score >= 5) return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  };

  // Compute metrics
  const totalRisks = activeRisks.length;
  const avgInherent = (
    activeRisks.reduce((acc, r) => acc + r.inherent_l * r.inherent_i, 0) / (totalRisks || 1)
  ).toFixed(1);
  const avgResidual = (
    activeRisks.reduce((acc, r) => acc + r.residual_l * r.residual_i, 0) / (totalRisks || 1)
  ).toFixed(1);
  const reductionPct = Math.round(
    ((Number(avgInherent) - Number(avgResidual)) / (Number(avgInherent) || 1)) * 100
  );

  // Filter risks at selected cell
  const cellRisks = selectedCell
    ? activeRisks.filter((r) =>
        viewMode === "INHERENT"
          ? r.inherent_l === selectedCell.l && r.inherent_i === selectedCell.i
          : r.residual_l === selectedCell.l && r.residual_i === selectedCell.i
      )
    : [];

  return (
    <div className={`glass-panel-elevated rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden ${className}`}>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-mono font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            QUANTITATIVE RISK ENGINE &bull; 5 &times; 5 MATRIX
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-100">
            Empirical Risk Quantification &amp; Mitigation Heatmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Mathematical Likelihood (1-5) &times; Impact (1-5) scoring. Observe how verified corrective guardrails reduce inherent exposure to defensible residual baselines.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("INHERENT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "INHERENT"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Inherent Risk ({avgInherent}/25)
          </button>
          <button
            onClick={() => setViewMode("RESIDUAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "RESIDUAL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Residual Risk ({avgResidual}/25)
          </button>
        </div>
      </div>

      {/* Metric summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5">
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Active Risks</span>
          <span className="text-lg font-bold text-slate-100 font-mono">{totalRisks} Logged</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Inherent Exposure</span>
          <span className="text-lg font-bold text-rose-400 font-mono">{avgInherent} / 25</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Residual Baseline</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{avgResidual} / 25</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono uppercase block">Risk Reduction</span>
          <span className="text-lg font-bold text-teal-300 font-mono">-{reductionPct}% Exposure</span>
        </div>
      </div>

      {/* 2-Column: 5x5 Heatmap Grid + Selected Cell Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Heatmap Grid */}
        <div className="lg:col-span-7 bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Y-Axis: Likelihood (1-5)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>X-Axis: Impact (1-5)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </span>
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((l) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-5 text-[11px] font-mono font-bold text-slate-500 text-right shrink-0">
                  L{l}
                </span>
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const score = l * i;
                    const count = activeRisks.filter((r) =>
                      viewMode === "INHERENT"
                        ? r.inherent_l === l && r.inherent_i === i
                        : r.residual_l === l && r.residual_i === i
                    ).length;

                    const isSelected = selectedCell?.l === l && selectedCell?.i === i;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedCell({ l, i })}
                        className={`h-11 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all relative ${getCellColor(
                          score
                        )} ${
                          isSelected
                            ? "ring-2 ring-white scale-105 shadow-lg z-10"
                            : "hover:scale-[1.02]"
                        }`}
                      >
                        <span className="text-[10px] text-slate-300/80 leading-none">{score}</span>
                        {count > 0 && (
                          <span className="w-4 h-4 rounded-full bg-white text-slate-950 text-[10px] font-extrabold flex items-center justify-center mt-0.5 shadow-sm">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
            <span>Score Tiers: 1-4 Low &bull; 5-9 Medium &bull; 10-14 High &bull; 15-25 Critical</span>
            <span>Click any cell to inspect</span>
          </div>
        </div>

        {/* Selected Cell Inspector */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Cell: L{selectedCell?.l || 0} &times; I{selectedCell?.i || 0}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreBadge(
                    (selectedCell?.l || 0) * (selectedCell?.i || 0)
                  )}`}
                >
                  Score: {(selectedCell?.l || 0) * (selectedCell?.i || 0)}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{cellRisks.length} Mapped</span>
            </div>

            <div className="pt-3 space-y-3 max-h-72 overflow-y-auto">
              {cellRisks.length > 0 ? (
                cellRisks.map((cr) => (
                  <div key={cr.id} className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 leading-snug">{cr.title}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {cr.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{cr.category}</div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-teal-300 font-mono">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Mitigation Path:</span>
                      {cr.mitigation}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-500 text-xs">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  No risks logged at coordinate (L{selectedCell?.l}, I{selectedCell?.i}) in {viewMode.toLowerCase()} mode.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Verified 5x5 Deterministic Engine</span>
            <span className="text-teal-400 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" />
              Continuous Governance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

