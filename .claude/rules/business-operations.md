# OmnicoreX Business Operations Rules

These rules govern all client-facing operations, financial decisions, and approval workflows.

## Client Communication Protocol

### Approval Requirements
- **HARD RULE:** No client emails, proposals, contracts, or deliverables sent without Nasir's explicit written approval
- All client-facing drafts must be tagged with `[PENDING APPROVAL]` in the dashboard or email subject
- Nasir has 4 business hours to respond to approval requests before agents may follow up
- All communication must reflect OmnicoreX brand voice: professional, confident, results-focused
- All communication must be legally compliant (no false claims, no unauthorized pricing)

### Communication Standards
- Emails must be clear, concise, free of jargon
- Tone: warm but professional, action-oriented, confident
- Always include specific next steps and timelines
- Always sign with "Nasir Chase, Founder" or "OmnicoreX Team"
- Never use casual language, emojis, or unprofessional tone with clients
- Proofread 3 times before submitting for approval

### Response Times
- Acknowledge client inquiry within 2 business hours
- Provide initial proposal within 24 business hours
- Complex custom proposals within 48 business hours
- Final website deliverable within agreed timeline (default 7-14 business days)

## Sales & Qualification Rules

### MEDDIC Qualification Checklist
Every prospect must be scored on these dimensions:

1. **Metrics** — What business impact are they seeking? (leads, revenue, bookings, brand)
2. **Economic Buyer** — Who controls the budget? Are they in the conversation?
3. **Decision Criteria** — What will they evaluate? (price, timeline, design, SEO, support)
4. **Decision Process** — How do they make decisions? (solo, board, partner, consultant)
5. **Identify Pain** — What problem are we solving? (outdated site, lost leads, poor mobile experience)
6. **Champion** — Who internally advocates for the solution? (owner, manager, advisor)

**Scoring:** 0-100 points
- 80+ = Pursue immediately (likely close)
- 60-79 = Qualify further (needs clarification)
- 40-59 = Nurture (not ready now, may be later)
- <40 = Disqualify (wrong fit, insufficient budget)

### Lead Prioritization
1. **Priority 1:** Professional services (law, accounting, consulting), healthcare, high-value restaurants
2. **Priority 2:** HVAC, plumbing, home services, real estate
3. **Priority 3:** Fitness, salons, auto repair, other retail
4. **Not pursued:** Nonprofits (no budget), e-commerce (too complex), tech startups (too sophisticated)

### Disqualification Criteria
- Budget <$1,500 (below minimum starter package)
- No decision maker available (can't reach owner/principal)
- Timeframe >6 months (low urgency, likely won't convert)
- Already has recent website (<2 years, good quality) — refer to maintenance/updates
- Multiple competing quotes in progress (low win probability)

## Pricing & Packaging Rules

### Service Packages (Fixed)
```
Starter ($1,500)
  - Website (5-8 pages)
  - 2 service pages
  - Contact form + email notifications
  - Mobile responsive design
  - Basic SEO (meta tags, images alt text)
  - Deployment to production
  - Basic analytics setup

Growth ($5,000)
  - Starter + all below
  - Advanced SEO audit & optimization
  - Google Business Profile setup
  - 2 original blog posts (500 words each)
  - Social media graphics templates (6x)
  - Analytics dashboard
  - Monthly performance report (3 months included)

Premium ($12,000)
  - Growth + all below
  - CMS backend (client can update pages)
  - Custom API integrations (Stripe, Calendly, Zapier, etc.)
  - Monthly SEO/content strategy (6 months)
  - 12 blog posts (2/month, 500 words each)
  - Social media content calendar (6 months)
  - Advanced analytics & optimization
  - Ongoing support (30 min/month calls)
  - Annual domain & hosting management
```

### Pricing Modifications
- NO discounts without Nasir's approval
- NO payment plan modifications without Nasir's approval
- NO upsells mid-project without formal approval
- Additional scope beyond package must be quoted as change order (rate: $150/hour)
- Referral discount: 10% off for client referrals (Nasir approves case-by-case)

### Payment Terms
- 50% due upon contract signature (deposits into Stripe)
- 50% due upon delivery (before deployment to production)
- Invoices due net-30 (for consulting/ongoing work)
- Late payment: 1.5% monthly interest after 30 days

## Project Approval Workflow

### Stage 1: Discovery (Before Contract)
- Prospect fills qualification form
- Nova scores using MEDDIC
- If score >60: draft proposal [PENDING APPROVAL]
- Nasir reviews and approves proposal (or requests revisions)
- Nova sends approved proposal to prospect
- Prospect signs contract

### Stage 2: Kickoff (After Contract, Before Design)
- Compass schedules kickoff call
- Client provides brand guidelines, content, photos, domain info
- Prism & Vertex review requirements and estimate deliverables
- Compass documents scope in project brief [PENDING APPROVAL]
- Nasir approves project scope

### Stage 3: Design (Days 1-4)
- Prism creates design mockup (desktop + mobile)
- Prism generates 3 design concepts [PENDING APPROVAL]
- Client votes on design concept
- Prism refines selected design
- Sentinel QA review for accessibility & responsiveness
- Nasir approves final design before development starts

### Stage 4: Development (Days 5-10)
- Vertex develops frontend (React components, Tailwind CSS)
- Nexus develops backend (API routes, database, integrations)
- Meridian writes SEO-optimized copy and blog posts
- Compass prepares deployment checklist
- Sentinel runs QA suite (performance, accessibility, security, cross-browser)
- All issues must be resolved before approval

### Stage 5: Review & Approval (Day 11)
- Full QA review [PENDING APPROVAL]
- Client review (staging server URL sent to client)
- Client provides feedback
- Any changes become change orders (quoted separately)
- Nasir approves final deliverable

### Stage 6: Deployment (Day 12-14)
- DNS setup and domain transfer (if needed)
- SSL certificate installation
- Production deployment
- Monitoring setup
- Client training (30-min call on CMS, analytics, updates)
- Launch announcement

## Financial Rules

### Never Without Approval
- Creating invoices for clients
- Charging Stripe cards
- Issuing refunds
- Making vendor payments
- Offering discounts or special pricing
- Making commitments about budget impact (ROI claims)

### Documentation Required
- All financial approvals must be documented in activity feed with screenshot/email
- Change orders must be signed before work begins
- Invoice must match contract amount (no hidden fees)
- All refunds must have written reason and Nasir's approval

### Revenue Recognition
- Starter: Recognize 50% at contract, 50% at delivery
- Growth/Premium: Recognize monthly (1/6 per month, or 1/12 for Premium)
- Change orders: Recognize when completed and approved

## Approval Queue & Escalation

### Dashboard Approval Queue
All items requiring Nasir approval appear in dashboard with:
- Type (proposal, design mockup, QA issue, financial, contract language)
- Status (pending, approved, rejected, revision requested)
- Timestamp (when submitted)
- Deadline (24h for critical, 48h for normal)
- Agent submitting (who can provide context)

### Escalation
- If no response in 24h and item is critical: Nova sends Nasir a Slack/email reminder
- If no response in 48h: Apex escalates with summary
- If client is waiting for response >72h: Compass sends holding message to client

### Rejection & Revision
- If Nasir rejects: Must include specific feedback
- Agent has 4h to revise
- Resubmit with [REVISED] tag
- Max 2 revision cycles before escalation to Apex

## Client Onboarding

### Pre-Kickoff
1. Contract signed & payment received
2. Scope document reviewed & approved
3. Client information form completed
4. Domain & hosting set up (or transferred)
5. Access credentials securely shared
6. NDA signed (if required for sensitive industries)

### Kickoff Meeting (30 min)
- Nasir or Compass leads
- Attendees: Client owner/principal, project lead from OmnicoreX
- Agenda: Goals, timeline, deliverables, communication plan, success metrics
- Action items assigned
- Schedule next review date

### Communication Plan
- Weekly status updates (Compass, every Friday)
- Access to shared project tracker (GitHub project board)
- Slack or email for quick questions
- Scheduled calls at milestones (design review, launch prep)

### Success Metrics
Captured at kickoff for each client:
- Primary goal (e.g., "generate 10 leads/month")
- Timeline (e.g., "launch in 2 weeks")
- Quality bar (e.g., "mobile-first, fast load time, professional design")
- User experience (e.g., "easy to use CMS, no technical skills needed")

## Quality Standards

### Accessibility (WCAG 2.1 AA)
- All pages pass axe-core accessibility audit
- Color contrast ratio ≥4.5:1 for normal text
- Keyboard navigation fully functional
- Screen reader friendly (proper semantics, ARIA labels)
- Forms clearly labeled and logical tab order

### Performance (Google Lighthouse)
- Performance score ≥90 (LCP <2.5s, FID <100ms, CLS <0.1)
- Accessibility score ≥90
- Best Practices score ≥90
- SEO score ≥95

### Security
- HTTPS only (no HTTP)
- No hardcoded API keys or credentials
- OWASP scanning passing (no XSS, CSRF, SQL injection)
- Regular dependency updates
- Secure form submissions (CSRF tokens)

### SEO
- Proper meta tags (title, description, canonical)
- Open Graph tags (social sharing)
- Structured data (schema.org for business, local business, product)
- Sitemap & robots.txt
- Mobile-friendly (Core Web Vitals all green)
- Page titles unique and descriptive
- Headings hierarchy correct (h1, h2, h3 in logical order)

## SLA (Service Level Agreement)

### Response Times
- Critical (client blocked): 4 business hours
- High (feature broken): 8 business hours
- Medium (feature degraded): 24 business hours
- Low (enhancement): 3 business days

### Availability
- Uptime target: 99.5% (excludes scheduled maintenance)
- Planned maintenance: Scheduled with 48h notice
- Emergency maintenance: Notifications sent immediately

### Support Hours
- Standard: Mon-Fri 9am-5pm ET
- Emergency: Available 24/7 for critical issues (contact Nasir directly)

---

All agents must reference these rules before taking client-facing or financial actions.
