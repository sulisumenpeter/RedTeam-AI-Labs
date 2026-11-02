"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "../../../components/layout/AppShell";
import { Target, ShieldCheck, ArrowRight, CheckCircle2, Play, AlertCircle } from "lucide-react";
import Link from "next/link";

function CampaignSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPolicyId = searchParams?.get("policy_id");

  const [systems, setSystems] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [campaignName, setCampaignName] = useState("LexHack Legal AI Safety Audit");
  const [randomSeed, setRandomSeed] = useState(42);
  const [executionMode, setExecutionMode] = useState<"DEMO_SYNTHETIC" | "LIVE_EXTERNAL">("DEMO_SYNTHETIC");
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [sysRes, polRes] = await Promise.all([
          fetch("/api/systems").then((r) => r.json()).catch(() => ({ systems: [] })),
          fetch("/api/policies").then((r) => r.json()).catch(() => ({ policies: [] })),
        ]);

        const sysList = sysRes.systems || [];
        const polList = polRes.policies || [];

        setSystems(sysList);
        setPolicies(polList);

        if (sysList.length > 0) {
          setSelectedSystemId(sysList[0].id);
        }
        if (preselectedPolicyId && polList.some((p: any) => p.id === preselectedPolicyId)) {
          setSelectedPolicyId(preselectedPolicyId);
        } else if (polList.length > 0) {
          setSelectedPolicyId(polList[0].id);
        }
      } catch (err) {
        console.error("Failed to load campaign options:", err);
      }
    }
    loadOptions();
  }, [preselectedPolicyId]);

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId);
  const selectedSystem = systems.find((s) => s.id === selectedSystemId);
  const requirements = selectedPolicy?.requirements || [];
  const estimatedTestCount = requirements.length > 0 ? requirements.length * 5 : 30;

  const handleLaunch = async () => {
    if (!selectedPolicyId) {
      setError("Please select a governance policy to derive test cases from.");
      return;
    }

    setIsLaunching(true);
    setError(null);
    try {
      const campaignData = {
        name: campaignName,
        workspace_id: selectedSystem?.workspace_id || "a0000000-0000-0000-0000-000000000001",
        ai_system_id: selectedSystemId,
        policy_id: selectedPolicyId,
        policy_version: selectedPolicy?.version || "1.0",
        target_type: selectedSystem?.target_type || "SYNTHETIC",
        target_version: selectedSystem?.model_version || "1.0",
        random_seed: Number(randomSeed),
        execution_mode: executionMode,
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (!res.ok) {
        let errorMsg = "Failed to create campaign";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
          if (data.details) errorMsg += ` - ${data.details}`;
        } catch {}
        throw new Error(errorMsg);
      }

      const responseData = await res.json();
      if (!responseData.id) {
        throw new Error("API did not return a campaign ID");
      }

      router.push(`/campaigns/${responseData.id}`);
    } catch (err: any) {
      console.error("Launch Error:", err);
      setError(err.message || String(err));
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Safety Assessment Campaign</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure target AI system, select immutable governance policy, and review the derived test plan.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Configuration Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Assessment Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campaign Name</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target AI System</label>
              <select
                value={selectedSystemId}
                onChange={(e) => setSelectedSystemId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.ai_provider} - {s.risk_classification} Risk)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Governing Policy (Traceable Baseline)</label>
              <select
                value={selectedPolicyId}
                onChange={(e) => setSelectedPolicyId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} v{p.version} ({p.requirements?.length || 0} rules)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reproducibility Random Seed</label>
              <input
                type="number"
                value={randomSeed}
                onChange={(e) => setRandomSeed(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Derived Test Plan Review Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Derived Adversarial Test Plan ({estimatedTestCount} Tests)
            </h2>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
              1 Anchor + 4 Fuzzed Variants per Rule
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {requirements.map((req: any, idx: number) => (
              <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{req.title}</span>
                  <span className="text-slate-400 text-[11px] block">{req.category} &bull; Expected: {req.expected_behavior}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-600 font-bold">5 tests</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">{req.severity_if_violated}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
            <strong>Audit Traceability:</strong> Every test case is deterministically linked to its parent governance requirement (<code className="font-mono text-[11px]">requirement_id</code>) ensuring 100% evidentiary cross-walking from test execution to framework compliance.
          </div>

          {/* Launch Trigger */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="inline-flex items-center px-6 py-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {isLaunching ? (
                "Compiling Test Plan..."
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5" /> Initialize &amp; Review Execution Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function CampaignSetupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading campaign setup...</div>}>
      <CampaignSetupContent />
    </Suspense>
  );
}
