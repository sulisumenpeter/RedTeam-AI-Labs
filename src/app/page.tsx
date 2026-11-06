import type { Metadata } from "next";
import { LandingPageContent } from "../components/landing/LandingPageContent";

export const metadata: Metadata = {
  title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
  description:
    "The Mandatory Assurance Layer for Autonomous Enterprise AI. Automated adversarial red-teaming, quantitative 5x5 risk scoring, agentic MCP tool inspection, and statutory compliance cross-walking for generative models and autonomous agents.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
    description:
      "The Mandatory Assurance Layer for Autonomous Enterprise AI. Automated adversarial red-teaming, quantitative 5x5 risk scoring, agentic MCP tool inspection, and statutory compliance cross-walking for generative models and autonomous agents.",
    url: "/",
    siteName: "RedTeam AI Labs",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "RedTeam AI Labs Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
    description:
      "The Mandatory Assurance Layer for Autonomous Enterprise AI. Automated adversarial red-teaming, quantitative 5x5 risk scoring, agentic MCP tool inspection, and statutory compliance cross-walking for generative models and autonomous agents.",
    images: ["/icon.svg"],
  },
};

export default function Page() {
  return <LandingPageContent />;
}
