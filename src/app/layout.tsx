import "./globals.css";
import type { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#dc2626",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
    template: "%s | RedTeam AI Labs",
  },
  description:
    "Integrated platform to register AI systems, assess and manage AI risks, implement governance controls, evaluate AI behavior, and maintain auditable evidence throughout the AI lifecycle.",
  applicationName: "RedTeam AI Labs",
  authors: [{ name: "RedTeam AI Labs" }],
  generator: "Next.js",
  keywords: [
    "AI Governance",
    "AI Risk Management",
    "AI Assurance",
    "AI Safety Testing",
    "Red-Teaming",
    "NIST AI RMF",
    "EU AI Act",
    "ISO 42001",
  ],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
    description:
      "Integrated platform to register AI systems, assess and manage AI risks, implement governance controls, evaluate AI behavior, and maintain auditable evidence throughout the AI lifecycle.",
    url: siteUrl,
    siteName: "RedTeam AI Labs",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "RedTeam AI Labs Shield Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
    description:
      "Integrated platform to register AI systems, assess and manage AI risks, implement governance controls, evaluate AI behavior, and maintain auditable evidence throughout the AI lifecycle.",
    images: ["/icon.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-teal-500 rounded-lg shadow-md font-semibold text-xs"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
