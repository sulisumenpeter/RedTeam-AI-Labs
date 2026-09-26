"use client";

import { useState, useCallback } from "react";

export function useCampaignRunner(initialCampaignId?: string) {
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "COMPLETED" | "ERROR">("IDLE");
  const [progress, setProgress] = useState(0);
  const [campaignId, setCampaignId] = useState<string | null>(initialCampaignId || null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ total: number; completed: number; byCategory: Record<string, { total: number; completed: number }> }>({ total: 30, completed: 0, byCategory: {} });
  const [findings, setFindings] = useState<any[]>([]);

  const runChunks = useCallback(async (id: string) => {
    try {
      setStatus("RUNNING");
      setError(null);
      
      let isCompleted = false;
      let currentCompleted = metrics.completed;

      while (!isCompleted && currentCompleted < 30) {
        const chunkRes = await fetch(`/api/campaigns/${id}/chunk`, {
          method: "POST",
          body: JSON.stringify({ batch_size: 5 })
        });
        
        if (!chunkRes.ok) {
          const errData = await chunkRes.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || "Chunk failed to process");
        }
        const chunkData = await chunkRes.json();
        
        if (chunkData.findings && chunkData.findings.length > 0) {
          setFindings(prev => {
            // Deduplicate findings by finding.attack_input to avoid duplicate UI entries on retries
            const newFindings = [...prev];
            for (const f of chunkData.findings) {
              if (!newFindings.find(existing => existing.attack_input === f.attack_input)) {
                newFindings.push(f);
              }
            }
            return newFindings;
          });
        }
        
        const statusRes = await fetch(`/api/campaigns/${id}/status`);
        if (!statusRes.ok) throw new Error("Status check failed");
        const statusData = await statusRes.json();
        
        currentCompleted = statusData.progress.completed;
        setMetrics({ 
          total: statusData.progress.total, 
          completed: currentCompleted,
          byCategory: statusData.progress.byCategory || {}
        });
        setProgress((currentCompleted / statusData.progress.total) * 100);

        if (statusData.status === "COMPLETED" || currentCompleted >= statusData.progress.total) {
          isCompleted = true;
          setStatus("COMPLETED");
        }
      }
    } catch (err: any) {
      setStatus("ERROR");
      setError(err.message || "Pipeline interrupted");
    }
  }, [metrics.completed]);

  const startCampaign = useCallback(async (profileId?: string) => {
    try {
      setStatus("RUNNING");
      setError(null);
      setProgress(0);
      
      let idToRun = campaignId;

      if (!idToRun) {
        const initRes = await fetch("/api/campaigns", {
          method: "POST",
          body: JSON.stringify({ name: "LexHack Campaign", profileId })
        });
        const initData = await initRes.json();
        if (!initRes.ok) throw new Error(initData.error || "Failed to create campaign");
        idToRun = initData.id;
        if (!idToRun) throw new Error("No campaign ID returned");
        setCampaignId(idToRun);
      }

      await runChunks(idToRun as string);
    } catch (err: any) {
      setStatus("ERROR");
      setError(err.message || "Failed to start campaign");
    }
  }, [campaignId, runChunks]);

  const resumeCampaign = useCallback(() => {
    if (campaignId) {
      runChunks(campaignId);
    }
  }, [campaignId, runChunks]);

  return { status, progress, campaignId, error, startCampaign, resumeCampaign, metrics, findings };
}
