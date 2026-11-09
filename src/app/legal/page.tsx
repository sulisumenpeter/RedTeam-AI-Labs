import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { LEGAL_CATEGORIES, LEGAL_DOCUMENTS } from "@/lib/legal/legalContent";
import {
  Scale,
  Shield,
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Building2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Legal & Regulatory Compliance Hub | RedTeam AI Labs",
  description:
    "Official legal documentation, statutory data protection commitments under NDPA 2023, terms of service, AI disclaimers, and subprocessors for RedTeam AI Labs.",
};

export default function LegalHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero Section */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono font-bold mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>Operated by Lisumen Innovative Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Legal &amp; Regulatory <span className="text-crimson-400">Compliance Hub</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive statutory documentation, data protection commitments, operational policies, and subprocessor disclosures for RedTeam AI Labs. Formatted under the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> with cross-border alignment for global enterprise assurance (GDPR, EU AI Act, NIST AI RMF).
        </p>

        {/* Operating Entity Notice */}
        <div className="mt-6 p-4 rounded-xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Operating Business Entity: Lisumen Innovative Hub</span>
            </span>
            <p className="text-slate-400 text-[11px]">
              Jurisdiction of Primary Domicile &amp; Law: Federal Republic of Nigeria
            </p>
          </div>

          <Link
            href="/legal/notice"
            className="text-teal-400 hover:text-teal-300 font-bold inline-flex items-center gap-1 shrink-0"
          >
            <span>View Legal Notice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Statutory Cross-Walk Badges */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-12 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
          Statutory Frameworks:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">
            NDPA 2023 (Nigeria)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            EU AI Act (2024/1689)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">
            GDPR / UK GDPR Art. 28
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
            NIST AI RMF 1.0
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            ISO/IEC 42001
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-crimson-500/10 text-crimson-300 border border-crimson-500/20">
            OWASP Agentic Top 10
          </span>
        </div>
      </div>

      {/* Document Grid Grouped by Category */}
      <div className="space-y-12">
        {LEGAL_CATEGORIES.map((category) => {
          const categoryDocs = Object.values(LEGAL_DOCUMENTS).filter(
            (doc) => doc.category === category.id
          );

          const getCategoryIcon = () => {
            switch (category.id) {
              case "legal":
                return <Scale className="w-5 h-5 text-crimson-400" />;
              case "policies":
                return <FileText className="w-5 h-5 text-amber-400" />;
              case "data-protection":
                return <Lock className="w-5 h-5 text-teal-400" />;
            }
          };

          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl glass-panel border border-white/10 flex items-center justify-center">
                    {getCategoryIcon()}
                  </div>
                  <div>
                    <h2 id={`category-${category.id}`} className="text-lg font-bold text-white tracking-tight">
                      {category.label}
                    </h2>
                    <p className="text-xs text-slate-400">{category.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {categoryDocs.length} {categoryDocs.length === 1 ? "Document" : "Documents"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryDocs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/legal/${doc.slug}`}
                    className="p-6 rounded-2xl glass-panel hover:bg-white/[0.07] border border-white/10 hover:border-teal-500/30 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          v{doc.version}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {doc.lastUpdated}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors flex items-center justify-between">
                        <span>{doc.shortTitle}</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {doc.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{doc.sections.length} Sections</span>
                      <span className="text-teal-400 font-medium group-hover:underline">
                        Read Policy &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Data Subject Rights Portal Callout Banner */}
      <div className="mt-16 p-8 rounded-3xl glass-panel-elevated border border-teal-500/30 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>NDPA Section 29 &bull; Data Subject Rights</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Exercise Your Privacy Rights
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Under the Nigeria Data Protection Act 2023 and international privacy laws, you possess statutory rights to access, rectify, port, or request erasure of your personal data. We guarantee response within 48 hours and fulfillment within 30 calendar days.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/legal/privacy-requests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-teal-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Data Subject Request</span>
            </Link>

            <a
              href="mailto:dpo@redteamailabs.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-slate-200 text-xs font-bold transition-all border border-white/10"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Contact Data Protection Officer (DPO)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

