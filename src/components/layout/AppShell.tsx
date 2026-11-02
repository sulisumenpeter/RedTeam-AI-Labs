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
  Bell,
  ChevronDown,
  Building2,
  CheckCircle,
  LogOut,
  User,
  Shield,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "AI Inventory", href: "/systems", icon: Server },
  { name: "Risk Management", href: "/risks", icon: AlertTriangle },
  { name: "Governance", href: "/policies", icon: FileText },
  { name: "Frameworks", href: "/frameworks", icon: ShieldCheck },
  { name: "AI Assurance", href: "/campaigns", icon: Target },
  { name: "Incidents", href: "/incidents", icon: Flame },
  { name: "Remediation", href: "/remediation", icon: Wrench },
  { name: "Evidence", href: "/evidence", icon: Archive },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [workspace, setWorkspace] = useState<SessionWorkspace | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render plain container without shell chrome
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
  const userDisplayName = user?.email ? user.email.split("@")[0] : "Authenticated User";
  const userRole = user?.role || "ASSESSOR";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-base shadow-sm">
              🛡️
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight flex items-center">
                RedTeam AI <span className="text-teal-400 ml-1 text-xs font-semibold">Labs</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Governance &amp; Assurance
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname === "/overview"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Workspace Pill / Evaluation Notice */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center text-teal-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                {isDemo ? "Evaluation Mode" : "Enterprise Workspace"}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-teal-900/60 text-teal-300 border border-teal-700/50">
                {userRole}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {workspace?.name || "Legal AI Systems Workspace"}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-xs">
          {/* Workspace Switcher */}
          <div className="relative">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-800 bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{workspace?.name || "LexHack Legal Technology Workspace"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  Active Tenant Workspace
                </div>
                <div className="px-3 py-2 text-slate-800 font-semibold flex items-center justify-between">
                  <div>
                    <div>{workspace?.name || "LexHack Legal Technology Workspace"}</div>
                    <div className="text-[10px] text-slate-500 font-normal font-mono truncate">
                      ID: {workspace?.id || "demo-legal-workspace-001"}
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                </div>
              </div>
            )}
          </div>

          {/* Right Topbar Actions */}
          <div className="flex items-center space-x-4">
            {isDemo && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Shield className="w-3 h-3 text-amber-500" />
                Fellowship Demo Active
              </span>
            )}

            <button
              className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"></span>
            </button>

            <div className="h-5 w-px bg-slate-200"></div>

            {/* Authenticated User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-300 font-semibold text-xs flex items-center justify-center border border-slate-700">
                  {userInitial}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900">{userDisplayName}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{userRole.toLowerCase()} &bull; RedTeam AI</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">{user?.email || "Authenticated User"}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Role: {userRole}</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-left font-medium border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
