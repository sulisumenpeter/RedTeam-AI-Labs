"use client";

import React from "react";
import Link from "next/link";
import { LegalDocument, LEGAL_DOCUMENTS } from "@/lib/legal/legalContent";
import {
  FileText,
  Calendar,
  Shield,
  Scale,
  Printer,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface LegalDocumentViewProps {
  doc: LegalDocument;
}

export function LegalDocumentView({ doc }: LegalDocumentViewProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Find other docs in the same category
  const relatedDocs = Object.values(LEGAL_DOCUMENTS).filter(
    (d) => d.category === doc.category && d.slug !== doc.slug
  );

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans text-slate-200">
      {/* Top Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/legal" className="hover:text-white transition-colors">
          Legal &amp; Compliance Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-teal-400 font-bold">{doc.shortTitle}</span>
      </nav>

      {/* Document Header Card */}
      <header className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-crimson-500/10 text-crimson-400 border border-crimson-500/20 font-mono">
              {doc.categoryLabel}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
              Version {doc.version}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            aria-label="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {doc.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Effective: <strong>{doc.effectiveDate}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Last Updated: <strong>{doc.lastUpdated}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-500" />
            <span>Governing Law: <strong>{doc.governingLaw}</strong></span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Executive Summary</span>
          </div>
          <p>{doc.summary}</p>
        </div>

        {/* Legal Counsel Confirmation Notice if applicable */}
        {doc.confirmationItems && doc.confirmationItems.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Notice: Operational Details Requiring Client Confirmation</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              In accordance with ethical legal engineering practices, provisions requiring corporate confirmation or formal review by a qualified Nigerian technology lawyer are identified below:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] font-mono text-amber-300/90 pl-1">
              {doc.confirmationItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Table of Contents */}
      <section aria-labelledby="toc-heading" className="glass-panel p-6 rounded-2xl border border-white/10 mb-10">
        <h2 id="toc-heading" className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span>Table of Contents</span>
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {doc.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-slate-300 hover:text-teal-300 transition-colors flex items-center gap-2 group py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors shrink-0" />
                <span className="truncate">{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Document Sections Content */}
      <div className="space-y-10">
        {doc.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 space-y-3.5 pt-4 border-t border-white/5 first:border-none"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-teal-400">#</span>
              <span>{section.title}</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {section.content.map((paragraph, pIdx) => {
                // If paragraph has newline bullet items
                if (paragraph.includes("\n• ") || paragraph.includes("\nA. ") || paragraph.includes("\n1. ")) {
                  const lines = paragraph.split("\n");
                  return (
                    <div key={pIdx} className="space-y-1.5">
                      <p>{lines[0]}</p>
                      <ul className="pl-4 space-y-1 text-slate-300">
                        {lines.slice(1).map((line, lIdx) => (
                          <li key={lIdx} className="font-mono text-xs text-slate-300">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                // Standard paragraph
                return <p key={pIdx}>{paragraph}</p>;
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom Navigation & Related Docs */}
      <footer className="mt-16 pt-8 border-t border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/legal"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" />
            <span>Return to Legal Hub</span>
          </Link>

          <Link
            href="/legal/privacy-requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-bold transition-all border border-teal-500/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Exercise Privacy Rights (DSR Portal)</span>
          </Link>
        </div>

        {/* Related Category Documents */}
        {relatedDocs.length > 0 && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Other Documents in {doc.categoryLabel}
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedDocs.map((rDoc) => (
                <Link
                  key={rDoc.slug}
                  href={`/legal/${rDoc.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/60 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/5 transition-colors"
                >
                  {rDoc.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        )}
      </footer>
    </article>
  );
}

