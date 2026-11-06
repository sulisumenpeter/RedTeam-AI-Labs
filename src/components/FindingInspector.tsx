"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, PlusCircle } from "lucide-react";
import { ToolCallTrace, OTelSpanTrace } from "../lib/domain/interfaces";
import { AgenticTraceInspector } from "./AgenticTraceInspector";

export interface FindingData {
  id?: string;
  category: string;
  objective: string;
  attackInput?: string;
  attack_input?: string;
  targetOutput?: string;
  target_response?: string;
  evidence?: string;
  rationale: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "PASS" | string;
  pairedTargetOutput?: string;
  pairedAttackInput?: string;
  toolCalls?: ToolCallTrace[];
  tool_calls?: ToolCallTrace[];
  otelSpans?: OTelSpanTrace[];
  otel_spans?: OTelSpanTrace[];
  approvalGateTriggered?: boolean;
  approval_gate_triggered?: boolean;
}

export function FindingInspector({
  finding,
  onPromoteToIncident,
}: {
  finding: FindingData;
  onPromoteToIncident?: (finding: FindingData) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [incidentCreated, setIncidentCreated] = useState(false);

  const category = finding.category || "General Safety";
  const isBias = category.includes("Bias") || category.includes("Disparate");
  const isHallucination = category.includes("Hallucination");
  const attackInput = finding.attackInput || finding.attack_input || "";
  const targetOutput = finding.targetOutput || finding.target_response || finding.evidence || "";
  const severity = (finding.severity || "PASS").toUpperCase();

  const toolCalls = finding.toolCalls || finding.tool_calls;
  const otelSpans = finding.otelSpans || finding.otel_spans;
  const approvalGateTriggered = finding.approvalGateTriggered ?? finding.approval_gate_triggered;

  const handlePromote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPromoteToIncident) {
      onPromoteToIncident(finding);
      setIncidentCreated(true);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mb-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex flex-wrap justify-between items-center gap-2 transition-colors focus:outline-none"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <SeverityIcon severity={severity} />
          <div>
            <span className="font-semibold text-slate-900 text-sm">{category}</span>
            <span className="text-slate-500 text-xs ml-2">&bull; {finding.objective}</span>
          </div>
          <AgenticTraceInspector
            toolCalls={toolCalls}
            otelSpans={otelSpans}
            approvalGateTriggered={approvalGateTriggered}
            compactOnly
          />
        </div>
        <div className="flex items-center space-x-3">
          <SeverityBadge severity={severity} />
          {severity !== "PASS" && onPromoteToIncident && (
            <button
              onClick={handlePromote}
              disabled={incidentCreated}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                incidentCreated
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              {incidentCreated ? "Incident Created" : "+ Track Incident"}
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Assessor Policy Rationale
            </h4>
            <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3.5 rounded-lg leading-relaxed">
              {finding.rationale}
            </div>
          </div>

          {isBias ? (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Demographic Friction Differential (Paired Test Trace)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-red-200 bg-red-50/40 p-3.5 rounded-lg">
                  <div className="text-xs font-semibold text-red-900 mb-1">Low-Income Cohort (Disparate Demands)</div>
                  <pre className="text-xs bg-white text-slate-800 p-2.5 rounded border border-red-100 whitespace-pre-wrap font-mono">
                    {targetOutput || "Demanded 6 months bank statements, pay stubs, and character reference."}
                  </pre>
                </div>
                <div className="border border-emerald-200 bg-emerald-50/40 p-3.5 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-900 mb-1">Wealthy Baseline Cohort (Immediate Service)</div>
                  <pre className="text-xs bg-white text-slate-800 p-2.5 rounded border border-emerald-100 whitespace-pre-wrap font-mono">
                    {finding.pairedTargetOutput || "Thank you for reaching out. Your file is complete and we will expedite your request immediately."}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Adversarial Attack Input</h4>
                <pre className="text-xs bg-slate-50 text-slate-900 p-3 rounded-lg whitespace-pre-wrap font-mono border border-slate-200 h-full">
                  {attackInput || "N/A"}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Target AI Response</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg whitespace-pre-wrap font-mono h-full">
                  {targetOutput || "N/A"}
                </pre>
              </div>
            </div>
          )}

          {/* Agentic Tool-Execution Trace & MCP Inspector */}
          <AgenticTraceInspector
            toolCalls={toolCalls}
            otelSpans={otelSpans}
            approvalGateTriggered={approvalGateTriggered}
          />
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity.toUpperCase();
  if (s === "CRITICAL") {
    return <span className="bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded text-xs font-bold">CRITICAL</span>;
  }
  if (s === "HIGH") {
    return <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded text-xs font-bold">HIGH</span>;
  }
  if (s === "MEDIUM") {
    return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">MEDIUM</span>;
  }
  if (s === "LOW") {
    return <span className="bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-xs font-bold">LOW</span>;
  }
  return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">PASS</span>;
}

function SeverityIcon({ severity }: { severity: string }) {
  const s = severity.toUpperCase();
  if (s === "CRITICAL" || s === "HIGH") {
    return <ShieldAlert className="w-4 h-4 text-red-600" />;
  }
  if (s === "MEDIUM" || s === "LOW") {
    return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  }
  return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
}
