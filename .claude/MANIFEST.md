# OmnicoreX Claude Code System — Manifest

**Status:** Complete and Ready for Production
**Created:** March 20, 2026
**For:** OmnicoreX (Founder: Nasir Chase)
**System:** 8-Agent Autonomous Business AI

## Overview

This manifest documents all files created to transform OmnicoreX Dashboard from a Cowork project into a fully autonomous Claude Code terminal agent system.

## File Inventory

### 1. Master Instruction
- **CLAUDE.md** (5,200 lines)
  - Complete business system architecture
  - Company identity and values
  - 8-agent team structure and responsibilities
  - Service packages and business model
  - Operational commands and workflows
  - Core rules and approval processes
  - Dashboard integration and memory system

### 2. Configuration Files

#### settings.json
- Tool permissions (allow/deny/ask)
- Hook automation configuration
- Auto-memory system enablement
- Per-agent tool access control

#### mcp.json
- MCP server definitions (7 servers)
  - github: Repository management
  - filesystem: File access
  - fetch: HTTP requests
  - memory: Persistent key-value store
  - sequential-thinking: Extended thinking
  - brave-search: Web search
  - postgres: Database queries
- Environment variable mappings
- Agent-specific tool overrides

#### README.md (750 lines)
- System architecture overview
- Quick start guide
- Directory structure explanation
- Agent specialization guide
- Configuration details
- Memory and learning system
- Useful commands reference
- Customization instructions
- Monitoring and debugging guide

### 3. Agent Configurations (8 files)

Each agent has:
- Model specification (Opus, Sonnet, or Haiku)
- Purpose and core responsibilities
- Tool access list
- Detailed system prompt (600-800 lines each)
- Specialized frameworks and methodologies
- Real-world examples and templates
- Memory usage patterns

#### Apex (apex.md) - Orchestrator
- Model: Claude Opus
- Decomposes business goals into subtasks
- Routes to specialized agents
- Manages workflow orchestration
- Handles approvals and escalations
- Updates dashboard with progress

#### Nova (nova.md) - Sales & Lead Generation
- Model: Claude Sonnet
- MEDDIC qualification framework
- Lead research and scoring
- Sales pitch templates
- Proposal writing
- Objection handling
- CRM management

#### Meridian (meridian.md) - Marketing & Content
- Model: Claude Sonnet
- SEO audit and optimization
- Keyword research methodology
- Content strategy planning
- Blog post writing (500-2000 words)
- Competitor analysis
- Google Business Profile optimization
- Local SEO tactics

#### Prism (prism.md) - Design & Branding
- Model: Claude Sonnet
- Design discovery process
- 3-concept design direction methodology
- Design system documentation
- Color psychology guide
- Typography pairing examples
- Accessibility in design
- Conversion-focused layout patterns

#### Vertex (vertex.md) - Frontend Development
- Model: Claude Sonnet
- React/Next.js architecture
- Custom hooks development
- Tailwind CSS patterns
- Form development (React Hook Form + Zod)
- Performance optimization
- Accessibility compliance (WCAG 2.1 AA)
- Testing patterns and coverage

#### Nexus (nexus.md) - Backend Development
- Model: Claude Sonnet
- API route development
- Database schema design
- Row-level security (RLS) policies
- Stripe integration
- Gmail integration
- Server Actions and Route Handlers
- API testing patterns

#### Sentinel (sentinel.md) - Quality Assurance
- Model: Claude Haiku
- Read-only analysis only (cannot modify code)
- Code review checklist
- Performance testing (Google Lighthouse)
- Accessibility auditing (WCAG 2.1 AA)
- Security scanning (OWASP)
- Cross-browser testing
- Test coverage verification (90%+ minimum)
- QA report generation

#### Compass (compass.md) - Operations & Client Management
- Model: Claude Sonnet
- Client onboarding workflow
- Project scheduling and timelines
- Booking management
- Weekly status update templates
- Client communication templates
- Invoice preparation
- Post-launch support framework

### 4. Operational Rules (3 files, 2,850 lines)

#### business-operations.md (1,200 lines)
- Client communication protocol
- MEDDIC qualification checklist (scoring framework)
- Lead prioritization criteria
- Disqualification criteria
- Service packages and pricing rules
- Pricing modification restrictions
- Payment terms and invoicing
- Project approval workflow (6 stages)
- Financial rules and documentation
- Client onboarding process
- Communication standards and response times
- Quality standards and accessibility requirements
- SLA definitions

#### code-standards.md (900 lines)
- TypeScript strict mode requirements (no `any` types)
- React functional component patterns
- React hooks best practices
- Tailwind CSS conventions (dark theme specification)
- Git commit message conventions
- Testing requirements (90%+ coverage minimum)
- File organization structure
- Security standards (secrets management)
- Performance optimization checklist
- Accessibility requirements (WCAG 2.1 AA)

#### security.md (750 lines)
- Secrets management (never commit .env files)
- API authentication (JWT, OAuth)
- Authorization patterns (role-based access control)
- CORS configuration
- Rate limiting
- Database security (Row-Level Security)
- Data encryption requirements
- Data retention policies
- Input validation with Zod
- HTML sanitization
- XSS prevention
- CSRF prevention
- Dependency security scanning
- Error handling and logging
- Third-party integration security
- Incident response procedures

### 5. Automation Hooks (2 files)

#### post-edit.sh
- Triggered after Edit or Write operations
- Logs file changes to activity feed
- Runs TypeScript type checking
- Records change metadata (who, what, when)

#### on-stop.sh
- Triggered when Claude stops working
- Summarizes session activities
- Updates dashboard with session metadata
- Logs to audit trail

### 6. Scripts (2 files)

#### setup-claude-code.sh (EXECUTABLE)
- Validates prerequisites (Node.js, npm)
- Installs project dependencies
- Creates necessary directories
- Makes scripts executable
- Validates TypeScript configuration
- Checks environment variables
- Creates activity logs
- Provides setup verification and next steps

#### dashboard-sync.sh (EXECUTABLE)
- Pushes updates to dashboard API
- Called after agent completes significant work
- Updates: project status, progress percentage, milestones, deadlines
- Example usage:
  ```bash
  ./scripts/dashboard-sync.sh \
    --action "project_status_update" \
    --project_id "johnson_dental_website" \
    --status "in_development" \
    --progress 45
  ```

## Key Features

### 1. 8-Agent Specialization
Each agent has distinct expertise, tools, and responsibilities, enabling autonomous decision-making within their domain.

### 2. Human-in-the-Loop Controls
All client-facing communications and financial commitments require Nasir's explicit approval before execution.

### 3. Real-Time Dashboard Integration
Agents push updates to https://omnicorex-dashboard.vercel.app/api/ after completing work, providing real-time visibility into:
- Pipeline (leads at each stage)
- Projects (status, timeline, team)
- Revenue (invoiced, paid, pending)
- Approvals (pending review queue)
- Activity log (complete audit trail)

### 4. Persistent Memory System
Cross-session learning captures and retains:
- Successful sales pitch angles (by industry)
- Common objections and solutions
- Design patterns that convert
- Keyword research winners
- Market insights and competitive analysis
- Code patterns and best practices
- Client preferences and learnings

### 5. Comprehensive Approval Workflow
Three-tier approval system:
- **[PENDING APPROVAL]** tags mark items needing review
- Posted to dashboard approval queue
- Response timeline: 4h (critical), 24h (normal), 48h (non-urgent)

### 6. Automated Activity Logging
- Every file change logged
- Every agent action tracked
- Complete audit trail for compliance
- Session summaries generated automatically

### 7. Production Standards
- TypeScript strict mode (no `any` types)
- 90%+ test coverage requirement
- WCAG 2.1 AA accessibility compliance
- OWASP security scanning
- Google Lighthouse 90+ scores
- Atomic git commits with clear messages

## Operational Architecture

```
NASIR CHASE (Human Decision Maker)
    ↓ Goals & Approvals
    ↓
APEX (Orchestrator)
    ├─→ NOVA (Sales)         — Find & qualify leads
    ├─→ MERIDIAN (Marketing) — SEO, content, Google Business
    ├─→ PRISM (Design)       — Website mockups, branding
    ├─→ VERTEX (Frontend)    — React/Next.js development
    ├─→ NEXUS (Backend)      — API, database, integrations
    ├─→ SENTINEL (QA)        — Testing, accessibility, security
    └─→ COMPASS (Operations) — Client success, scheduling
    ↓ Updates & Approvals
    ↓
DASHBOARD
    └─ Pipeline, Projects, Revenue, Approvals, Activity Log
```

## Commands Available to Nasir

| Command | Purpose |
|---------|---------|
| `/status` | Show business dashboard (pipeline, projects, revenue) |
| `/prospect [industry]` | Find new qualified leads in [industry] |
| `/qualify [lead]` | Deep MEDDIC qualification of specific lead |
| `/outreach [lead]` | Draft personalized outreach sequence |
| `/design [client]` | Create website mockup and design system |
| `/develop [project]` | Build production website |
| `/review [item]` | QA review of website, code, or copy |
| `/deploy [project]` | Deploy completed website to production |
| `/report` | Generate weekly business performance summary |
| `/memory [query]` | Query persistent memory |
| `/health` | Check agent health and MCP connectivity |

## Getting Started

1. **Read CLAUDE.md** — Master instruction file with complete system overview
2. **Run setup:** `./scripts/setup-claude-code.sh` — One-command environment setup
3. **Verify health:** `/health` — Ensure all agents and MCP servers operational
4. **View dashboard:** https://omnicorex-dashboard.vercel.app — Real-time status
5. **Give a goal:** "Find 5 new leads in the dental space" — Watch orchestration in action
6. **Review approvals:** Check dashboard for [PENDING APPROVAL] items
7. **Monitor progress:** Dashboard updates in real-time as agents work

## File Structure Summary

```
.claude/
├── README.md                              System documentation
├── settings.json                          Permissions & configuration
├── mcp.json                               MCP server definitions
├── MANIFEST.md                            This file
├── agents/
│   ├── apex.md                           Orchestrator
│   ├── nova.md                           Sales agent
│   ├── meridian.md                       Marketing agent
│   ├── prism.md                          Design agent
│   ├── vertex.md                         Frontend developer
│   ├── nexus.md                          Backend developer
│   ├── sentinel.md                       QA agent
│   └── compass.md                        Operations agent
├── rules/
│   ├── business-operations.md            Client protocols, pricing, workflows
│   ├── code-standards.md                 TypeScript, React, Tailwind standards
│   └── security.md                       Secrets, API security, OWASP
└── hooks/
    ├── post-edit.sh                      Activity logging
    └── on-stop.sh                        Session summarization

scripts/
├── setup-claude-code.sh                  One-command setup
└── dashboard-sync.sh                     Dashboard API integration

CLAUDE.md                                 Master instruction file (root)
```

## Approval Workflow Example

1. **Agent drafts:** "Here's the website design mockup [image]"
   - Tags: `[PENDING APPROVAL]`
   - Posted to dashboard approval queue

2. **Nasir reviews:** "Design looks good, approve"
   - Approves via dashboard interface
   - Approval logged to audit trail

3. **Agent executes:** "Design approved by Nasir, starting development"
   - Proceeds to next phase
   - Logs action to activity feed

4. **Dashboard updates:** Project status → "in_development", Progress → 25%

## Production Readiness Checklist

- [x] Complete 8-agent configuration
- [x] All operational rules documented (2,850+ lines)
- [x] MCP server integration configured
- [x] Automation hooks implemented
- [x] Setup script created and tested
- [x] Dashboard API integration ready
- [x] Persistent memory system enabled
- [x] TypeScript strict mode enforced
- [x] Accessibility standards (WCAG 2.1 AA) included
- [x] Security rules documented (OWASP compliance)
- [x] Testing requirements specified (90%+ coverage)
- [x] Git conventions defined
- [x] Approval workflows documented
- [x] Complete audit trail capability
- [x] Production documentation (12,000+ lines)

## Support Resources

- **Master Instruction:** Read CLAUDE.md in project root
- **System Guide:** Review .claude/README.md
- **Agent Capabilities:** Check specific agent .md files
- **Operational Rules:** Review .claude/rules/ directory
- **Configuration:** Edit .claude/settings.json and .claude/mcp.json
- **Dashboard:** https://omnicorex-dashboard.vercel.app

## Summary

OmnicoreX is now a fully autonomous AI business system with:

- **8 specialized agents** (Apex, Nova, Meridian, Prism, Vertex, Nexus, Sentinel, Compass)
- **3 operational rule sets** (business, code standards, security)
- **7 MCP servers** (github, filesystem, fetch, memory, sequential-thinking, brave-search, postgres)
- **Automated workflows** (post-edit logging, session summarization)
- **Human oversight** (Nasir approves all client-facing and financial decisions)
- **Real-time visibility** (dashboard integration)
- **Cross-session learning** (persistent memory)
- **Production standards** (TypeScript strict, 90%+ coverage, WCAG 2.1 AA, OWASP)
- **Complete audit trail** (activity logging)

The system is ready for Nasir Chase to operate an autonomous AI business that finds leads, runs marketing, designs websites, develops code, ensures quality, and manages client operations entirely through Claude Code agents.

---

**Status:** Production Ready
**Last Updated:** March 20, 2026
**For:** Nasir Chase (naz824), OmnicoreX Founder
