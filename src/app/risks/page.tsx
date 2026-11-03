"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { AlertTriangle, Plus, ShieldCheck, Filter, ArrowRight, ShieldAlert } from "lucide-react";

export default function RiskManagementPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showModal, setShowModal] = useState(false);

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

  const filteredRisks =
    selectedCategory === "ALL" ? risks : risks.filter((r: any) => r.category === selectedCategory);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Risk Management</h1>
            <p className="text-sm text-slate-500 mt-1">
              Deterministic 5x5 Likelihood &times; Impact evaluation methodology, risk register, and mitigation tracking.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log AI Risk
          </button>
        </div>

        {/* 5x5 Risk Matrix & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visual Matrix */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Inherent Risk Matrix (5 &times; 5)</h2>
              <span className="text-[11px] text-slate-400 font-medium">Likelihood (Y) vs Impact (X)</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[5, 4, 3, 2, 1].map((l) => (
                <React.Fragment key={`row-${l}`}>
                  {[1, 2, 3, 4, 5].map((i) => {
                    const count = matrix[`${l}x${i}`] || 0;
                    const score = l * i;
                    let bgColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                    if (score >= 16) bgColor = "bg-red-100 text-red-900 border-red-300 font-bold";
                    else if (score >= 10) bgColor = "bg-orange-100 text-orange-900 border-orange-300 font-bold";
                    else if (score >= 5) bgColor = "bg-amber-50 text-amber-900 border-amber-200";

                    return (
                      <div
                        key={`${l}x${i}`}
                        className={`h-14 rounded flex flex-col items-center justify-center border transition-all ${bgColor}`}
                        title={`Likelihood: ${l}, Impact: ${i} (Score: ${score})`}
                      >
                        <span className="text-[10px] text-slate-500">{score}</span>
                        {count > 0 && (
                          <span className="text-xs font-extrabold mt-0.5 px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
                            {count}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-red-200 mr-1"></span> Critical (16-25)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-orange-200 mr-1"></span> High (10-15)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-amber-100 mr-1"></span> Medium (5-9)</span>
                <span className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-emerald-100 mr-1"></span> Low (1-4)</span>
              </div>
              <span className="font-semibold text-slate-700">Formula: Inherent Score = Likelihood &times; Impact</span>
            </div>
          </div>

          {/* Aggregate Index Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Portfolio Risk Posture
              </h3>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {data?.averageInherentScore || 16.8}
                <span className="text-sm font-semibold text-slate-400 ml-1">/ 25</span>
              </div>
              <div className="text-xs font-bold text-amber-600 mt-1">HIGH INHERENT RISK POSTURE</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Aggressive adversarial testing on unmitigated models reveals severe eviction counsel and routing key leakage vectors.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Residual Risk (After Controls):</span>
                <span className="font-bold text-teal-700">{data?.averageResidualScore || 2.8} / 25 (LOW)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Risks Cataloged:</span>
                <span className="font-bold text-slate-800">{risks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Controls Implementation:</span>
                <span className="font-bold text-emerald-600">80% Mitigating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filterable Risk Register */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">AI Risk Register</h2>
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Safety & Regulatory">Safety &amp; Regulatory</option>
                <option value="Bias & Discrimination">Bias &amp; Discrimination</option>
                <option value="Data Leakage">Data Leakage</option>
                <option value="Hallucination & Factual Accuracy">Hallucination &amp; Factual Accuracy</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredRisks.map((r: any) => (
              <div key={r.id} className="p-6 space-y-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{r.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-500 font-medium">
                      Inherent:{" "}
                      <strong className="text-red-700 font-bold">{r.inherent_score || r.inherent_likelihood * r.inherent_impact}</strong>
                    </span>
                    <span className="text-slate-300">&rarr;</span>
                    <span className="text-slate-500 font-medium">
                      Residual:{" "}
                      <strong className="text-teal-700 font-bold">{r.residual_score || r.residual_likelihood * r.residual_impact}</strong>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5">Mitigation Action Plan:</span>
                  <span className="text-slate-600">{r.mitigation_plan}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Assigned Risk Owner: <strong className="text-slate-700 font-semibold">{r.risk_owner}</strong></span>
                  <span>Target Date: <strong className="text-slate-700 font-semibold">{r.target_completion_date || "2026-11-20"}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Logging New Risk */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-slate-900">Log New AI Risk</h2>
              <form onSubmit={handleCreateRisk} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="risk-title" className="block font-semibold text-slate-700 mb-1">Risk Title</label>
                  <input
                    id="risk-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ungrounded Legal Advice"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-category" className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      id="risk-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                    <label htmlFor="risk-owner" className="block font-semibold text-slate-700 mb-1">Risk Owner</label>
                    <input
                      id="risk-owner"
                      type="text"
                      required
                      value={riskOwner}
                      onChange={(e) => setRiskOwner(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-inh-likelihood" className="block font-semibold text-slate-700 mb-1">Inherent Likelihood (1-5)</label>
                    <input
                      id="risk-inh-likelihood"
                      type="number"
                      min="1"
                      max="5"
                      value={inherentLikelihood}
                      onChange={(e) => setInherentLikelihood(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="risk-inh-impact" className="block font-semibold text-slate-700 mb-1">Inherent Impact (1-5)</label>
                    <input
                      id="risk-inh-impact"
                      type="number"
                      min="1"
                      max="5"
                      value={inherentImpact}
                      onChange={(e) => setInherentImpact(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="risk-desc" className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    id="risk-desc"
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label htmlFor="risk-plan" className="block font-semibold text-slate-700 mb-1">Mitigation Action Plan</label>
                  <textarea
                    id="risk-plan"
                    rows={2}
                    required
                    value={mitigationPlan}
                    onChange={(e) => setMitigationPlan(e.target.value)}
                    placeholder="Describe technical guardrails, semantic filters, or human oversight controls..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="risk-res-likelihood" className="block font-semibold text-slate-700 mb-1">Residual Likelihood (1-5)</label>
                    <input
                      id="risk-res-likelihood"
                      type="number"
                      min="1"
                      max="5"
                      value={residualLikelihood}
                      onChange={(e) => setResidualLikelihood(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="risk-res-impact" className="block font-semibold text-slate-700 mb-1">Residual Impact (1-5)</label>
                    <input
                      id="risk-res-impact"
                      type="number"
                      min="1"
                      max="5"
                      value={residualImpact}
                      onChange={(e) => setResidualImpact(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
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

