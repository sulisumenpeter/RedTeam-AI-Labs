"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/overview";
  const urlError = searchParams?.get("error");
  const isSandboxMode = searchParams?.get("mode") === "sandbox";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unconfigured"
      ? "Supabase database credentials are not yet configured in .env.local. Configure Supabase or enable NEXT_PUBLIC_DEMO_MODE=true for offline evaluation."
      : ""
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const sandboxButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSandboxMode && sandboxButtonRef.current) {
      sandboxButtonRef.current.focus({ preventScroll: true });
    }
  }, [isSandboxMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "signup" && !termsAccepted) {
      setErrorMessage("You must accept the Terms of Service and Privacy Policy to register for early access.");
      return;
    }

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

      if (mode === "signup" && data.message?.toLowerCase().includes("now sign in")) {
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

  const handleSandboxLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setSandboxLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSandbox: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to launch live sandbox.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to launch live sandbox.");
    } finally {
      setSandboxLoading(false);
    }
  };

  const isBusy = loading || sandboxLoading;

  const emailAuthCard = (
    <div
      key="email-auth-card"
      className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden"
    >
      {/* Mode Switcher */}
      <div className="flex border-b border-white/10 mb-6 pb-2" role="tablist" aria-label="Authentication Mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          onClick={() => {
            setMode("signin");
            setErrorMessage("");
          }}
          className={`flex-1 text-center py-2 text-xs sm:text-sm font-bold transition-all ${
            mode === "signin"
              ? "text-white border-b-2 border-crimson-500 -mb-2.5"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setErrorMessage("");
          }}
          className={`flex-1 text-center py-2 text-xs sm:text-sm font-bold transition-all ${
            mode === "signup"
              ? "text-white border-b-2 border-crimson-500 -mb-2.5"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Early Access Registration
        </button>
      </div>

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              aria-describedby={errorMessage ? "login-error" : undefined}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-panel text-white placeholder:text-slate-500 border border-white/15 rounded-xl text-sm focus:outline-none focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••••••"
              value={password}
              aria-describedby={errorMessage ? "login-error" : undefined}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-panel text-white placeholder:text-slate-500 border border-white/15 rounded-xl text-sm focus:outline-none focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Explicit Agreement Checkbox in Registration Mode */}
        {mode === "signup" && (
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                required
                id="terms-agreement"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-crimson-600 focus:ring-crimson-500"
              />
              <span className="leading-relaxed text-[11px] text-slate-300">
                I agree to the{" "}
                <Link href="/legal/terms" target="_blank" className="text-teal-400 hover:underline font-bold">
                  Terms of Service
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="/legal/privacy" target="_blank" className="text-teal-400 hover:underline font-bold">
                  Privacy Policy
                </Link>{" "}
                operated by Lisumen Innovative Hub under the NDPA 2023.
              </span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-crimson-600/30 transition-all border border-crimson-400/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2 min-h-[44px]"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In to Workspace" : "Register for Early Access"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-1">
          {mode === "signin" ? (
            <>
              By signing in, you agree to our{" "}
              <Link href="/legal/terms" className="text-teal-400 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-teal-400 hover:underline">
                Privacy Policy
              </Link>.
            </>
          ) : (
            <>Protected by multi-tenant RLS under Nigerian law (NDPA 2023).</>
          )}
        </p>
      </form>
    </div>
  );

  const divider = (
    <div key="auth-divider" className="relative flex items-center py-1" role="separator">
      <div className="flex-grow border-t border-white/10" />
      <span className="mx-3 shrink-0 text-[10px] font-mono font-bold tracking-[0.18em] text-slate-400 uppercase">
        {isSandboxMode ? "OR WORKSPACE SIGN-IN" : "OR INSTANT EVALUATION"}
      </span>
      <div className="flex-grow border-t border-white/10" />
    </div>
  );

  const sandboxCard = (
    <section
      key="sandbox-auth-card"
      aria-label="1-Click Live Sandbox Access"
      data-highlighted={isSandboxMode ? "true" : "false"}
      className={`rounded-3xl p-6 sm:p-7 relative overflow-hidden transition-all ${
        isSandboxMode
          ? "bg-gradient-to-br from-slate-900/95 via-teal-950/35 to-slate-900/95 border border-teal-400/60 ring-2 ring-teal-500/25 shadow-[0_0_45px_-12px_rgba(20,184,166,0.45)]"
          : "glass-panel-elevated border border-teal-500/25 shadow-xl"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-3.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/35 text-teal-300 text-[10px] font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 shrink-0 text-teal-400" />
          <span>FOR INVESTORS, GRANT REVIEWERS &amp; EVALUATORS</span>
        </span>

        <button
          ref={sandboxButtonRef}
          type="button"
          data-testid="launch-sandbox-btn"
          onClick={handleSandboxLogin}
          disabled={isBusy}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
            isSandboxMode
              ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 shadow-xl shadow-teal-500/25 border border-teal-300/60"
              : "bg-teal-500/15 hover:bg-teal-500/25 text-teal-100 border border-teal-400/40 shadow-lg shadow-teal-950/30"
          }`}
        >
          {sandboxLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              <span>Launching Live Sandbox...</span>
            </>
          ) : (
            <span>Launch 1-Click Live Sandbox &rarr;</span>
          )}
        </button>

        <p className="text-xs text-slate-300/90 leading-relaxed max-w-sm">
          Instant access to our pre-configured Synthetic Legal Intake Assistant, 63-test regression suite, and live MCP interception buffer.
        </p>
      </div>
    </section>
  );

  return (
    <div className="space-y-5">
      {/* Feedback Messages */}
      {errorMessage && (
        <div
          id="login-error"
          role="alert"
          className="p-3.5 rounded-xl bg-crimson-950/80 border border-crimson-500/50 text-crimson-200 text-xs flex items-start gap-2.5 shadow-md"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-crimson-400 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          id="login-success"
          role="status"
          className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2.5 shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {isSandboxMode ? (
        <>
          {sandboxCard}
          {divider}
          {emailAuthCard}
        </>
      ) : (
        <>
          {emailAuthCard}
          {divider}
          {sandboxCard}
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-crimson-600 selection:text-white ambient-mesh">
      {/* Top Back Link */}
      <div className="w-full max-w-md mb-6 relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-bold text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20 font-mono">
          v1.2.0
        </span>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-crimson-600 to-rose-700 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-crimson-600/30 border border-white/20 group-hover:scale-105 transition-all">
              🛡️
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">
            RedTeam AI <span className="text-crimson-400">Labs</span>
          </h1>
          <p className="text-sm text-slate-400 font-normal">
            Sign in to test, govern, and assure your AI systems and MCP agents.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-slate-400 font-medium">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>

        {/* Security & Compliance Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-400">Multi-Tenant Row-Level Security (RLS) &amp; Role-Based Access Control</p>
          <p className="font-mono text-[11px] text-teal-400/80">NIST AI RMF &bull; ISO/IEC 42001 &bull; EU AI Act &bull; OWASP Agentic Top 10</p>
        </div>
      </div>
    </div>
  );
}
