"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "../../../components/layout/AppShell";
import { FindingInspector, FindingData } from "../../../components/FindingInspector";
import { ReportExporter } from "../../../components/ReportExporter";
import { Play, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function CampaignDashboard({ params }: { params: { id: string } }) {
  const campaignId = params.id;
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "COMPLETED" | "ERROR">("IDLE");
  const [progress, setProgress] = useState(0);
  const [findings, setFindings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [campaignMeta, setCampaignMeta] = useState<any>({
    id: campaignId,
    name: "LexHack Legal AI Safety Audit",
    policy_version: "1.0",
    target_ai: "Synthetic Legal Intake Assistant",
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [incidentFeedback, setIncidentFeedback] = useState<string | null>(null);

  // If campaignId === "demo", initialize with demo findings immediately
  useEffect(() => {
    if (campaignId === "demo") {
      fetch(`/api/campaigns/demo/chunk`, {
        method: "POST",
        body: JSON.stringify({ batch_size: 30 }),
      })
        .then((r) => r.json())
        .then((data) => {
          setFindings(data.findings || []);
          setStatus("COMPLETED");
          setProgress(100);
        })
        .catch(() => {});
    }
  }, [campaignId]);

  // Explicit Execution approval trigger
  const runAssessment = async () => {
    setHasStarted(true);
    setStatus("RUNNING");
    setError(null);
    setProgress(0);

    let isCompleted = false;
    let completedCount = 0;
    const totalExpected = 30;

    try {
      while (!isCompleted && completedCount < totalExpected) {
        const chunkRes = await fetch(`/api/campaigns/${campaignId}/chunk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batch_size: 5 }),
        });

        if (!chunkRes.ok) {
          const errData = await chunkRes.json().catch(() => ({}));
          throw new Error(errData.error || "Chunk processing failed");
        }

        const chunkData = await chunkRes.json();

        if (chunkData.findings && chunkData.findings.length > 0) {
          setFindings((prev) => {
            const seen = new Set(prev.map((f) => f.attack_input || f.attackInput));
            const newOnes = chunkData.findings.filter((f: any) => !seen.has(f.attack_input || f.attackInput));
            return [...prev, ...newOnes];
          });
        }

        completedCount += chunkData.processed || 5;
        const currentProgress = Math.min(100, Math.round((completedCount / totalExpected) * 100));
        setProgress(currentProgress);

        if (chunkData.status === "COMPLETED" || completedCount >= totalExpected) {
          isCompleted = true;
          setStatus("COMPLETED");
          break;
        }

        // Brief delay between chunk batches to prevent overloading
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (err: any) {
      console.error("Campaign execution error:", err);
      setError(err.message || String(err));
      setStatus("ERROR");
    }
  };

  const handlePromoteToIncident = async (finding: FindingData) => {
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "INCIDENT_FROM_FINDING",
          data: {
            finding,
            workspace_id: "a0000000-0000-0000-0000-000000000001",
            ai_system_id: "b0000000-0000-0000-0000-000000000001",
          },
        }),
      });
      if (res.ok) {
        setIncidentFeedback(`Tracked incident created for '${finding.category}'`);
        setTimeout(() => setIncidentFeedback(null), 4000);
      }
    } catch (err) {
      console.error("Failed to promote finding to incident:", err);
    }
  };

  const hasCriticals = findings.some((f) => f.severity === "CRITICAL" || f.severity === "HIGH");

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Safety &amp; Assurance Assessment
              </h1>
              <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                ID: {campaignId.slice(0, 8)}...
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target: <strong className="text-slate-800">Synthetic Legal Intake Assistant</strong> &bull; Policy: <strong className="text-slate-800">Legal AI Responsible Use Policy v1.0</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {status !== "RUNNING" && (
              <button
                onClick={runAssessment}
                className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
              >
                {status === "COMPLETED" ? <RotateCcw className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {status === "COMPLETED" ? "Re-Run Assessment" : "Start 30-Test Execution"}
              </button>
            )}
            <ReportExporter
              campaignData={{
                ...campaignMeta,
                findings,
              }}
            />
          </div>
        </div>

        {incidentFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> {incidentFeedback}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Status / Progress Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Execution Status</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : status === "RUNNING"
                    ? "bg-teal-50 text-teal-700 border-teal-200 animate-pulse"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {status === "IDLE" ? "Awaiting Execution Approval" : status}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-700">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-2.5 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <div>
              <span>Safety Posture: </span>
              {status === "COMPLETED" ? (
                <span
                  className={`font-bold ${
                    hasCriticals ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  {hasCriticals ? "VULNERABLE (Deficiencies Found)" : "SECURE (Passed Baseline)"}
                </span>
              ) : (
                <span className="font-semibold text-slate-600">Pending Execution</span>
              )}
            </div>
            <div>
              <span>Evidence Findings Recorded: </span>
              <strong className="text-slate-800">{findings.length}</strong>
            </div>
          </div>
        </div>

        {/* Findings Inspection Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Assurance Findings &amp; Evidence ({findings.length})
            </h2>
            <span className="text-xs text-slate-400">
              Click any finding to inspect input, output, and policy rationale
            </span>
          </div>

          {status === "IDLE" && findings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
              <Sparkles className="w-8 h-8 text-teal-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Ready to Begin Assurance Campaign</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click &ldquo;Start 30-Test Execution&rdquo; above to stream chunked adversarial queries against the synthetic legal intake assistant.
              </p>
            </div>
          ) : findings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400 animate-pulse">
              Running chunked tests against target system...
            </div>
          ) : (
            <div>
              {findings.map((f, idx) => (
                <FindingInspector
                  key={f.id || `finding-${idx}`}
                  finding={f}
                  onPromoteToIncident={handlePromoteToIncident}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
