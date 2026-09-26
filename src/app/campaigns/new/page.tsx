"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignSetup() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async () => {
    setIsLaunching(true);
    setError(null);
    try {
      const campaignData = {
        name: "LexHack Main Evaluation",
        policy_id: "mock-policy-id", // In a real flow, fetched from state or URL
        policy_version: "1.0",
        policy_hash: "8f9a2b1c",
        target_type: "Synthetic Legal Intake Assistant",
        target_version: "1.0",
        generator_version: "gemini-3.8-flash",
        evaluator_version: "gemini-3.1-pro-preview",
        random_seed: 42
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData)
      });

      if (!res.ok) {
        let errorMsg = "Failed to create campaign";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
          if (data.details) errorMsg += ` - Details: ${JSON.stringify(data.details)}`;
        } catch (e) {
          errorMsg = `Server returned ${res.status} ${res.statusText}`;
        }
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
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">New Safety Campaign</h1>
          <p className="text-zinc-600 mt-2">Review the generated adversarial test plan before execution.</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">{error}</div>}

        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Target</h2>
            <p className="text-lg font-semibold text-zinc-800 flex items-center">
              Synthetic Legal Intake Assistant
              <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Governance Policy</h2>
            <p className="text-lg font-semibold text-indigo-600 hover:underline cursor-pointer">Legal AI Responsible Use Policy v1.0</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h2 className="text-xl font-bold mb-6 border-b border-zinc-100 pb-4">Test Plan Review</h2>
          <table className="w-full text-left text-zinc-800">
            <tbody className="divide-y divide-zinc-100">
              <tr><td className="py-3 font-medium text-zinc-700">Prompt Injection</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
              <tr><td className="py-3 font-medium text-zinc-700">Jailbreak / Safety Evasion</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
              <tr><td className="py-3 font-medium text-zinc-700">Sensitive Information Leakage</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
              <tr><td className="py-3 font-medium text-zinc-700">Bias / Disparate Treatment</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
              <tr><td className="py-3 font-medium text-zinc-700">Hallucinated Legal Claims</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
              <tr><td className="py-3 font-medium text-zinc-700">Governance / Policy Compliance</td><td className="text-right font-mono text-zinc-500">5 tests</td></tr>
            </tbody>
            <tfoot>
              <tr><td className="pt-6 pb-2 font-bold text-lg border-t border-zinc-200">TOTAL</td><td className="text-right font-bold text-lg pt-6 pb-2 border-t border-zinc-200">30 tests</td></tr>
            </tfoot>
          </table>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-sm text-blue-800 italic font-medium">These adversarial tests were deterministically generated from the selected governance requirements.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-200">
          <button 
            onClick={handleLaunch}
            disabled={isLaunching}
            className="bg-indigo-600 text-white px-8 py-4 rounded-md font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center disabled:opacity-50"
          >
            {isLaunching ? "Launching..." : "Review & Execute 30 Tests"}
            {!isLaunching && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}
