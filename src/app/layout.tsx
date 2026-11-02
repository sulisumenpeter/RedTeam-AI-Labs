import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
  description:
    "Integrated platform to register AI systems, assess and manage AI risks, implement governance controls, evaluate AI behavior, and maintain auditable evidence throughout the AI lifecycle.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
