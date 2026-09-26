# RedTeam AI Lab 🛡️

**Test your AI before your users do.**

RedTeam AI Lab is an autonomous AI safety and governance testing platform. It translates your abstract governance requirements into deterministic, adversarial testing campaigns. 

The architecture follows a strict principle: **The LLM Proposes, The Backend Disposes**. Generative models (like Google Gemini) are used to aggressively red-team and evaluate the target AI, but all final severity mapping, policy enforcement, and audit reporting are strictly managed by a deterministic Next.js backend and persisted safely in a Supabase PostgreSQL database.

## Features

- **Governance Policy Builder:** Define strict rules (e.g. "No hallucinated legal claims", "No disparate treatment").
- **Deterministic Fuzzing:** The AI Engine automatically generates a 30-test adversarial campaign targeted directly at your policy.
- **Live Execution Pipeline:** Watch as chunked batches of attacks are fired at your target system.
- **Visual Evidence Inspector:** Drill down into specific findings to see exactly what the attacker did, what the AI responded with, and how it was evaluated.
  - *Bias Traces:* Side-by-side comparison of demographic friction.
  - *Hallucination Traces:* Line-by-line grounding against the approved Knowledge Base.
- **Audit-Ready Reporting:** 1-click export of beautifully formatted, XSS-sanitized HTML Governance Reports.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes (Modular Monolith)
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini 1.5 Pro / Flash via Vercel AI SDK

## Setup & Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```
4. Run the database migrations located in `supabase/migrations/` against your Supabase instance.
5. Start the development server:
   ```bash
   npm run dev
   ```

## Disclaimer
RedTeam AI Lab identifies reproducible safety and governance failures under a defined evaluation policy. It does not prove an AI system is 100% safe, and its output does not constitute legal advice.
