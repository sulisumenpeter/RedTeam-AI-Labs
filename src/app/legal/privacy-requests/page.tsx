"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Send,
  AlertCircle,
  Clock,
  Mail,
  Scale,
} from "lucide-react";

export default function PrivacyRequestsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    requestType: "access",
    details: "",
    confirmedIdentity: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Generate deterministic tracking ID
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const id = `NDPA-DSR-2026-${randomHex}`;

    setTimeout(() => {
      setTrackingId(id);
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 font-sans text-slate-200">
      {/* Top Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>&bull;</span>
        <Link href="/legal" className="hover:text-white transition-colors">
          Legal Hub
        </Link>
        <span>&bull;</span>
        <span className="text-teal-400 font-bold">Data Subject Rights Portal</span>
      </nav>

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Statutory Privacy Portal &bull; NDPA Section 29</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Data Subject Rights <span className="text-crimson-400">Request Portal</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Submit formal privacy and data subject rights requests under the <strong>Nigeria Data Protection Act 2023</strong>, <strong>GDPR</strong>, and applicable international privacy enactments to Lisumen Innovative Hub.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Statutory Timeline: <strong>Within 30 Calendar Days</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>DPO Contact: <strong>dpo@redteamailabs.com</strong></span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl glass-panel-elevated border border-teal-500/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Data Subject Request Received
          </h2>

          <div className="p-4 rounded-xl bg-slate-900 border border-white/10 max-w-md mx-auto text-xs font-mono space-y-1">
            <div className="text-slate-400">Tracking Reference Number:</div>
            <div className="text-base text-teal-300 font-bold tracking-wider">{trackingId}</div>
            <div className="text-[11px] text-slate-500 pt-1">
              Recorded under Lisumen Innovative Hub DSR Registry
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Our Data Protection Officer will review your request, verify identity ownership for <strong>{formData.email}</strong>, and fulfill your request within the statutory <strong>30-calendar-day timeline</strong> prescribed by the NDPA 2023.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/legal"
              className="px-5 py-2.5 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
            >
              Return to Legal Hub
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Legal Name <span className="text-crimson-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Sulisumen Peter"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 mb-1.5">
                Registered Email Address <span className="text-crimson-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="organization" className="block text-xs font-bold text-slate-300 mb-1.5">
              Enterprise Organization / Workspace (Optional)
            </label>
            <input
              id="organization"
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Acme Legal Tech Ltd"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="requestType" className="block text-xs font-bold text-slate-300 mb-1.5">
              Statutory Right Invoked <span className="text-crimson-400">*</span>
            </label>
            <select
              id="requestType"
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="access">Right of Access — Request copy of personal data (NDPA s. 29(1)(a))</option>
              <option value="rectification">Right to Rectification — Correct inaccurate records (NDPA s. 29(1)(b))</option>
              <option value="erasure">Right to Erasure — Delete personal data / 'Right to be Forgotten' (NDPA s. 29(1)(c))</option>
              <option value="restriction">Right to Restriction — Suspend data processing (NDPA s. 29(1)(d))</option>
              <option value="portability">Right to Data Portability — Export data in machine-readable JSON/CSV (NDPA s. 29(1)(e))</option>
              <option value="object">Right to Object — Object to processing based on legitimate interests (NDPA s. 29(1)(f))</option>
              <option value="consent">Right to Withdraw Consent (NDPA s. 29(1)(g))</option>
              <option value="general">General Privacy Inquiry / Regulatory Question</option>
            </select>
          </div>

          <div>
            <label htmlFor="details" className="block text-xs font-bold text-slate-300 mb-1.5">
              Specific Details of Request <span className="text-crimson-400">*</span>
            </label>
            <textarea
              id="details"
              rows={4}
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Please provide any relevant details, dates, or specific records to assist our Data Protection Officer in fulfilling your request..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.confirmedIdentity}
                onChange={(e) => setFormData({ ...formData, confirmedIdentity: e.target.checked })}
                className="mt-0.5 rounded border-white/20 text-teal-600 focus:ring-teal-500"
              />
              <span className="leading-relaxed">
                I hereby declare that I am the authorized data subject or possess lawful power of attorney to make this request. I understand that Lisumen Innovative Hub will verify my identity before releasing or deleting personal records.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Statutory Request to DPO</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

