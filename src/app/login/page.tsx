"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/";
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Mode Switcher */}
      <div className="flex border-b border-slate-800 mb-6 pb-2">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setErrorMessage("");
          }}
          className={`flex-1 text-center py-2 text-sm font-semibold transition-colors ${
            mode === "signin"
              ? "text-emerald-400 border-b-2 border-emerald-500 -mb-2.5"
              : "text-slate-400 hover:text-slate-200"
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
          className={`flex-1 text-center py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "text-emerald-400 border-b-2 border-emerald-500 -mb-2.5"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="email"
              required
              placeholder="analyst@organisation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In to Platform" : "Create Enterprise Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Evaluation Demo Mode */}
      {isDemoAllowed && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Fellowship Evaluation Mode
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-mono">
              DEMO ACTIVE
            </span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition-colors hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enter Evaluation Workspace (Admin Role)</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-4 shadow-inner">
            <ShieldCheck className="w-4 h-4" />
            AI Governance, Risk & Assurance
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            RedTeam AI Labs
          </h1>
          <p className="text-sm text-slate-400">
            Sign in to manage AI systems, policies, evaluations, and compliance evidence.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>

        {/* Security & Compliance Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>Multi-Tenant Row-Level Security (RLS) & Role-Based Access Control Enforced</p>
          <p className="font-mono text-[11px] text-slate-600">RedTeam AI Labs v1.2.0 • ISO 42001 & EU AI Act Ready</p>
        </div>
      </div>
    </div>
  );
}
