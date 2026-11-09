"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Target,
  Flame,
  Wrench,
  Archive,
  BarChart3,
  Settings,
  ChevronDown,
  Building2,
  CheckCircle,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  PlusCircle,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

const NAVIGATION_GROUPS = [
  {
    group: "OPERATIONAL GOVERNANCE",
    items: [
      { name: "Overview", href: "/overview", icon: LayoutDashboard },
      { name: "AI Inventory", href: "/systems", icon: Server },
      { name: "Risk Management", href: "/risks", icon: AlertTriangle },
      { name: "Governance", href: "/policies", icon: FileText },
    ],
  },
  {
    group: "EMPIRICAL ASSURANCE",
    items: [
      { name: "AI Assurance", href: "/campaigns", icon: Target },
      { name: "Frameworks", href: "/frameworks", icon: ShieldCheck },
      { name: "Incidents", href: "/incidents", icon: Flame },
      { name: "Remediation", href: "/remediation", icon: Wrench },
    ],
  },
  {
    group: "AUDIT & INFRASTRUCTURE",
    items: [
      { name: "Evidence", href: "/evidence", icon: Archive },
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SessionUser {
  id: string;
  email: string;
  role: string;
}

interface SessionWorkspace {
  id: string;
  name?: string;
  role: string;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [workspace, setWorkspace] = useState<SessionWorkspace | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated) {
            setUser(data.user);
            setWorkspace(data.workspace);
            setIsDemo(Boolean(data.isDemo));
          }
        }
      } catch {
        // Fall back gracefully
      }
    }

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [isLoginPage]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const userDisplayName = user?.email ? user.email.split("@")[0] : "Assessor";
  const userRole = user?.role || "ASSESSOR";

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-rose-500 selection:text-white">
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop fixed, Mobile sliding drawer) */}
      <aside
        aria-label="Sidebar Navigation"
        className={`w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl text-slate-300 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl shadow-rose-950/50" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
          <Link href="/overview" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 border border-rose-500/40 flex items-center justify-center text-white font-bold text-sm shadow-glow-crimson group-hover:scale-105 transition-transform">
              🛡️
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center">
                RedTeam AI <span className="text-rose-400 ml-1.5 text-xs font-semibold uppercase tracking-wider">Labs</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
                Enterprise Assurance
              </div>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items grouped by operational domain */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAVIGATION_GROUPS.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <div className="px-3 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                {grp.group}
              </div>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/overview" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                      isActive
                        ? "bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-rose-400" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 ml-auto shrink-0 shadow-glow-crimson" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Workspace Pill / Evaluation Notice */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="flex items-center text-teal-400 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-teal-400 mr-1.5 animate-pulse" />
                {isDemo ? "DEMO EVALUATION" : "ENTERPRISE LIVE"}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {userRole}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium truncate">
              {workspace?.name || "Legal AI Systems Workspace"}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              OWASP ASI-01–04 &bull; NIST AI RMF
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER (Responsive padding-left for mobile: pl-0 on mobile, pl-64 on desktop) */}
      <div className="flex-1 pl-0 md:pl-64 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          {/* Left: Mobile hamburger & Workspace Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Hamburger Button on Mobile */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors max-w-[200px] sm:max-w-xs truncate"
                aria-expanded={workspaceMenuOpen}
                aria-label="Active workspace selector"
              >
                <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{workspace?.name || "Legal AI Systems Workspace"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-40 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 text-slate-400 font-mono font-bold uppercase text-[9px] tracking-wider">
                    Active Tenant Workspace
                  </div>
                  <div className="px-3 py-2 text-slate-200 font-semibold flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{workspace?.name || "Legal AI Systems Workspace"}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {workspace?.id?.slice(0, 8)}...</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-3 py-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    Workspace isolation strictly enforced (IDOR prevention)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Launch CTA & User Profile Menu */}
          <div className="flex items-center space-x-3">
            {/* Fast Assessment CTA */}
            <Link
              href="/campaigns/new"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-glow-crimson transition-all"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Launch Assessment</span>
            </Link>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-xs font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors"
                aria-expanded={userMenuOpen}
                aria-label="User account menu"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-rose-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  {userInitial}
                </div>
                <span className="hidden sm:inline truncate max-w-[120px]">{userDisplayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-40 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <div className="text-white font-bold truncate">{user?.email || "assessor@redteam.internal"}</div>
                    <div className="text-[10px] text-teal-400 font-mono font-semibold uppercase mt-0.5">
                      Role: {userRole}
                    </div>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Target Settings &amp; Keys</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors text-left border-t border-slate-800 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#090D16] ambient-mesh min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
