import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RedTeam AI",
  description: "Autonomous AI Safety & Governance Testing Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}
