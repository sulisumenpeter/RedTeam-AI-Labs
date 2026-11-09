"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Server, Plus, Search, Shield, User, Bot, AlertCircle, ArrowUpRight, Cpu, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AISystemInventoryPage() {
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [businessOwner, setBusinessOwner] = useState("");
  const [technicalOwner, setTechnicalOwner] = useState("");
  const [aiProvider, setAiProvider] = useState("Google Cloud");
  const [modelName, setModelName] = useState("gemini-1.5-flash");
  const [modelVersion, setModelVersion] = useState("1.0");
  const [intendedPurpose, setIntendedPurpose] = useState("");
  const [riskClassification, setRiskClassification] = useState("HIGH");
  const [humanOversight, setHumanOversight] = useState("Human in the loop attorney sign-off required.");

  useEffect(() => {
    fetchSystems();
  }, []);

  async function fetchSystems() {
    try {
      const res = await fetch("/api/systems");
      const data = await res.json();
      setSystems(data.systems || []);
    } catch (err) {
      console.error("Failed to load AI systems:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: "a0000000-0000-0000-0000-000000000001",
          name,
          business_owner: businessOwner,
          technical_owner: technicalOwner,
          ai_provider: aiProvider,
          model_name: modelName,
          model_version: modelVersion,
          intended_purpose: intendedPurpose,
          risk_classification: riskClassification,
          human_oversight_arrangements: humanOversight,
          user_population: "Legal Clinic Staff & Public Tenants",
          deployment_environment: "PILOT",
          industry: "Legal Technology",
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchSystems();
      }
    } catch (err) {
      console.error("Error creating AI system:", err);
    }
  }

  const filteredSystems = systems.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.intended_purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.business_owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
              <Server className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Enterprise Asset Inventory
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI System Inventory</h1>
            <p className="text-sm text-slate-400 mt-1">
              Enterprise registry of all deployed and prototype AI models, MCP agents, risk classifications, and oversight mandates.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Register AI System
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search AI applications, owners, or models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs glass-panel text-white placeholder:text-slate-500 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
          />
        </div>

        {/* System Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading AI system inventory...</div>
        ) : filteredSystems.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 text-xs text-slate-400">
            No matching AI systems found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSystems.map((s) => (
              <div
                key={s.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-lg border border-white/20">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center">
                        {s.name}
                        {s.is_demo && (
                          <span className="ml-2.5 text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            LexHack Demo Target
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {s.ai_provider} &bull; Model: <span className="text-slate-200 font-mono">{s.model_name} ({s.model_version})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                        s.risk_classification === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : s.risk_classification === "UNACCEPTABLE"
                          ? "bg-crimson-500/20 text-crimson-300 border-crimson-500/30"
                          : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      }`}
                    >
                      EU AI Act: {s.risk_classification} RISK
                    </span>
                    <span className="text-xs px-2.5 py-1 glass-panel-subtle text-slate-300 border border-white/10 font-mono font-semibold rounded-full">
                      {s.deployment_environment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{s.intended_purpose}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10 text-xs">
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Business Owner</span>
                    <span className="text-white font-semibold mt-0.5 block">{s.business_owner}</span>
                  </div>
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Technical Owner</span>
                    <span className="text-white font-semibold mt-0.5 block">{s.technical_owner}</span>
                  </div>
                  <div className="p-3 glass-panel-subtle rounded-xl border border-white/5">
                    <span className="text-slate-400 block font-medium text-[10px] uppercase tracking-wider">Human Oversight</span>
                    <span className="text-white font-semibold mt-0.5 block">{s.human_oversight_arrangements}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href={`/campaigns/new?ai_system_id=${s.id}`}
                    className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 px-4 py-2 rounded-xl border border-crimson-400/30 shadow-md transition-all"
                  >
                    Execute Governance Assessment <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Registering System */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="glass-panel-elevated rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/15 space-y-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-white">Register New AI System</h2>
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="sys-name" className="block font-semibold text-slate-300 mb-1">System Name</label>
                  <input
                    id="sys-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Contract Risk Analyzer"
                    className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sys-business-owner" className="block font-semibold text-slate-300 mb-1">Business Owner</label>
                    <input
                      id="sys-business-owner"
                      type="text"
                      required
                      value={businessOwner}
                      onChange={(e) => setBusinessOwner(e.target.value)}
                      placeholder="e.g. Legal Operations"
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="sys-technical-owner" className="block font-semibold text-slate-300 mb-1">Technical Owner</label>
                    <input
                      id="sys-technical-owner"
                      type="text"
                      required
                      value={technicalOwner}
                      onChange={(e) => setTechnicalOwner(e.target.value)}
                      placeholder="e.g. AI Engineering"
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="sys-provider" className="block font-semibold text-slate-300 mb-1">AI Provider</label>
                    <input
                      id="sys-provider"
                      type="text"
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="sys-model" className="block font-semibold text-slate-300 mb-1">Model Name</label>
                    <input
                      id="sys-model"
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="sys-risk" className="block font-semibold text-slate-300 mb-1">Risk Tier</label>
                    <select
                      id="sys-risk"
                      value={riskClassification}
                      onChange={(e) => setRiskClassification(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 text-white border border-white/15 rounded-xl"
                    >
                      <option value="MINIMAL">MINIMAL</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="HIGH">HIGH</option>
                      <option value="UNACCEPTABLE">UNACCEPTABLE</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="sys-purpose" className="block font-semibold text-slate-300 mb-1">Intended Purpose</label>
                  <textarea
                    id="sys-purpose"
                    rows={2}
                    required
                    value={intendedPurpose}
                    onChange={(e) => setIntendedPurpose(e.target.value)}
                    placeholder="Describe specific use-case, user population, and decision role..."
                    className="w-full px-3 py-2 glass-panel text-white border border-white/15 rounded-xl"
                  />
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
                    Save &amp; Register
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
