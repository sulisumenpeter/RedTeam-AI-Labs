"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Server, Plus, Search, Shield, User, Bot, AlertCircle, ArrowUpRight } from "lucide-react";
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI System Inventory</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enterprise registry of all deployed and prototype AI models, risk classifications, and oversight mandates.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Register AI System
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search AI applications, owners, or models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 shadow-xs"
          />
        </div>

        {/* System Cards */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading AI system inventory...</div>
        ) : filteredSystems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
            No matching AI systems found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSystems.map((s) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center">
                        {s.name}
                        {s.is_demo && (
                          <span className="ml-2 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                            LexHack Demo Target
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-slate-500">
                        {s.ai_provider} &bull; Model: {s.model_name} ({s.model_version})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-bold border ${
                        s.risk_classification === "HIGH"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : s.risk_classification === "UNACCEPTABLE"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : "bg-sky-50 text-sky-800 border-sky-200"
                      }`}
                    >
                      EU AI Act: {s.risk_classification} RISK
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 font-semibold rounded">
                      {s.deployment_environment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{s.intended_purpose}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Business Owner</span>
                    <span className="text-slate-800 font-semibold">{s.business_owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Technical Owner</span>
                    <span className="text-slate-800 font-semibold">{s.technical_owner}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Human Oversight</span>
                    <span className="text-slate-800 font-semibold">{s.human_oversight_arrangements}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    href="/campaigns/new"
                    className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
                  >
                    Execute Governance Assessment <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Registering System */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Register New AI System</h2>
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">System Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Contract Risk Analyzer"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Business Owner</label>
                    <input
                      type="text"
                      required
                      value={businessOwner}
                      onChange={(e) => setBusinessOwner(e.target.value)}
                      placeholder="e.g. Legal Operations"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technical Owner</label>
                    <input
                      type="text"
                      required
                      value={technicalOwner}
                      onChange={(e) => setTechnicalOwner(e.target.value)}
                      placeholder="e.g. AI Engineering"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">AI Provider</label>
                    <input
                      type="text"
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Risk Tier</label>
                    <select
                      value={riskClassification}
                      onChange={(e) => setRiskClassification(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="MINIMAL">MINIMAL</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="HIGH">HIGH</option>
                      <option value="UNACCEPTABLE">UNACCEPTABLE</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Intended Purpose</label>
                  <textarea
                    rows={2}
                    required
                    value={intendedPurpose}
                    onChange={(e) => setIntendedPurpose(e.target.value)}
                    placeholder="Describe specific use-case, user population, and decision role..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
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

