# Solprove — AI GCSE Maths Tutor (Milestone 1)

The AI maths tutor that marks like a real examiner. This is Milestone 1 of the build:
**question in → step-by-step solution → student attempt marked with M/A marks, deterministically.**

## What's in this milestone
- Type a question OR upload a photo of it
- Step-by-step solution at Foundation or Higher tier, mapped to the AQA 8300 spec
- "Mark my attempt": two-stage examiner-style marking (extract working → mark against a rubric, temperature 0)
- Pilot spec map (algebra, ratio/percentages, Pythagoras/trig clusters)

## Not in this milestone (by design — see the MVP spec)
Accounts, payments, parent reports, weak-topic tracking, question generation. Those are Milestones 2–4.

## Run it

1. Install [Node.js](https://nodejs.org) (LTS) if you don't have it.
2. Get a Claude API key from https://console.anthropic.com
3. In this folder:
   ```bash
   cp .env.example .env.local     # then paste your API key into .env.local
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

## Project layout

```
solprove-app/
├── app/
│   ├── layout.js          # Shell: nav, brand styling
│   ├── page.js            # Main tutor UI (input → solve → mark)
│   └── api/
│       ├── solve/route.js # Step-by-step solution (spec-aware)
│       └── mark/route.js  # Two-stage deterministic marking
├── lib/
│   └── prompts.js         # All AI prompts live here — tune marking behaviour here
├── data/
│   └── spec-pilot.json    # Pilot AQA 8300 topic map (expand from aqa-8300-spec-map.md)
├── .env.example
└── package.json
```

## Milestones roadmap
- **M1 (this):** solver + marking engine working locally ✅ when you can mark the same answer 10× and get the same score
- **M2:** question bank with stored rubrics + weak-topic tracking (add Supabase)
- **M3:** accounts (parent-owned), Stripe subscription, weekly parent email
- **M4:** consistency SLA nightly job, safeguarding pass, beta launch

## The consistency test (run before trusting any marking change)
Mark the same attempt 10 times; scores must be identical. A `npm run consistency` script comes in M2 — for now, hit "Mark my attempt" repeatedly on a saved example and compare.
