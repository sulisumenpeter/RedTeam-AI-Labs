import type { Metadata } from "next";
import { LandingPageContent } from "../components/landing/LandingPageContent";

export const metadata: Metadata = {
  title: "RedTeam AI Labs | AI Governance, Risk & Assurance Platform",
  description:
    "Make sure your AI chatbots and assistants are safe, compliant, and trustworthy before your customers use them. Automated red-teaming, risk scoring, and audit reports.",
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
      "Make sure your AI chatbots and assistants are safe, compliant, and trustworthy before your customers use them. Automated red-teaming, risk scoring, and audit reports.",
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
      "Make sure your AI chatbots and assistants are safe, compliant, and trustworthy before your customers use them. Automated red-teaming, risk scoring, and audit reports.",
    images: ["/icon.svg"],
  },
};

export default function Page() {
  return <LandingPageContent />;
}
