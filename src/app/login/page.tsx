"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/overview";
  const urlError = searchParams?.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unconfigured"
      ? "Supabase database credentials are not yet configured in .env.local. You can test using Evaluation Demo Mode if enabled."
      : ""
  );
  const [successMessage, setSuccessMessage] = useState("");

  const isDemoAllowed = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          action: mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (mode === "signup" && data.message) {
        setSuccessMessage(data.message);
        setMode("signin");
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "evaluator@redteam-ai.internal",
          password: "evaluation-demo-mode-token",
          isDemo: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo login failed.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-red-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-100/50">
      {/* Mode Switcher */}
      <div className="flex border-b border-red-100 mb-6 pb-2">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMessage("");
          }}
          className={`flex-1 text-center py-2 text-sm font-bold transition-colors ${
            mode === "signin"
              ? "text-red-700 border-b-2 border-red-600 -mb-2.5"
              : "text-slate-500 hover:text-red-600"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setErrorMessage("");
          }}
          className={`flex-1 text-center py-2 text-sm font-bold transition-colors ${
            mode === "signup"
              ? "text-red-700 border-b-2 border-red-600 -mb-2.5"
              : "text-slate-500 hover:text-red-600"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/30 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In to Workspace" : "Create Enterprise Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Evaluation Demo Mode */}
      {isDemoAllowed && (
        <div className="mt-6 pt-6 border-t border-red-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Fellowship Demo Mode
            </span>
            <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold">
              ONE-CLICK DEMO
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-700 text-xs font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Enter Evaluation Workspace (Admin Role)</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-red-500 selection:text-white">
      {/* Background Soft Red Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-50/80 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-100/40 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Back Link */}
      <div className="w-full max-w-md mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          v1.2.0
        </span>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-red-600/30">
              🛡️
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-red-700 mb-2">
            RedTeam AI Labs
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Sign in to test, govern, and assure your AI chatbots.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>

        {/* Security & Compliance Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">Multi-Tenant Row-Level Security (RLS) &amp; Role-Based Access Control</p>
          <p className="font-mono text-[11px] text-red-600/80">NIST AI RMF &bull; ISO/IEC 42001 &bull; EU AI Act Aligned</p>
        </div>
      </div>
    </div>
  );
}
