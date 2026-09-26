import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-8 flex items-center justify-start">
        <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
          <ShieldAlert className="w-14 h-14 text-red-600" />
          <span className="text-4xl font-black text-red-600 tracking-tight">RedTeam AI Lab</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl space-y-8 flex flex-col items-center -mt-32">

        <h1 className="text-5xl md:text-6xl font-black text-red-600 tracking-tight leading-tight">
          Test your AI before <br /> your users do.
        </h1>
        <p className="text-xl text-zinc-600">
          Turn governance requirements into adversarial tests, evidence, and audit-ready findings.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mt-12">
          <Link href="/policy" className="bg-zinc-900 text-white px-8 py-4 rounded-md font-bold hover:bg-zinc-800 transition shadow-md hover:shadow-lg">
            Run Safety Audit
          </Link>
          <Link href="/campaigns/demo" className="bg-white text-zinc-900 border border-zinc-300 px-8 py-4 rounded-md font-bold hover:bg-zinc-50 transition shadow-sm hover:shadow">
            View Demo Campaign
          </Link>
        </div>
        </div>
      </main>
    </div>
  );
}
