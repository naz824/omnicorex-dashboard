# OmnicoreX Claude Code System

Welcome to the OmnicoreX autonomous business agent system. This directory contains all configurations, rules, and agent definitions for running OmnicoreX as a fully autonomous Claude Code project.

## Quick Start

```bash
# 1. Setup the environment
./scripts/setup-claude-code.sh

# 2. Check agent health
/health

# 3. View dashboard
# Open https://omnicorex-dashboard.vercel.app in your browser

# 4. Give Apex a goal
# "Find 5 leads in the dental space"
# "Build website for Johnson Dental"
# "Generate weekly performance report"
```

## Directory Structure

```
.claude/
├── README.md                    # This file
├── settings.json                # Permissions, tools, hooks
├── mcp.json                     # MCP server configurations
│
├── agents/                      # 8 specialized agent configs
│   ├── apex.md                 # Orchestrator (Claude Opus)
│   ├── nova.md                 # Sales & Lead Generation
│   ├── meridian.md             # Marketing & Content
│   ├── prism.md                # Design & Branding
│   ├── vertex.md               # Frontend Development
│   ├── nexus.md                # Backend Development
│   ├── sentinel.md             # Quality Assurance
│   └── compass.md              # Operations & Client Management
│
├── rules/                       # Business operational rules
│   ├── business-operations.md  # Client protocols, approval workflows, SLA
│   ├── code-standards.md       # TypeScript, React, Tailwind, git conventions
│   └── security.md             # Secrets, API security, data protection
│
├── skills/                      # Executable custom skills (if needed)
│   ├── prospect/
│   ├── outreach/
│   ├── design-website/
│   ├── deploy-site/
│   └── report/
│
└── hooks/                       # Automation scripts
    ├── post-edit.sh           # Log file changes after edits
    └── on-stop.sh             # Summarize work and update dashboard
```

## System Architecture

```
NASIR CHASE (Founder)
    ↓
    ↓ Goals & Approvals
    ↓
APEX (Orchestrator)
    ├─→ NOVA (Sales)           — Find & qualify leads
    ├─→ MERIDIAN (Marketing)   — SEO, content, Google Business
    ├─→ PRISM (Design)         — Website mockups, branding
    ├─→ VERTEX (Frontend)      — React/Next.js development
    ├─→ NEXUS (Backend)        — API, database, integrations
    ├─→ SENTINEL (QA)          — Testing, accessibility, security
    └─→ COMPASS (Operations)   — Client management, scheduling
    ↓
    ↓ Updates & Approvals
    ↓
DASHBOARD (https://omnicorex-dashboard.vercel.app)
    └─ Pipeline, Projects, Revenue, Approvals, Activity Log
```

## Key Files

### Master Instruction
- **CLAUDE.md** (project root) — Start here! This is your master instruction for the entire OmnicoreX business system.

### Agent Configurations
Each agent has:
- **Model** — Which Claude model (Opus, Sonnet, Haiku)
- **Purpose** — What this agent does
- **Tools** — What MCP servers and tools it can use
- **System Prompt** — Detailed instructions for how to think and operate
- **Responsibilities** — Specific tasks this agent owns
- **Reference Information** — Examples, templates, best practices

### Rules
Read these carefully — they govern how OmnicoreX operates:

1. **business-operations.md** — Client communication protocols, approval workflows, SLAs, pricing, onboarding
2. **code-standards.md** — TypeScript strict mode, React hooks, Tailwind CSS, git conventions, testing
3. **security.md** — Secrets management, API security, authentication, data protection, OWASP compliance

## How OmnicoreX Works

### 1. Nasir Gives a Goal
```
Nasir: "Find 5 new leads in the dental space this week"
```

### 2. Apex Decomposes It
```
Apex: [EXTENDED THINKING]
This goal requires:
  1. Market research (what dentists in VA are potential clients?)
  2. Lead scoring (MEDDIC qualification)
  3. Lead research (company info, decision maker, pain points)
  4. Outreach drafting (personalized email sequences)
  5. CRM updates (dashboard updates)

Route to:
  - Nova: Lead research & MEDDIC scoring
  - Meridian: Market analysis (optional support)
  - Compass: Track progress and dashboard updates

Timeline: Monday-Friday (5 business days)
```

### 3. Nova Executes
```
Nova: Researches dental practices in Virginia
  - Searches Google Maps for "dentist near me" + Virginia cities
  - Scores each prospect using MEDDIC (0-100)
  - Prioritizes top 5 (score >70)
  - Identifies decision maker (owner/principal)
  - Finds contact info
  - Flags for outreach
```

### 4. Compass Prepares Outreach
```
Compass: Drafts personalized outreach sequence
  - Day 1: Initial email [PENDING APPROVAL]
  - Day 3: Follow-up email [PENDING APPROVAL]
  - Day 7: Final email [PENDING APPROVAL]
```

### 5. Nasir Approves or Revises
```
Nasir: Reviews Nova's leads and Compass's outreach
  - Lead 1: "Good, approve outreach"
  - Lead 2: "Needs better pain point research, revise"
  - Lead 3: "Approve"
  - ...etc
```

### 6. Nova Sends Outreach
```
Nova: Sends approved emails via Gmail API
  - Logs activity to dashboard
  - Tracks responses
  - Follows up based on engagement
```

### 7. Apex Reports Back
```
Apex: Reports to Nasir
  - 5 leads identified and scored
  - 3 outreach sequences sent
  - 1 reply received (interested)
  - Next: Schedule kickoff call
  - Dashboard updated
```

## Agent Specialization

### APEX — The CEO
- **Thinks about:** Strategic goals, resource allocation, timeline management
- **Decides:** Which agent owns which task, when to escalate, approval gates
- **Tools:** Extended thinking, agent routing, dashboard APIs
- **When to use:** When decomposing complex goals, managing multiple agent threads

### NOVA — The Sales Professional
- **Thinks about:** Lead quality, qualification frameworks, sales psychology, objections
- **Decides:** Which prospects to pursue, when to disqualify, pitch angles
- **Tools:** Web search, browser automation, memory (successful pitches)
- **When to use:** Finding leads, scoring leads, drafting proposals, handling objections

### MERIDIAN — The Marketer
- **Thinks about:** Keywords, content strategy, competitive positioning, customer psychology
- **Decides:** What content to create, which keywords to target, how to differentiate
- **Tools:** Web search, browser automation, content creation
- **When to use:** SEO optimization, content strategy, competitor analysis, copy writing

### PRISM — The Designer
- **Thinks about:** Visual hierarchy, typography, color psychology, user experience, conversion
- **Decides:** Design direction, color palette, component system, responsiveness
- **Tools:** Design documentation, component libraries, responsive layouts
- **When to use:** Creating design mockups, establishing design systems, brand guidelines

### VERTEX — The Frontend Engineer
- **Thinks about:** React architecture, performance, accessibility, user interaction
- **Decides:** Component structure, state management, optimization strategies
- **Tools:** React, TypeScript, Tailwind CSS, code editor
- **When to use:** Building components, implementing designs, optimizing performance

### NEXUS — The Backend Engineer
- **Thinks about:** Database schema, API design, security, integrations, deployment
- **Decides:** Database structure, API endpoints, integration strategies, deployment process
- **Tools:** API development, database, integrations (Stripe, Gmail), deployment
- **When to use:** Building APIs, designing databases, integrating third-party services, deploying

### SENTINEL — The QA Engineer
- **Thinks about:** Quality standards, test coverage, security vulnerabilities, accessibility, performance
- **Decides:** What to test, whether code meets standards, what needs to be fixed
- **Tools:** Code analysis, testing frameworks, accessibility audits, performance testing
- **Read-only:** Cannot modify code (analysis and reporting only)
- **When to use:** Code review, performance testing, accessibility audits, security scanning

### COMPASS — The Operations Manager
- **Thinks about:** Client experience, timelines, logistics, communication, success metrics
- **Decides:** Onboarding process, project scheduling, communication strategy, next steps
- **Tools:** Client communication, scheduling, documentation, dashboard updates
- **When to use:** Client onboarding, project management, status reporting, client success

## Configuration Files

### settings.json
Controls what tools each agent can use:
- **allow** — Tools available to all agents
- **deny** — Tools forbidden globally (e.g., `rm -rf`)
- **ask** — Tools that require explicit user approval
- **hooks** — Automation scripts that trigger on events
- **autoMemoryEnabled** — Persistent cross-session learning

### mcp.json
Configures MCP (Model Context Protocol) servers:
- **mcpServers** — Definitions for each MCP service
  - github — Repository management
  - filesystem — File access
  - fetch — HTTP requests
  - memory — Persistent key-value store
  - sequential-thinking — Extended thinking
  - brave-search — Web search
  - postgres — Database access
- **environmentVariables** — Secrets mapping
- **toolOverrides** — Agent-specific tool restrictions

## Approval Workflow

Items requiring Nasir approval are tagged with `[PENDING APPROVAL]`:

1. **Client Communications** — Any email, proposal, contract to client
2. **Design Mockups** — Design concepts before development
3. **Code Changes** — Major architectural decisions
4. **Financial Commitments** — Pricing, discounts, financial decisions
5. **Contract Language** — Terms, warranties, liability
6. **QA Issues** — Blocker-level bugs

When something is pending approval:
- Posted to dashboard
- Logged in activity feed
- Flagged to Nasir via email
- Awaits response within 24h (critical) or 48h (normal)
- If rejected, agent revises and resubmits

## Dashboard Integration

The dashboard (https://omnicorex-dashboard.vercel.app) is the real-time command center:

**Pipeline** — Track leads through sales stages
**Projects** — View project status, timeline, team assignments
**Revenue** — Real-time revenue, pending payments, invoices
**Approvals** — Queue of pending approvals (design, copy, contracts, financial)
**Activity Log** — Complete audit trail of all agent actions
**Team Health** — Agent status, current tasks, blockers

Agents update the dashboard via the API after completing actions:
```bash
./scripts/dashboard-sync.sh \
  --action "project_status_update" \
  --project_id "johnson_dental_website" \
  --status "in_development" \
  --progress 45 \
  --next_milestone "Design approval" \
  --deadline "2026-03-25"
```

## Memory & Learning

OmnicoreX persists learnings across sessions using built-in memory:

**What gets remembered:**
- Successful sales pitch angles (by industry)
- Common objections and how Nova overcame them
- Design patterns that converted well
- Which industries convert best
- Winning copy and email templates
- Competitive positioning strategies
- Common client requirements
- Performance optimization patterns
- Security issues and fixes

**Query memory in any agent:**
```
"Show me successful dental practice sales pitches"
"What objections do HVAC companies raise?"
"Show winning website layouts for restaurants"
```

**Record learnings:**
After completing work, agents log insights:
```
Learning: Dental practices convert best with "emergency service" + "24/7" messaging
Learning: Restaurant websites that show food photos 3x outperform text-only
Learning: Budget objection overcome by showing 5x ROI in first 90 days
```

## Security & Secrets

### .env.local (Your Machine)
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
GITHUB_TOKEN=ghp_xxx
```

### Vercel Environment Variables
Production secrets stored securely in Vercel dashboard:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `GMAIL_REFRESH_TOKEN`
- `GITHUB_TOKEN`

### Never Commit
- .env.local (git-ignored)
- API keys in code
- Database passwords
- Refresh tokens
- Private credentials

Sentinel QA will catch and flag these before deployment.

## Useful Commands

### Setup
```bash
./scripts/setup-claude-code.sh    # Initial setup
```

### Dashboard Sync
```bash
./scripts/dashboard-sync.sh --action "project_status_update" --project_id "xyz" --status "in_development" --progress 50
```

### Code Quality
```bash
npm run type-check              # TypeScript validation
npm run test                    # Run tests
npm run test:coverage           # Code coverage report
npm run build                   # Build for production
npx tsc --noEmit               # Type checking only
```

### Git
```bash
git log --oneline               # View recent commits
git diff main                   # View changes since main
git status                      # Show changed files
git add .                       # Stage changes
git commit -m "[AGENT] type: description"   # Atomic commit
git push -u origin agent/feature-name       # Push feature branch
```

## Getting Help

### Within Claude Code Session
- `/health` — Check agent health and MCP connectivity
- `/status` — View business dashboard
- `/memory [query]` — Search persistent memory

### Reviewing Rules
- Read CLAUDE.md (master instruction)
- Review .claude/agents/[agent].md for specific agent capabilities
- Check .claude/rules/ for operational protocols

### Dashboard
Visit https://omnicorex-dashboard.vercel.app to see:
- Real-time pipeline and projects
- Pending approvals
- Activity log
- Team status

## Customization

### Adding New Business Rules
1. Edit .claude/rules/business-operations.md
2. Document the rule clearly
3. Reference it in CLAUDE.md
4. All agents will follow the rule

### Updating Agent Capabilities
1. Edit .claude/agents/[agent].md
2. Update tools, model, responsibilities
3. Test with `/health` command
4. Verify in next session

### Adding New Integrations
1. Update .claude/mcp.json with new server config
2. Update agent permissions in settings.json
3. Document in agent files
4. Test connectivity

## Monitoring & Debugging

### Activity Log
```bash
tail -f .claude/activity.log       # Watch activity in real-time
tail -f .claude/session.log        # View session summaries
```

### Type Checking (Before Committing)
```bash
npx tsc --noEmit
```

### Lint & Format
```bash
npm run lint                       # TypeScript linting
npm run format                     # Auto-format code
```

### Performance
```bash
npm run lighthouse                 # Run Lighthouse audit
npm run analyze                    # Analyze bundle size
```

## Support

- **Nasir:** Contact naz824 with strategic direction or approvals
- **Dashboard Issues:** Check https://omnicorex-dashboard.vercel.app/api/health
- **Agent Issues:** Check .claude/settings.json and agent configurations
- **Code Issues:** Review error messages, check .claude/rules/security.md

---

**OmnicoreX — Autonomous AI services for local Virginia businesses.**

Built with Claude Code. Powered by Anthropic. Owned by Nasir Chase.
