"use client";

import React from "react";

export function ReportExporter({ campaignData }: { campaignData: any }) {
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(campaignData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const exportFileDefaultName = `campaign-audit-${campaignData.id || 'export'}.json`;

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    linkElement.click();

    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const passedCount = campaignData.findings?.filter((f: any) => f.severity === "PASS").length || 0;
    const hasCriticals = campaignData.findings?.some((f: any) => f.severity === "CRITICAL" || f.severity === "HIGH");
    const totalCount = campaignData.findings?.length || 0;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>RedTeam AI Governance Report</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 900px; margin: 0 auto; }
    h1, h2 { color: #111; }
    .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
    .finding { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #fafafa; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    .badge-CRITICAL { background: #fee2e2; color: #991b1b; }
    .badge-HIGH { background: #ffedd5; color: #9a3412; }
    .badge-PASS { background: #dcfce7; color: #166534; }
    pre { background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; font-size: 13px;}
  </style>
</head>
<body>
  <div class="header">
    <h1>RedTeam AI Autonomous Safety & Governance Testing Lab</h1>
    <h2>Executive Summary</h2>
    <p><strong>Campaign ID:</strong> ${campaignData.id || 'N/A'}</p>
    <p><strong>Date:</strong> ${new Date().toISOString()}</p>
    <p><strong>Policy Version:</strong> ${campaignData.policy_version || 'N/A'}</p>
    <p><strong>Safety Posture:</strong> <span style="color: ${hasCriticals ? '#dc2626' : '#16a34a'}; font-weight: bold;">${hasCriticals ? 'VULNERABLE' : 'SECURE'}</span></p>
    <p><strong>Tests Executed:</strong> ${totalCount}</p>
    <p><strong>Passed:</strong> ${passedCount}</p>
  </div>
  
  <h2>Findings Log</h2>
  ${campaignData.findings?.map((f: any) => `
    <div class="finding">
      <h3>${f.category || 'Unknown Category'} <span class="badge badge-${f.severity || 'UNKNOWN'}">${f.severity || 'UNKNOWN'}</span></h3>
      <p><strong>Objective:</strong> ${f.objective || 'N/A'}</p>
      <p><strong>Attack Input:</strong> <pre>${f.attackInput || 'N/A'}</pre></p>
      <p><strong>Target Output:</strong> <pre>${f.targetOutput || 'N/A'}</pre></p>
      <p><strong>Rationale:</strong> ${f.rationale || 'N/A'}</p>
    </div>
  `).join('') || '<p>No findings recorded.</p>'}
  
  <div style="margin-top: 40px; font-size: 0.9em; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
    <p><strong>Disclaimer:</strong> The target assistant and knowledge base are synthetic demonstration systems. This report is an AI safety/governance assessment, not legal advice.</p>
    <p>Reproducibility Data: Seed ${campaignData.seed || 'N/A'}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `campaign-audit-${campaignData.id || 'export'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExportHTML}
        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md font-medium text-sm transition-colors border border-indigo-200"
      >
        Export HTML Report
      </button>
      <button
        onClick={handleExportJSON}
        className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded-md font-medium text-sm transition-colors border border-zinc-700"
      >
        Export JSON Audit Report
      </button>
    </div>
  );
}
