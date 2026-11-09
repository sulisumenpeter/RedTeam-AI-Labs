import React from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LEGAL_DOCUMENTS, LEGAL_CATEGORIES } from "@/lib/legal/legalContent";
import { ArrowLeft, Shield, Scale, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-crimson-600 selection:text-white ambient-mesh">
      {/* Top Legal Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel-elevated border-b border-white/10 backdrop-blur-xl bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors py-1 px-2.5 rounded-lg glass-panel hover:bg-white/10 border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>Back to Home</span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-6 h-6 rounded-lg bg-crimson-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                🛡️
              </div>
              <Link href="/legal" className="font-extrabold text-white text-sm tracking-tight hover:text-teal-300 transition-colors">
                Legal &amp; Compliance Hub
              </Link>
              <span className="text-[10px] text-teal-400 font-mono px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                Lisumen Innovative Hub
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/legal/privacy-requests"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Data Subject Rights (DSR)</span>
              <span className="sm:hidden">DSR</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold transition-all shadow-md shadow-crimson-600/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Legal Content Container */}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {/* Global Comprehensive Legal Footer */}
      <SiteFooter />
    </div>
  );
}

