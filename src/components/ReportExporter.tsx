"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { escapeHtml } from "../lib/security/sanitizer";

export function ReportExporter({ campaignData }: { campaignData: any }) {
  const handleExportJSON = () => {
    // Audit bundle containing verified campaign findings and cryptographic hashes
    const sanitizedBundle = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        platform: "RedTeam AI Labs Governance & Assurance Platform",
        version: "2.0-Enterprise",
        disclaimer: "This report constitutes an AI safety and governance assurance assessment. It does not certify legal compliance or prove the complete absence of vulnerability.",
      },
      campaign: {
        id: campaignData.id || "N/A",
        name: campaignData.name || "AI Governance Evaluation",
        policyVersion: campaignData.policy_version || "1.0",
        policyHash: campaignData.policy_hash || "N/A",
        targetAI: campaignData.target_ai || campaignData.target_type || "Synthetic Legal Intake Assistant",
        randomSeed: campaignData.random_seed || campaignData.seed || 42,
      },
      findings: (campaignData.findings || []).map((f: any, idx: number) => ({
        index: idx + 1,
        id: f.id || `f-${idx + 1}`,
        category: f.category || "General",
        objective: f.objective || "Unspecified objective",
        severity: f.severity || "UNKNOWN",
        attackInput: f.attackInput || f.attack_input || "N/A",
        targetOutput: f.targetOutput || f.target_response || f.evidence || "N/A",
        rationale: f.rationale || "N/A",
      })),
    };

    const dataStr = JSON.stringify(sanitizedBundle, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const exportFileName = `ai-governance-audit-${campaignData.id || "export"}.json`;
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.download = exportFileName;
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const findings = campaignData.findings || [];
    const passedCount = findings.filter((f: any) => f.severity === "PASS").length;
    const hasCriticals = findings.some((f: any) => f.severity === "CRITICAL" || f.severity === "HIGH");
    const totalCount = findings.length;

    // Title & Header Banner
    doc.setFillColor(15, 23, 42); // Navy 900
    doc.rect(0, 0, 210, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RedTeam AI Labs | AI Governance & Assurance Report", 14, 16);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.text("Executive Summary", 14, 34);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Campaign ID: ${campaignData.id || "N/A"}`, 14, 42);
    doc.text(`Target AI System: ${campaignData.target_ai || campaignData.target_type || "Synthetic Legal Intake Assistant"}`, 14, 48);
    doc.text(`Governance Policy Version: ${campaignData.policy_version || "1.0"}`, 14, 54);
    doc.text(`Evaluation Date: ${new Date().toISOString().split("T")[0]}`, 14, 60);

    const postureText = hasCriticals ? "VULNERABLE (Action Required)" : "ALIGNED (Meets Controls)";
    doc.setFont("helvetica", "bold");
    doc.setTextColor(hasCriticals ? 185 : 22, hasCriticals ? 28 : 101, hasCriticals ? 28 : 52);
    doc.text(`Safety & Governance Posture: ${postureText}`, 14, 68);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Tests Executed: ${totalCount}  |  Passed: ${passedCount}  |  Deficiencies / Findings: ${totalCount - passedCount}`, 14, 75);

    // Findings Table
    const tableRows = findings.map((f: any, idx: number) => [
      `#${idx + 1}`,
      f.category || "General",
      f.severity || "PASS",
      f.objective || "N/A",
      f.rationale || "N/A",
    ]);

    autoTable(doc, {
      startY: 82,
      head: [["ID", "Category", "Severity", "Objective", "Assessor Rationale"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 35 },
        2: { cellWidth: 24, fontStyle: "bold" },
        3: { cellWidth: 50 },
        4: { cellWidth: 65 },
      },
    });

    // Disclaimer footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Confidential Assurance Report. LexHack Builders Fellowship AI Governance Evaluation. Not legal advice.",
        14,
        290
      );
    }

    doc.save(`ai-governance-audit-${campaignData.id || "export"}.pdf`);
  };

  const handleExportHTML = () => {
    const findings = campaignData.findings || [];
    const passedCount = findings.filter((f: any) => f.severity === "PASS").length;
    const hasCriticals = findings.some((f: any) => f.severity === "CRITICAL" || f.severity === "HIGH");
    const totalCount = findings.length;

    // ESCAPED UNTRUSTED DATA TO COMPLETELY PREVENT XSS / HTML INJECTION
    const safeCampaignId = escapeHtml(campaignData.id || "N/A");
    const safePolicyVersion = escapeHtml(campaignData.policy_version || "1.0");
    const safeTargetAI = escapeHtml(campaignData.target_ai || campaignData.target_type || "Synthetic Legal Intake Assistant");
    const safeSeed = escapeHtml(campaignData.random_seed || campaignData.seed || "42");

    const findingsHtml = findings
      .map((f: any, idx: number) => {
        const safeCat = escapeHtml(f.category || "General Safety");
        const safeSev = escapeHtml(f.severity || "PASS");
        const safeObj = escapeHtml(f.objective || "Unspecified Objective");
        const safeInput = escapeHtml(f.attackInput || f.attack_input || "N/A");
        const safeOutput = escapeHtml(f.targetOutput || f.target_response || f.evidence || "N/A");
        const safeRationale = escapeHtml(f.rationale || "No detailed rationale provided.");

        return `
    <div class="finding-card">
      <div class="finding-header">
        <span class="finding-title">#${idx + 1} &mdash; ${safeCat}</span>
        <span class="badge badge-${safeSev}">${safeSev}</span>
      </div>
      <p><strong>Objective:</strong> ${safeObj}</p>
      <div class="grid-pair">
        <div>
          <div class="code-label">Adversarial Input</div>
          <pre>${safeInput}</pre>
        </div>
        <div>
          <div class="code-label">Target AI Response</div>
          <pre>${safeOutput}</pre>
        </div>
      </div>
      <div class="rationale-box">
        <strong>Assessor Evaluation &amp; Policy Rationale:</strong><br/>
        ${safeRationale}
      </div>
    </div>`;
      })
      .join("\n");

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>RedTeam AI Labs &mdash; AI Governance & Assurance Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px; line-height: 1.5; }
    .container { max-width: 960px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 36px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header-banner { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 28px; }
    h1 { margin: 0 0 6px 0; font-size: 24px; color: #0f172a; }
    .subtitle { color: #475569; font-size: 14px; margin-bottom: 20px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px; background: #f1f5f9; padding: 16px; border-radius: 6px; }
    .finding-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-bottom: 20px; background: #ffffff; }
    .finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .finding-title { font-weight: 700; font-size: 15px; color: #0f172a; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }
    .badge-CRITICAL { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-HIGH { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .badge-MEDIUM { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-LOW { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }
    .badge-PASS { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .grid-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
    .code-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    pre { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin: 0; }
    .rationale-box { background: #f8fafc; border-left: 3px solid #0284c7; padding: 12px; font-size: 13px; color: #334155; margin-top: 10px; }
    .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <h1>RedTeam AI Labs &mdash; AI Governance &amp; Assurance Report</h1>
      <div class="subtitle">Autonomous AI Assurance, Risk Verification &amp; Control Enforcement</div>
      <div class="meta-grid">
        <div><strong>Campaign ID:</strong> ${safeCampaignId}</div>
        <div><strong>Target System:</strong> ${safeTargetAI}</div>
        <div><strong>Policy Version:</strong> ${safePolicyVersion}</div>
        <div><strong>Evaluation Date:</strong> ${escapeHtml(new Date().toISOString().split("T")[0])}</div>
        <div><strong>Safety Posture:</strong> <span style="font-weight: bold; color: ${hasCriticals ? "#dc2626" : "#16a34a"};">${hasCriticals ? "VULNERABLE (Action Required)" : "ALIGNED (Meets Controls)"}</span></div>
        <div><strong>Test Coverage:</strong> ${totalCount} Executed | ${passedCount} Passed | Reproducibility Seed: ${safeSeed}</div>
      </div>
    </div>

    <h2>Assurance Findings Log</h2>
    ${findingsHtml || "<p>No recorded findings in this assessment.</p>"}

    <div class="footer">
      <p><strong>Disclaimer:</strong> RedTeam AI Labs provides deterministic and semantic empirical safety testing under configured governance policies. This report does not certify legal compliance or guarantee total absence of risk. Assessor: LexHack Builders Fellowship Automated Assurance Pipeline.</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-governance-audit-${campaignData.id || "export"}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleExportPDF}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
      >
        Export PDF Report
      </button>
      <button
        onClick={handleExportHTML}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors shadow-sm"
      >
        Export HTML Report
      </button>
      <button
        onClick={handleExportJSON}
        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors shadow-sm"
      >
        Export JSON Audit Bundle
      </button>
    </div>
  );
}
