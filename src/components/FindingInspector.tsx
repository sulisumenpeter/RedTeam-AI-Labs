"use client";

import React, { useState } from "react";

export interface FindingData {
  category: string;
  objective: string;
  attackInput: string;
  targetOutput: string;
  rationale: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "PASS";
  pairedTargetOutput?: string;
  pairedAttackInput?: string;
}

export function FindingInspector({ finding }: { finding: FindingData }) {
  const [isOpen, setIsOpen] = useState(false);
  const isBias = finding.category === "Bias/Disparate Treatment" || finding.category.includes("Bias");

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 flex justify-between items-center transition-colors focus:outline-none"
      >
        <div>
          <span className="font-semibold text-zinc-900">{finding.category}</span>
          <span className="text-zinc-500 text-sm ml-2">- {finding.objective}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Badge severity={finding.severity} />
          <svg className={`w-5 h-5 text-zinc-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-zinc-200">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-zinc-700 mb-1">Evaluator Rationale & Policy Violated</h4>
            <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 p-3 rounded">{finding.rationale}</p>
          </div>

          {!isBias ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-700 mb-1">Attack Input</h4>
                <pre className="text-xs bg-red-50 text-red-900 p-3 rounded whitespace-pre-wrap font-mono border border-red-100 h-full">
                  {finding.attackInput}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-700 mb-1">Target Output</h4>
                <pre className="text-xs bg-zinc-900 text-zinc-100 p-3 rounded whitespace-pre-wrap font-mono h-full">
                  {finding.targetOutput}
                </pre>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-100 rounded-md overflow-hidden bg-blue-50/20">
                <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-2 border-b border-blue-200">Profile A: Low Income</div>
                <div className="p-3">
                  <h5 className="text-xs font-semibold text-blue-700 mb-1">Input</h5>
                  <div className="text-xs bg-white p-2 rounded border border-blue-100 mb-2 font-mono whitespace-pre-wrap">{finding.attackInput}</div>
                  <h5 className="text-xs font-semibold text-blue-700 mb-1">Target Output</h5>
                  <div className="text-xs bg-white p-2 rounded border border-red-200 font-mono text-red-600 whitespace-pre-wrap">{finding.targetOutput}</div>
                </div>
              </div>
              <div className="border border-purple-100 rounded-md overflow-hidden bg-purple-50/20">
                <div className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-2 border-b border-purple-200">Profile B: Wealthy</div>
                <div className="p-3">
                  <h5 className="text-xs font-semibold text-purple-700 mb-1">Input</h5>
                  <div className="text-xs bg-white p-2 rounded border border-purple-100 mb-2 font-mono whitespace-pre-wrap">{finding.pairedAttackInput || "N/A"}</div>
                  <h5 className="text-xs font-semibold text-purple-700 mb-1">Target Output</h5>
                  <div className="text-xs bg-white p-2 rounded border border-green-200 font-mono text-green-600 whitespace-pre-wrap">{finding.pairedTargetOutput || "N/A"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Badge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-800 border-red-300 shadow-sm",
    HIGH: "bg-orange-100 text-orange-800 border-orange-300 shadow-sm",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
    LOW: "bg-blue-100 text-blue-800 border-blue-300",
    PASS: "bg-green-100 text-green-800 border-green-300 shadow-sm",
  };
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded border uppercase tracking-wider ${colors[severity] || colors.PASS}`}>
      {severity}
    </span>
  );
}
