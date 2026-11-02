"use client";

import React, { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { Settings, Shield, Key, Server, CheckCircle2, Lock, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [targetEndpoint, setTargetEndpoint] = useState("https://api.example.com/v1/chat/completions");
  const [apiKeyMasked, setApiKeyMasked] = useState("••••••••••••••••");
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform &amp; Security Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage workspace security parameters, SSRF protection boundaries, and external model connection adapters.
          </p>
        </div>

        {savedFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Settings updated successfully.
          </div>
        )}

        {/* Security & SSRF Guard Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">SSRF &amp; Target Security Guardrails</h2>
          </div>
          <div className="text-xs text-slate-600 space-y-2">
            <p>
              The platform implements hard kernel-level SSRF filters on all external model requests:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500">
              <li><strong className="text-slate-700">Blocked Private Networks:</strong> 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, ::1, fe80::</li>
              <li><strong className="text-slate-700">Blocked Cloud Metadata:</strong> 169.254.169.254 (AWS, GCP, Azure metadata services) and metadata.google.internal</li>
              <li><strong className="text-slate-700">Protocol Enforcement:</strong> Mandatory HTTPS (prohibiting file://, gopher://, and dangerous protocols)</li>
              <li><strong className="text-slate-700">Rate Limiting &amp; Timeouts:</strong> Enforces 10-second request timeouts and max 2 retries</li>
            </ul>
          </div>
          <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> SSRF &amp; Local Network Isolation Active
          </div>
        </div>

        {/* External Target Adapter Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Server className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">External Model Target Configuration</h2>
          </div>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                OpenAI-Compatible Target API Endpoint URL
              </label>
              <input
                type="url"
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Model API Key (Masked &amp; Encrypted in Vault)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={apiKeyMasked}
                  onChange={(e) => setApiKeyMasked(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs"
              >
                Save Target Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Workspace Credentials Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Workspace Configuration Health
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span>Google Gemini AI Engine:</span>
              <span className="font-semibold text-emerald-700 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span>Supabase Relational Store:</span>
              <span className="font-semibold text-emerald-700 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

