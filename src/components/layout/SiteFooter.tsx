import React from "react";
import Link from "next/link";
import { Shield, Scale, FileText, Lock, Globe, ExternalLink, Terminal } from "lucide-react";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className = "" }: SiteFooterProps) {
  return (
    <footer className={`glass-panel border-t border-white/10 pt-16 pb-12 text-slate-400 font-sans ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Operating Entity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-crimson-600/20 border border-white/20">
                🛡️
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">RedTeam AI <span className="text-crimson-400">Labs</span></span>
                <span className="block text-[11px] font-mono text-teal-400">Lisumen Innovative Hub</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Production-grade AI governance and runtime assurance platform engineered by Lisumen Innovative Hub. Powered by an operational Supabase and PostgreSQL engine delivering deterministic safety verification for generative models and MCP-enabled autonomous agents.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Operated by <strong>Lisumen Innovative Hub</strong> &bull; Nigeria</span>
              </div>
              <p className="text-slate-500 font-mono text-[10px]">
                Primary Law: Nigeria Data Protection Act 2023 (NDPA)
              </p>
            </div>
          </div>

          {/* Column 2: Platform & Sections */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span>Platform</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/overview" className="hover:text-white transition-colors">
                  Enterprise Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Workspace Sign In
                </Link>
              </li>
              <li>
                <Link href="/#what-it-is" className="hover:text-white transition-colors">
                  What It Is
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#what-we-catch" className="hover:text-white transition-colors">
                  What We Catch
                </Link>
              </li>
              <li>
                <Link href="/#who-its-for" className="hover:text-white transition-colors">
                  Who It&apos;s For
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Documents */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-crimson-400" />
              <span>Legal</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/notice" className="hover:text-white transition-colors">
                  Legal Notice &amp; Operating Info
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/legal" className="text-teal-400 hover:text-teal-300 font-medium transition-colors inline-flex items-center gap-1">
                  <span>Legal &amp; Compliance Hub</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Operational Policies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Policies</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/legal/acceptable-use" className="hover:text-white transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/ai-disclaimer" className="hover:text-white transition-colors">
                  AI Usage &amp; Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/legal/retention" className="hover:text-white transition-colors">
                  Data Retention &amp; Deletion
                </Link>
              </li>
              <li>
                <Link href="/legal/security-disclosure" className="hover:text-white transition-colors">
                  Security &amp; Vulnerability
                </Link>
              </li>
              <li>
                <Link href="/legal/intellectual-property" className="hover:text-white transition-colors">
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Data Protection & Rights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Data Protection</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/legal/dpa" className="hover:text-white transition-colors">
                  Data Processing Agreement
                </Link>
              </li>
              <li>
                <Link href="/legal/subprocessors" className="hover:text-white transition-colors">
                  Subprocessors &amp; Infra
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-requests" className="text-teal-400 hover:text-teal-300 font-medium transition-colors flex items-center gap-1">
                  <span>Exercise Privacy Rights (DSR)</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
              <li className="pt-2 border-t border-white/5">
                <span className="block text-[11px] text-slate-400 font-mono">DPO Contact:</span>
                <span className="text-slate-300 font-mono text-[11px]">dpo@redteamailabs.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory & Standards Attribution Bar */}
        <div className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 font-mono">
            <span className="text-slate-400 font-semibold">Architected for Alignment With:</span>
            <span>NDPA 2023</span>
            <span>&bull;</span>
            <span>EU AI Act</span>
            <span>&bull;</span>
            <span>NIST AI RMF 1.0</span>
            <span>&bull;</span>
            <span>ISO/IEC 42001</span>
            <span>&bull;</span>
            <span>OWASP Agentic Top 10</span>
          </div>

          <p className="text-center md:text-right font-mono text-[10px]">
            &copy; {new Date().getFullYear()} Lisumen Innovative Hub. All rights reserved.
          </p>
        </div>

        <div className="text-center pt-2 text-[10px] text-slate-600">
          RedTeam AI Labs is a production-grade AI assurance platform in Early Access operated by Lisumen Innovative Hub. Enterprise sandbox and production environments are backed by live PostgreSQL persistence.
        </div>
      </div>
    </footer>
  );
}
