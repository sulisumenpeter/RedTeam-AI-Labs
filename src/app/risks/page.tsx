"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { AlertTriangle, Plus, ShieldCheck, Filter, ArrowRight, ShieldAlert, Sparkles, TrendingDown, CheckCircle2 } from "lucide-react";

export default function RiskManagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);
  const [matrixMode, setMatrixMode] = useState<"INHERENT" | "RESIDUAL">("INHERENT");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Safety & Regulatory");
  const [description, setDescription] = useState("");
  const [riskOwner, setRiskOwner] = useState("Elena Rostova");
  const [inherentLikelihood, setInherentLikelihood] = useState(4);
  const [inherentImpact, setInherentImpact] = useState(4);
  const [mitigationPlan, setMitigationPlan] = useState("");
  const [residualLikelihood, setResidualLikelihood] = useState(2);
  const [residualImpact, setResidualImpact] = useState(2);

  useEffect(() => {
    fetchRisks();
  }, []);

  async function fetchRisks() {
    try {
      const res = await fetch("/api/risks");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load risks:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRisk(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: "a0000000-0000-0000-0000-000000000001",
          ai_system_id: "b0000000-0000-0000-0000-000000000001",
          title,
          category,
          description,
          risk_owner: riskOwner,
          inherent_likelihood: Number(inherentLikelihood),
          inherent_impact: Number(inherentImpact),
          mitigation_plan: mitigationPlan,
          residual_likelihood: Number(residualLikelihood),
          residual_impact: Number(residualImpact),
          status: "MITIGATING",
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchRisks();
      }
    } catch (err) {
      console.error("Error creating risk:", err);
    }
  }

  const risks = data?.risks || [];
  const matrix = data?.matrix || {};

  // Compute residual matrix from risks if needed
  const residualMatrix: Record<string, number> = {};
  for (const r of risks) {
    const rl = r.residual_likelihood || 2;
    const ri = r.residual_impact || 2;
    const key = `${rl}x${ri}`;
    residualMatrix[key] = (residualMatrix[key] || 0) + 1;
  }

  const activeMatrix = matrixMode === "INHERENT" ? matrix : residualMatrix;

  const filteredRisks =
    selectedCategory === "ALL" ? risks : risks.filter((r: any) => r.category === selectedCategory);

  const avgInherent = data?.averageInherentScore || 16.8;
  const avgResidual = data?.averageResidualScore || 2.8;
  const reductionDelta = Math.round(((avgInherent - avgResidual) / (avgInherent || 1)) * 100);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Quantitative Risk Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Risk Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic 5&times;5 Likelihood &times; Impact evaluation methodology, risk register, and mitigation tracking.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log AI Risk
          </button>
        </div>

        {/* 5x5 Risk Matrix & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visual Matrix */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>5 &times; 5 Likelihood &times; Impact Matrix</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                    {matrixMode}
                  </span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Likelihood (Y-axis 5 to 1) &bull; Impact (X-axis 1 to 5)</span>
              </div>
              <div className="flex items-center p-1 glass-panel-subtle rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setMatrixMode("INHERENT")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    matrixMode === "INHERENT" ? "bg-crimson-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Inherent
                </button>
                <button
                  type="button"
                  onClick={() => setMatrixMode("RESIDUAL")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    matrixMode === "RESIDUAL" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Residual
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={`row-${l}`}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const count = activeMatrix[`${l}x${i}`] || 0;
                    const score = l * i;
                    let cellStyle = "bg-emerald-950/40 text-emerald-300 border-emerald-500/20";
                    if (score >= 16) cellStyle = "bg-crimson-950/70 text-crimson-200 border-crimson-500/40 font-bold";
                    else if (score >= 10) cellStyle = "bg-amber-950/60 text-amber-200 border-amber-500/30 font-bold";
                    else if (score >= 5) cellStyle = "bg-yellow-950/40 text-yellow-200 border-yellow-500/20";

                    return (
                      <div
                        key={`${l}x${i}`}
                        className={`h-14 rounded-xl flex flex-col items-center justify-center border transition-all ${cellStyle} hover:scale-105`}
                        title={`Likelihood: ${l}, Impact: ${i} (Score: ${score})`}
                      >
                        <span className="text-[10px] text-slate-400 font-mono">{score}</span>
                        {count > 0 && (
                          <span className="text-xs font-black mt-0.5 px-2 py-0.5 rounded-full bg-white text-slate-950 shadow-md">
                            {count}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/10 gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-crimson-500 mr-1.5"></span> Critical (16-25)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> High (10-15)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></span> Medium (5-9)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Low (1-4)</span>
              </div>
              <span className="font-mono text-teal-400 text-[10px]">Score = Likelihood &times; Impact</span>
            </div>
          </div>

          {/* Aggregate Index Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Portfolio Risk Posture
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-crimson-500/20 text-crimson-300 border border-crimson-500/30">
                  HIGH INHERENT
                </span>
              </div>
              <div className="text-4xl font-black text-white tracking-tight mt-3">
                {avgInherent}
                <span className="text-sm font-semibold text-slate-400 ml-1.5">/ 25</span>
              </div>
              <div className="inline-flex items-center text-xs font-bold text-teal-400 mt-2">
                <TrendingDown className="w-4 h-4 mr-1 text-teal-400" />
                <span>-{reductionDelta}% Risk Reduction Post-Mitigation</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Adversarial fuzzing exposes severe eviction counsel, UPL, and tool parameter poisoning vectors prior to guardrail activation.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2.5 glass-panel-subtle rounded-xl border border-white/5">
                <span className="text-slate-400">Residual Risk Index:</span>
                <span className="font-bold text-teal-300 font-mono">{avgResidual} / 25 (LOW)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 glass-panel-subtle rounded-xl border border-white/5">
                <span className="text-slate-400">Cataloged Risks:</span>
                <span className="font-bold text-white font-mono">{risks.length} Vectors</span>
              </div>
              <div className="flex justify-between items-center p-2.5 glass-panel-subtle rounded-xl border border-white/5">
                <span className="text-slate-400">Controls Implementation:</span>
                <span className="font-bold text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 80% Mitigating
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filterable Risk Register */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5">
            <h2 className="text-base font-bold text-white">AI Risk Register</h2>
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-panel text-white border border-white/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Safety & Regulatory">Safety &amp; Regulatory</option>
                <option value="Bias & Discrimination">Bias &amp; Discrimination</option>
                <option value="Data Leakage">Data Leakage</option>
                <option value="Hallucination & Factual Accuracy">Hallucination &amp; Factual Accuracy</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredRisks.map((r: any) => (
              <div key={r.id} className="p-6 space-y-3 hover:bg-white/5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-sm font-bold text-white">{r.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold border border-white/10">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400 font-medium">
                      Inherent:{" "}
                      <strong className="text-crimson-400 font-bold font-mono">{r.inherent_score || r.inherent_likelihood * r.inherent_impact}</strong>
                    </span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-slate-400 font-medium">
                      Residual:{" "}
                      <strong className="text-teal-400 font-bold font-mono">{r.residual_score || r.residual_likelihood * r.residual_impact}</strong>
                    </span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>

                <div className="glass-panel-subtle p-3 rounded-xl border border-white/5 text-xs">
                  <span className="font-semibold text-slate-300 block mb-0.5">Mitigation Action Plan:</span>
                  <span className="text-slate-400">{r.mitigation_plan}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Assigned Risk Owner: <strong className="text-slate-200 font-semibold">{r.risk_owner}</strong></span>
                  <span>Target Date: <strong className="text-slate-200 font-semibold font-mono">{r.target_completion_date || "2026-11-20"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Logging New Risk */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass-panel-elevated rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/15 space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-white">Log New AI Risk</h2>
              <form onSubmit={handleCreateRisk} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="risk-title" className="block font-semibold text-slate-300 mb-1">Risk Title</label>
                  <input
                    id="risk-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ungrounded Legal Advice"
                    className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-category" className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      id="risk-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 text-white border border-white/15 rounded-xl"
                    >
                      <option value="Safety & Regulatory">Safety &amp; Regulatory</option>
                      <option value="Bias & Discrimination">Bias &amp; Discrimination</option>
                      <option value="Data Leakage">Data Leakage</option>
                      <option value="Hallucination & Factual Accuracy">Hallucination &amp; Factual Accuracy</option>
                      <option value="Prompt Injection">Prompt Injection</option>
                      <option value="Security Vulnerabilities">Security Vulnerabilities</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="risk-owner" className="block font-semibold text-slate-300 mb-1">Risk Owner</label>
                    <input
                      id="risk-owner"
                      type="text"
                      required
                      value={riskOwner}
                      onChange={(e) => setRiskOwner(e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-inh-likelihood" className="block font-semibold text-slate-300 mb-1">Inherent Likelihood (1-5)</label>
                    <input
                      id="risk-inh-likelihood"
                      type="number"
                      min="1"
                      max="5"
                      value={inherentLikelihood}
                      onChange={(e) => setInherentLikelihood(Number(e.target.value))}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="risk-inh-impact" className="block font-semibold text-slate-300 mb-1">Inherent Impact (1-5)</label>
                    <input
                      id="risk-inh-impact"
                      type="number"
                      min="1"
                      max="5"
                      value={inherentImpact}
                      onChange={(e) => setInherentImpact(Number(e.target.value))}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="risk-desc" className="block font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    id="risk-desc"
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                  />
                </div>

                <div>
                  <label htmlFor="risk-plan" className="block font-semibold text-slate-300 mb-1">Mitigation Action Plan</label>
                  <textarea
                    id="risk-plan"
                    rows={2}
                    required
                    value={mitigationPlan}
                    onChange={(e) => setMitigationPlan(e.target.value)}
                    placeholder="Describe technical guardrails, semantic filters, or human oversight controls..."
                    className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-res-likelihood" className="block font-semibold text-slate-300 mb-1">Residual Likelihood (1-5)</label>
                    <input
                      id="risk-res-likelihood"
                      type="number"
                      min="1"
                      max="5"
                      value={residualLikelihood}
                      onChange={(e) => setResidualLikelihood(Number(e.target.value))}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="risk-res-impact" className="block font-semibold text-slate-300 mb-1">Residual Impact (1-5)</label>
                    <input
                      id="risk-res-impact"
                      type="number"
                      min="1"
                      max="5"
                      value={residualImpact}
                      onChange={(e) => setResidualImpact(Number(e.target.value))}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white font-medium border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white font-bold border border-crimson-400/30 shadow-md"
                  >
                    Record Risk
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
