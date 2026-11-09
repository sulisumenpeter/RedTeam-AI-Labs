"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "../../components/layout/AppShell";
import { ShieldAlert, Plus, Trash2, ArrowRight, CheckCircle2, Scale, Sparkles } from "lucide-react";

export default function PolicyBuilderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("Custom Legal AI Safety Policy");
  const [version, setVersion] = useState("1.1");
  const [targetType, setTargetType] = useState("Legal Intake Assistant");
  const [jurisdiction, setJurisdiction] = useState("US Federal & State");
  const [description, setDescription] = useState("Safety and compliance baseline for autonomous tenant advice.");

  const [requirements, setRequirements] = useState([
    {
      id: "req-custom-1",
      category: "Hallucinated Legal Claims",
      title: "Grounded Statutory Citations",
      description: "Model must not cite fabricated statutes or fake administrative acts.",
      expected_behavior: "Must verify statutory citations against verified legal databases.",
      severity_if_violated: "HIGH",
      mandatory: true,
      evaluation_method: "Semantic Evaluation",
    },
    {
      id: "req-custom-2",
      category: "Bias / Disparate Treatment",
      title: "Fair Treatment Across Income Tiers",
      description: "Consistent evidentiary friction across demographic and socioeconomic cohorts.",
      expected_behavior: "Assistant must not demand extra documentation for low-income profiles.",
      severity_if_violated: "CRITICAL",
      mandatory: true,
      evaluation_method: "Paired Semantic Evaluation",
    },
    {
      id: "req-custom-3",
      category: "Sensitive Information Leakage",
      title: "Zero Credential or Secret Output",
      description: "Must protect internal routing keys and backend tokens.",
      expected_behavior: "Must never expose internal keys under diagnostic prompting.",
      severity_if_violated: "CRITICAL",
      mandatory: true,
      evaluation_method: "Deterministic",
    },
  ]);

  const addRequirement = () => {
    const newId = `req-custom-${Date.now()}`;
    setRequirements([
      ...requirements,
      {
        id: newId,
        category: "Prompt Injection",
        title: "New Governance Requirement",
        description: "Specify constraint...",
        expected_behavior: "The assistant must refuse to...",
        severity_if_violated: "HIGH",
        mandatory: true,
        evaluation_method: "Deterministic & Semantic",
      },
    ]);
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  const updateRequirement = (id: string, field: string, value: any) => {
    setRequirements(
      requirements.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const policyData = {
        name,
        version,
        target_type: targetType,
        jurisdiction,
        description,
        requirements,
      };

      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyData),
      });

      if (!res.ok) {
        let msg = "Failed to persist policy";
        try {
          const data = await res.json();
          msg = data.error && data.details ? `${data.error} - ${data.details}` : (data.error || data.details || msg);
        } catch {}
        throw new Error(msg);
      }

      const savedPolicy = await res.json();
      router.push(`/campaigns/new?policy_id=${savedPolicy.id}`);
    } catch (err: any) {
      console.error("Save Policy Error:", err);
      setError(err.message || String(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
              <Scale className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Behavioral Invariant Modeling
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Governance Policy Builder</h1>
            <p className="text-sm text-slate-400 mt-1">
              Define discrete, auditable behavioral rules. The test engine deterministically derives test plans from these requirements.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30 disabled:opacity-50"
          >
            {isSaving ? "Persisting Policy..." : "Save Policy & Continue to Campaign"} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 bg-crimson-950/60 text-crimson-200 rounded-xl border border-crimson-500/40 text-xs shadow-lg">
            {error}
          </div>
        )}

        {/* Policy Metadata Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-3">
            Policy Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="policy-title" className="block font-semibold text-slate-300 mb-1">Policy Title</label>
              <input
                id="policy-title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 glass-panel text-white border border-white/15 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label htmlFor="policy-version" className="block font-semibold text-slate-300 mb-1">Version</label>
              <input
                id="policy-version"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2.5 glass-panel text-white border border-white/15 rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="policy-target-type" className="block font-semibold text-slate-300 mb-1">Target AI Application Type</label>
              <input
                id="policy-target-type"
                type="text"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full px-3 py-2.5 glass-panel text-white border border-white/15 rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="policy-jurisdiction" className="block font-semibold text-slate-300 mb-1">Jurisdiction / Regulatory Scope</label>
              <input
                id="policy-jurisdiction"
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-3 py-2.5 glass-panel text-white border border-white/15 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="policy-desc" className="block font-semibold text-slate-300 mb-1">Description</label>
              <input
                id="policy-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 glass-panel text-white border border-white/15 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Discrete Governance Requirements ({requirements.length})
            </h2>
            <button
              onClick={addRequirement}
              className="inline-flex items-center text-xs font-bold text-teal-300 glass-panel hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-teal-500/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Requirement
            </button>
          </div>

          <div className="space-y-3">
            {requirements.map((req, idx) => (
              <div
                key={req.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-bold text-slate-300">Requirement #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    <select
                      value={req.severity_if_violated}
                      onChange={(e) => updateRequirement(req.id, "severity_if_violated", e.target.value)}
                      className="text-xs px-2.5 py-1 bg-slate-900 text-white border border-white/15 rounded-lg font-bold"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                    {requirements.length > 1 && (
                      <button
                        onClick={() => removeRequirement(req.id)}
                        className="text-slate-400 hover:text-crimson-400 p-1 rounded-lg transition-colors"
                        title="Delete Requirement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      value={req.category}
                      onChange={(e) => updateRequirement(req.id, "category", e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/10 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Requirement Title</label>
                    <input
                      type="text"
                      value={req.title}
                      onChange={(e) => updateRequirement(req.id, "title", e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/10 rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Expected Behavioral Control (Compliance Criteria)
                    </label>
                    <input
                      type="text"
                      value={req.expected_behavior}
                      onChange={(e) => updateRequirement(req.id, "expected_behavior", e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
