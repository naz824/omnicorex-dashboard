# OmnicoreX Working Memory

> This file is automatically loaded at the start of every Claude Code session.
> It contains the current state of the business and recent context.
> Last updated: 2026-03-21

## Current State

### Business Status
- **Stage:** Pre-revenue, building infrastructure
- **Founder:** Nasir Chase (naz824) — idris.nm.chase@gmail.com
- **Location:** Virginia, USA
- **Focus:** AI-powered digital services for local businesses

### Active Infrastructure
- **Dashboard:** https://omnicorex-dashboard.vercel.app (LIVE, 11 API endpoints)
- **GitHub:** https://github.com/naz824/omnicorex-dashboard
- **Backend:** Vercel Serverless Functions (mock data, PostgreSQL-ready)
- **Database:** NOT YET CONNECTED — Needs Neon PostgreSQL via Vercel Storage
- **Supabase:** PAUSED (billing issues, cannot create new projects)

### Tech Stack
- React 18 + TypeScript 5.9 (strict) + Vite 8 + Tailwind CSS v4
- Vercel Serverless Functions (11 endpoints, Hobby plan 12-function limit)
- `.npmrc` with `legacy-peer-deps=true` for Vercel builds

### Agent System
- 8 specialized agents: Apex, Nova, Meridian, Prism, Vertex, Nexus, Sentinel, Compass
- Configured in `.claude/agents/` with model assignments and tool permissions
- 7 MCP servers: github, filesystem, fetch, memory, sequential-thinking, brave-search, postgres

## Recent Decisions

1. Pivoted from Supabase to Vercel Serverless Functions due to billing lock
2. Consolidated 21 API endpoints to 11 (Vercel Hobby 12-function limit)
3. Using mock data with auto-PostgreSQL fallback when DATABASE_URL is set
4. Built complete Claude Code project structure for terminal agent system
5. Implemented multi-layer memory persistence system

## Pending Actions

- [ ] Connect Neon PostgreSQL database (user needs to accept Neon integration in Vercel dashboard)
- [ ] Set up two client websites (user mentioned having new clients)
- [ ] Test full agent orchestration workflow end-to-end
- [ ] Set up Stripe integration for payment processing
- [ ] Configure Google Business Profile automation

## Key Learnings

- Vite 8 + React 19.2 causes peer dependency conflicts on Vercel → `.npmrc` fix
- Vercel Hobby plan maxes at 12 serverless functions → consolidate endpoints
- Dynamic `import('pg')` prevents build errors when pg not installed locally
- `erasableSyntaxOnly` in tsconfig.app.json prevents constructor parameter properties
- Supabase realtime `.on()` needs `as never` casts for TypeScript 5.9 strict mode

## Client Intelligence

No active clients yet. Two prospects mentioned by Nasir (details pending).

## Session Counter

Total sessions: 5 (across multiple Cowork conversations)
