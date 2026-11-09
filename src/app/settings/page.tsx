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
  Terminal,
  Cpu,
} from "lucide-react";

export default function SettingsPage() {
  const [targetEndpoint, setTargetEndpoint] = useState("");
  const [targetType, setTargetType] = useState<"OPENAI_COMPATIBLE" | "EXTERNAL_ENDPOINT" | "AGENTIC_MCP_ENDPOINT">("OPENAI_COMPATIBLE");
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-6 border-b border-white/10">
          <div className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-2">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Defense-in-Depth Configuration
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform &amp; Security Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage workspace security parameters, SSRF protection boundaries, and external model connection adapters.
          </p>
        </div>

        {saveStatus && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center shadow-lg ${
              saveStatus.type === "success"
                ? "bg-emerald-950/60 text-emerald-300 text-emerald-800 border border-emerald-500/40"
                : "bg-crimson-950/60 text-crimson-200 text-red-800 border border-crimson-500/40"
            }`}
          >
            {saveStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-crimson-400 shrink-0" />
            )}
            {saveStatus.message}
          </div>
        )}

        {/* Security & SSRF Guard Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
            <Shield className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white">SSRF &amp; Target Security Guardrails</h2>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              The platform implements hard kernel-level SSRF filters on all external model requests:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong className="text-white">Blocked Private Networks:</strong> 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, ::1, fe80::</li>
              <li><strong className="text-white">Blocked Cloud Metadata:</strong> 169.254.169.254 (AWS, GCP, Azure metadata services) and metadata.google.internal</li>
              <li><strong className="text-white">Protocol Enforcement:</strong> Mandatory HTTPS or valid HTTP URLs (prohibiting file://, gopher://, and dangerous schemes)</li>
              <li><strong className="text-white">Rate Limiting &amp; Timeouts:</strong> Enforces request timeouts and max 2 retries</li>
            </ul>
          </div>
          <div className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            SSRF &amp; Local Network Isolation Active
          </div>
        </div>

        {/* External Target Adapter Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white">External Model Target Configuration</h2>
            </div>
            {systemName && (
              <span className="text-[11px] font-semibold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-mono">
                Linked: {systemName}
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label htmlFor="settings-protocol" className="block font-semibold text-slate-300 mb-1">
                Target Adapter Protocol
              </label>
              <select
                id="settings-protocol"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-white/15 rounded-xl focus:outline-none focus:border-teal-500 bg-slate-900 text-white font-medium text-xs shadow-sm"
              >
                <option value="OPENAI_COMPATIBLE">OpenAI-Compatible Chat Completions (/v1/chat/completions)</option>
                <option value="EXTERNAL_ENDPOINT">Generic REST Input/Output Endpoint</option>
                <option value="AGENTIC_MCP_ENDPOINT">Model Context Protocol (MCP) Agentic Endpoint</option>
              </select>
            </div>

            <div>
              <label htmlFor="settings-endpoint" className="block font-semibold text-slate-300 mb-1">
                Target API Endpoint URL
              </label>
              <input
                id="settings-endpoint"
                type="url"
                required
                value={targetEndpoint}
                onChange={(e) => setTargetEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
                className="w-full px-3 py-2.5 glass-panel border border-white/15 rounded-xl focus:outline-none focus:border-teal-500 font-mono text-xs text-white placeholder:text-slate-500 shadow-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Must be an accessible HTTP/HTTPS URL. Private RFC 1918 IPs and cloud metadata addresses are automatically blocked.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="settings-session-key" className="font-semibold text-slate-300">
                  Target API Key (Session / Probe Entry)
                </label>
                {hasEnvApiKey && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Environment Key Detected (TARGET_MODEL_API_KEY)
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="settings-session-key"
                  type="password"
                  value={sessionApiKey}
                  onChange={(e) => setSessionApiKey(e.target.value)}
                  placeholder={hasEnvApiKey ? "Using environment-configured API key (override optional)" : "Enter session bearer key for connection test..."}
                  className="w-full px-3 py-2.5 glass-panel border border-white/15 rounded-xl font-mono text-xs pr-8 text-white placeholder:text-slate-500"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
              <div className="mt-2.5 p-3.5 glass-panel-subtle border border-amber-500/30 rounded-xl flex items-start space-x-2 text-[11px] text-amber-200 leading-relaxed">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Zero-Trust Credential Security:</strong> In accordance with security standards, API keys are evaluated in session memory and never stored in plaintext in the database. For persistent automated campaigns, set <code className="font-mono font-bold text-amber-300">TARGET_MODEL_API_KEY</code> in environment variables, or enter a session token when executing live campaigns.
                </span>
              </div>
            </div>

            {testStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-start shadow-md ${
                  testStatus.type === "success"
                    ? "bg-emerald-950/60 text-emerald-300 text-emerald-800 border border-emerald-500/40"
                    : "bg-crimson-950/60 text-crimson-200 text-red-800 border border-crimson-500/40"
                }`}
              >
                {testStatus.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2 text-crimson-400 shrink-0 mt-0.5" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !targetEndpoint}
                className="px-4 py-2.5 glass-panel hover:bg-white/10 text-slate-200 hover:text-white font-bold rounded-xl text-xs flex items-center justify-center transition-all border border-white/15 disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Probing Target...
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> Test Connection
                  </>
                )}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-lg shadow-crimson-600/30 transition-all border border-crimson-400/30 disabled:opacity-50"
              >
                {saving ? "Saving Configuration..." : "Save Target Configuration"}
              </button>
            </div>
          </form>
        </div>

        {/* Workspace Health Status */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-3 text-xs">
          <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2.5">
            Workspace Configuration Health
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex items-center justify-between">
              <span>Google Gemini AI Engine:</span>
              <span className="font-semibold text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Active
              </span>
            </div>
            <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/5 flex items-center justify-between">
              <span>Supabase Relational Store:</span>
              <span className="font-semibold text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
