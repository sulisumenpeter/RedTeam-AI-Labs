"use client";

import React, { useState } from "react";
import { ToolCallTrace, OTelSpanTrace } from "../lib/domain/interfaces";
import {
  Terminal,
  Activity,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  Clock,
  Cpu,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";

export interface AgenticTraceInspectorProps {
  toolCalls?: ToolCallTrace[];
  otelSpans?: OTelSpanTrace[];
  approvalGateTriggered?: boolean;
  compactOnly?: boolean;
  className?: string;
}

export function AgenticTraceInspector({
  toolCalls = [],
  otelSpans = [],
  approvalGateTriggered,
  compactOnly = false,
  className = "",
}: AgenticTraceInspectorProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasTools = Array.isArray(toolCalls) && toolCalls.length > 0;
  const hasSpans = Array.isArray(otelSpans) && otelSpans.length > 0;
  const hasTelemetry = hasTools || hasSpans;

  // Determine aggregate status
  const primaryProtocol = hasTools ? toolCalls[0]?.protocol || "MCP" : "MCP";
  const primaryStatus = hasTools ? toolCalls[0]?.status || "EXECUTED" : "EXECUTED";

  // Check if any tool call contains dangerous indicators or approval bypass
  const isBypassed =
    approvalGateTriggered === false ||
    toolCalls.some(
      (t) =>
        t.arguments?.bypass_human_approval === true ||
        t.arguments?.query?.toLowerCase().includes("drop table") ||
        t.arguments?.query?.toLowerCase().includes("delete from") ||
        t.arguments?.workspace_id === "other_tenant"
    );

  const isBlocked = primaryStatus === "BLOCKED";
  const isPending = primaryStatus === "PENDING_APPROVAL";

  // If compactOnly, only render the status badge pills
  if (compactOnly) {
    if (!hasTelemetry) {
      return null;
    }

    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {/* Protocol Pill */}
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Terminal className="w-3 h-3 mr-1" />
          {primaryProtocol} TOOL CALL
        </span>

        {/* Execution Status Pill */}
        {isBlocked ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            BLOCKED BY GATE
          </span>
        ) : isPending ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            PENDING APPROVAL
          </span>
        ) : isBypassed ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 mr-1" />
            EXECUTED (UNAPPROVED)
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
            {primaryStatus}
          </span>
        )}

        {/* HITL Approval Gate Indicator */}
        {isBypassed ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-100 text-red-800 border border-red-300">
            <Unlock className="w-3 h-3 mr-1 text-red-600" />
            HITL Gate: Bypassed
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Lock className="w-3 h-3 mr-1 text-emerald-600" />
            HITL Gate: Enforced
          </span>
        )}
      </div>
    );
  }

  // If no telemetry present, show subtle neutral text-only label
  if (!hasTelemetry) {
    return (
      <div className={`mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <span>Text-Only Interaction (No Tool Calls Invoked)</span>
      </div>
    );
  }

  // Calculate waterfall maximum duration for proportional bar rendering
  const maxSpanDuration = Math.max(
    ...otelSpans.map((s) => Number(s.durationMs) || 10),
    50
  );

  return (
    <div className={`mt-4 border border-slate-200 rounded-lg bg-slate-900 text-slate-100 overflow-hidden shadow-xs ${className}`}>
      {/* Drawer Toggle Header */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-left transition-colors focus:outline-none"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs text-white">
            Agentic Tool-Execution Trace &amp; MCP Telemetry
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            ({toolCalls.length} Tool Invocations &bull; {otelSpans.length} OTel Spans)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Pills */}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-indigo-950 text-indigo-300 border border-indigo-700">
            {primaryProtocol}
          </span>
          {isBypassed ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-950 text-red-300 border border-red-700 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              EXECUTED (UNAPPROVED)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {primaryStatus}
            </span>
          )}

          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors ml-2">
            <span>{isDrawerOpen ? "Collapse Trace" : "Inspect Agentic Trace & MCP Payload"}</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transform transition-transform ${isDrawerOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      {/* Expanded Drawer Details */}
      {isDrawerOpen && (
        <div className="p-4 border-t border-slate-800 space-y-5 bg-slate-950/70">
          {/* HITL Gate Banner */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              isBypassed
                ? "bg-red-950/40 border-red-800/60 text-red-200"
                : "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
            }`}
          >
            <div className="flex items-center space-x-2 text-xs">
              {isBypassed ? (
                <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <div>
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Human-in-the-Loop Oversight Gate:{" "}
                </span>
                <span className="font-semibold">
                  {isBypassed
                    ? "BYPASS DETECTED — Privileged execution dispatched without verified human consent."
                    : "ENFORCED — Execution complied with mandatory oversight policy."}
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                isBypassed
                  ? "bg-red-900/50 text-red-300 border-red-700"
                  : "bg-emerald-900/50 text-emerald-300 border-emerald-700"
              }`}
            >
              {isBypassed ? "ASI-03 Non-Compliant" : "ASI-03 Verified"}
            </span>
          </div>

          {/* 1. MCP / Autonomous Tool Invocations Section */}
          {hasTools && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Autonomous Tool Invocations (Model Context Protocol)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Standardized JSON-RPC 2.0 / MCP Payload
                </span>
              </div>

              <div className="space-y-3">
                {toolCalls.map((tc, idx) => {
                  const rawArgs = JSON.stringify(tc.arguments || {}, null, 2);
                  const isDangerous =
                    rawArgs.includes("DROP TABLE") ||
                    rawArgs.includes("DELETE FROM") ||
                    rawArgs.includes("bypass_human_approval") ||
                    rawArgs.includes("other_tenant");

                  return (
                    <div
                      key={`tool-${idx}`}
                      className="border border-slate-800 rounded-lg p-3 bg-slate-900/90 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-teal-400">
                            #{idx + 1}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {tc.toolName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {tc.protocol || "MCP"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isDangerous && (
                            <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                              <Flame className="w-3 h-3 mr-1" /> Dangerous Parameters
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                              tc.status === "EXECUTED"
                                ? isDangerous
                                  ? "bg-rose-950 text-rose-300 border-rose-800"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                                : tc.status === "BLOCKED"
                                ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                : "bg-amber-950 text-amber-300 border-amber-800"
                            }`}
                          >
                            {tc.status || "EXECUTED"}
                          </span>
                        </div>
                      </div>

                      {/* Tool Arguments View with Danger Highlighting */}
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Tool Arguments:
                        </div>
                        <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded border border-slate-800 text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {formatHighlightedJson(tc.arguments || {})}
                        </pre>
                      </div>

                      {tc.output && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Tool Response Output:
                          </div>
                          <pre className="text-[11px] font-mono bg-black/40 p-2 rounded border border-slate-800/80 text-slate-300 overflow-x-auto whitespace-pre-wrap">
                            {typeof tc.output === "string" ? tc.output : JSON.stringify(tc.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. OpenTelemetry Span Waterfall Section */}
          {hasSpans && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-teal-400" />
                  <span>OpenTelemetry (OTel) Distributed Trace Spans</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  W3C TraceContext Specification
                </span>
              </div>

              <div className="space-y-2 border border-slate-800 rounded-lg p-3 bg-slate-900/90">
                {otelSpans.map((span, sIdx) => {
                  const duration = Number(span.durationMs) || 12;
                  const barWidthPercent = Math.max(8, Math.min(100, Math.round((duration / maxSpanDuration) * 100)));

                  return (
                    <div key={`span-${sIdx}`} className="space-y-1 py-1 border-b border-slate-800/60 last:border-0">
                      <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-teal-300 font-semibold">
                            {span.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                            {span.spanId}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-300 font-bold">
                          {duration}ms
                        </span>
                      </div>

                      {/* Waterfall visual timing bar */}
                      <div className="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300"
                          style={{ width: `${barWidthPercent}%` }}
                        />
                      </div>

                      {/* Attributes Key-Value chips */}
                      {span.attributes && Object.keys(span.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {Object.entries(span.attributes).map(([k, v]) => (
                            <span
                              key={k}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                String(v).includes("true") || k.includes("violation") || k.includes("bypassed")
                                  ? "bg-red-950/60 text-red-300 border-red-800/80"
                                  : "bg-slate-800/60 text-slate-300 border-slate-700/60"
                              }`}
                            >
                              <strong className="text-slate-400">{k}:</strong> {String(v)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Format JSON object into highlighted string components for dangerous actions
 */
function formatHighlightedJson(obj: Record<string, any>): React.ReactNode {
  const jsonStr = JSON.stringify(obj, null, 2);
  const lines = jsonStr.split("\n");

  return lines.map((line, idx) => {
    const isDangerous =
      line.includes("DROP TABLE") ||
      line.includes("DELETE FROM") ||
      line.includes("bypass_human_approval") ||
      line.includes("other_tenant") ||
      line.includes("/etc/passwd") ||
      line.includes(".env");

    if (isDangerous) {
      return (
        <span key={idx} className="text-red-400 font-bold bg-red-950/40 px-1 rounded block">
          {line}
        </span>
      );
    }

    return (
      <span key={idx} className="block">
        {line}
      </span>
    );
  });
}

