"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Cookie, X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const acknowledged = localStorage.getItem("redteam_cookie_ack");
      if (!acknowledged) {
        setVisible(true);
      }
    } catch {
      // In case localStorage is disabled in strict privacy modes
      setVisible(false);
    }
  }, []);

  const handleAcknowledge = () => {
    try {
      localStorage.setItem("redteam_cookie_ack", "acknowledged");
    } catch {}
    setVisible(false);
  };

  // Do not show banner on authenticated dashboard workspaces where session is already established
  const isDashboardRoute =
    pathname &&
    (pathname.startsWith("/overview") ||
      pathname.startsWith("/systems") ||
      pathname.startsWith("/campaigns") ||
      pathname.startsWith("/policies") ||
      pathname.startsWith("/policy") ||
      pathname.startsWith("/frameworks") ||
      pathname.startsWith("/incidents") ||
      pathname.startsWith("/remediation") ||
      pathname.startsWith("/evidence") ||
      pathname.startsWith("/reports") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/dashboard"));

  if (!visible || isDashboardRoute) return null;

  return (
    <div
      role="region"
      aria-label="Cookie & Technical Session Notice"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans"
    >
      <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-slate-950/90 text-slate-200 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Essential Technical Cookies
              </h4>
              <p className="text-[11px] text-teal-400/90 font-mono">
                Zero Ad Trackers &bull; Privacy by Design
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAcknowledge}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          RedTeam AI Labs deploys strictly necessary session cookies (<code className="text-teal-300 bg-white/5 px-1 py-0.5 rounded font-mono text-[11px]">sb-*-auth-token</code>) to maintain encrypted authentication and multi-tenant security under NDPA 2023. We do not use third-party marketing or cross-site tracking cookies.
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href="/legal/cookies"
            className="text-xs text-teal-400 hover:text-teal-300 font-medium underline underline-offset-2 transition-colors"
          >
            Read Cookie Policy
          </Link>

          <button
            type="button"
            onClick={handleAcknowledge}
            className="px-3.5 py-1.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold transition-all shadow-md shadow-crimson-600/30 cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
