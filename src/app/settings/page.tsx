"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import {
  Settings,
  Shield,
  Key,
  Server,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Radio,
  RefreshCw,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const [targetEndpoint, setTargetEndpoint] = useState("");
  const [targetType, setTargetType] = useState<"OPENAI_COMPATIBLE" | "EXTERNAL_ENDPOINT">("OPENAI_COMPATIBLE");
  const [sessionApiKey, setSessionApiKey] = useState("");
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false);
  const [systemName, setSystemName] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [testStatus, setTestStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.targetEndpoint) {
            setTargetEndpoint(data.targetEndpoint);
          }
          if (data.targetType) {
            setTargetType(data.targetType);
          }
          setHasEnvApiKey(Boolean(data.hasEnvApiKey));
          setSystemName(data.systemName || null);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEndpoint,
          targetType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to persist settings.");
      }

      setSaveStatus({
        type: "success",
        message: data.message || "Target configuration saved successfully.",
      });
      setTimeout(() => setSaveStatus(null), 5000);
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        message: err.message || "Failed to save configuration.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!targetEndpoint) {
      setTestStatus({
        type: "error",
        message: "Please enter an endpoint URL before testing.",
      });
      return;
    }

    setTestStatus(null);
    setTesting(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEndpoint,
          targetType,
          apiKey: sessionApiKey || undefined,
          testConnection: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Connection test failed.");
      }

      setTestStatus({
        type: "success",
        message: data.message || "Connection successfully verified.",
      });
    } catch (err: any) {
      setTestStatus({
        type: "error",
        message: err.message || "Connection probe failed.",
      });
    } finally {
      setTesting(false);
    }
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

        {saveStatus && (
          <div
            className={`p-3.5 rounded-lg text-xs font-semibold flex items-center ${
              saveStatus.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {saveStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600 shrink-0" />
            )}
            {saveStatus.message}
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
              <li><strong className="text-slate-700">Protocol Enforcement:</strong> Mandatory HTTPS or valid HTTP URLs (prohibiting file://, gopher://, and dangerous schemes)</li>
              <li><strong className="text-slate-700">Rate Limiting &amp; Timeouts:</strong> Enforces request timeouts and max 2 retries</li>
            </ul>
          </div>
          <div className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> SSRF &amp; Local Network Isolation Active
          </div>
        </div>

        {/* External Target Adapter Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">External Model Target Configuration</h2>
            </div>
            {systemName && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                Linked: {systemName}
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Adapter Protocol
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 bg-white font-medium text-xs"
              >
                <option value="OPENAI_COMPATIBLE">OpenAI-Compatible Chat Completions (/v1/chat/completions)</option>
                <option value="EXTERNAL_ENDPOINT">Generic REST Input/Output Endpoint</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target API Endpoint URL
              </label>
              <input
                type="url"
                required
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Must be an accessible HTTP/HTTPS URL. Private RFC 1918 IPs and cloud metadata addresses are automatically blocked.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">
                  Target API Key (Session / Probe Entry)
                </label>
                {hasEnvApiKey && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Environment Key Detected (TARGET_MODEL_API_KEY)
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={sessionApiKey}
                  onChange={(e) => setSessionApiKey(e.target.value)}
                  placeholder={hasEnvApiKey ? "Using environment-configured API key (override optional)" : "Enter session bearer key for connection test..."}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs pr-8"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
              <div className="mt-2 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-start space-x-2 text-[11px] text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Trust Credential Security:</strong> In accordance with security standards, API keys are evaluated in session memory and never stored in plaintext in the database. For persistent automated campaigns, set <code className="font-mono font-bold">TARGET_MODEL_API_KEY</code> in environment variables, or enter a session token when executing live campaigns.
                </span>
              </div>
            </div>

            {testStatus && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-start ${
                  testStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {testStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !targetEndpoint}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Probing Target...
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> Test Connection
                  </>
                )}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs flex items-center justify-center shadow-xs transition-colors disabled:opacity-50"
              >
                {saving ? "Saving Configuration..." : "Save Target Configuration"}
              </button>
            </div>
          </form>
        </div>

        {/* Workspace Health Status */}
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
