# OmnicoreX API - Complete Examples

## Setup

```bash
# Install dependencies
npm install @vercel/node pg

# Start local server
vercel dev

# Test in another terminal
curl http://localhost:3000/api/health
```

## Leads API

### List All Leads
```bash
curl http://localhost:3000/api/leads
```

### Filter by Status
```bash
curl "http://localhost:3000/api/leads?status=qualified"
```

### Get Single Lead
```bash
curl http://localhost:3000/api/leads/1
```

Response:
```json
{
  "id": "1",
  "name": "Maria Santos",
  "email": "maria@santosplumbing.com",
  "business_name": "Santos Plumbing & HVAC",
  "status": "qualified",
  "score": 82,
  "created_at": "2026-03-10T09:15:00Z",
  "updated_at": "2026-03-14T16:30:00Z"
}
```

### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@newbusiness.com",
    "phone": "(555) 555-1234",
    "business_name": "New Business Inc",
    "website_url": "https://newbusiness.com",
    "industry": "Tech",
    "location": "San Francisco, CA",
    "status": "new",
    "source": "website",
    "score": 60,
    "budget_range": "$5,000 - $10,000",
    "urgency": "Within 30 days",
    "notes": "Referred by existing client",
    "assigned_agent": "Nova"
  }'
```

Response (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Smith",
  "email": "jane@newbusiness.com",
  "business_name": "New Business Inc",
  "status": "new",
  "score": 60,
  "created_at": "2026-03-18T12:34:56Z",
  "updated_at": "2026-03-18T12:34:56Z"
}
```

### Update Lead
```bash
curl -X PUT http://localhost:3000/api/leads/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "proposal_sent",
    "score": 85,
    "notes": "Sent proposal on March 18"
  }'
```

### Delete Lead
```bash
curl -X DELETE http://localhost:3000/api/leads/1
```

Response (204 No Content): Empty

---

## Projects API

### List All Projects
```bash
curl http://localhost:3000/api/projects
```

### Get Active Projects Only
```bash
curl "http://localhost:3000/api/projects?status=design"
```

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "2",
    "name": "E-Commerce Platform Development",
    "client_name": "James Chen",
    "client_email": "james@chendentalcare.com",
    "status": "discovery",
    "package_tier": "premium",
    "budget": 25000,
    "start_date": "2026-03-20",
    "estimated_end_date": "2026-06-20",
    "progress": 10,
    "current_phase": "Requirements gathering",
    "notes": "Client needs full custom solution"
  }'
```

### Update Project Progress
```bash
curl -X PUT http://localhost:3000/api/projects/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "development",
    "progress": 45,
    "current_phase": "Frontend development in progress"
  }'
```

---

## Agents API

### List All Agents
```bash
curl http://localhost:3000/api/agents
```

Response:
```json
[
  {
    "id": "nova",
    "name": "Sales Agent",
    "code_name": "Nova",
    "role": "Senior Sales Strategist",
    "status": "waiting_approval",
    "current_task": "Drafting follow-up email for Park Fitness",
    "tasks_completed_today": 5,
    "tasks_completed_total": 189,
    "approvals_pending": 2,
    "last_active": "2026-03-15T21:15:00Z"
  },
  {
    "id": "apex",
    "name": "Orchestrator",
    "code_name": "Apex",
    "role": "Lead Coordinator",
    "status": "working",
    "current_task": "Coordinating Kim Landscaping design phase",
    "tasks_completed_today": 8,
    "tasks_completed_total": 247,
    "approvals_pending": 0,
    "last_active": "2026-03-15T21:30:00Z"
  }
]
```

### Get Single Agent
```bash
curl http://localhost:3000/api/agents/nova
```

### Execute Agent Task
```bash
curl -X POST http://localhost:3000/api/agents/nova \
  -H "Content-Type: application/json" \
  -d '{
    "action": "run_task",
    "entity_type": "lead",
    "entity_id": "1",
    "payload": {
      "task_name": "Send follow-up email",
      "template": "day_3_check_in"
    }
  }'
```

Response (200 OK):
```json
{
  "success": true,
  "agent": {
    "id": "nova",
    "status": "working",
    "current_task": "Send follow-up email"
  }
}
```

### Pause Agent
```bash
curl -X POST http://localhost:3000/api/agents/nova \
  -H "Content-Type: application/json" \
  -d '{ "action": "pause" }'
```

### Resume Agent
```bash
curl -X POST http://localhost:3000/api/agents/nova \
  -H "Content-Type: application/json" \
  -d '{ "action": "resume" }'
```

---

## Approvals API

### List Pending Approvals
```bash
curl "http://localhost:3000/api/approvals?status=pending"
```

### Get Single Approval
```bash
curl http://localhost:3000/api/approvals/1
```

Response:
```json
{
  "id": "1",
  "agent_id": "nova",
  "agent_name": "Nova",
  "category": "email",
  "title": "Follow-up email to Park Fitness",
  "description": "Day 3 check-in email with case study for fitness studios",
  "content": "Subject: Quick thought for Park Fitness Studio\n\nHi Lisa...",
  "status": "pending",
  "priority": "p2",
  "submitted_at": "2026-03-15T21:15:00Z",
  "reviewed_at": null,
  "reviewer_notes": ""
}
```

### Approve Submission
```bash
curl -X PUT http://localhost:3000/api/approvals/1 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "reviewer_notes": "Email looks great! Ready to send."
  }'
```

Response (200 OK):
```json
{
  "id": "1",
  "status": "approved",
  "reviewed_at": "2026-03-18T12:34:56Z",
  "reviewer_notes": "Email looks great! Ready to send."
}
```

### Reject Submission
```bash
curl -X PUT http://localhost:3000/api/approvals/1 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject",
    "reviewer_notes": "Needs more personalization. Please revise."
  }'
```

### Request Revision
```bash
curl -X PUT http://localhost:3000/api/approvals/1 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "request_revision",
    "reviewer_notes": "Add more specific case study metrics"
  }'
```

---

## Activities API

### Get Recent Activities (Default 50)
```bash
curl http://localhost:3000/api/activities
```

### Get Last 10 Activities
```bash
curl "http://localhost:3000/api/activities?limit=10"
```

Response:
```json
[
  {
    "id": "1",
    "agent_name": "Nova",
    "action": "Scored new lead",
    "description": "Sarah Thompson — Thompson & Associates Law — Score: 68/100",
    "entity_type": "lead",
    "entity_id": "3",
    "timestamp": "2026-03-15T21:30:00Z"
  },
  {
    "id": "2",
    "agent_name": "Compass",
    "action": "Submitted for approval",
    "description": "Welcome email for Chen Dental Care onboarding",
    "entity_type": "approval",
    "entity_id": "4",
    "timestamp": "2026-03-15T21:28:00Z"
  }
]
```

### Log New Activity
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "Meridian",
    "action": "Completed market analysis",
    "description": "Analyzed 5 competitor websites for Santos Plumbing",
    "entity_type": "lead",
    "entity_id": "1"
  }'
```

---

## Authentication API

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nasir@omnicorex.com",
    "password": "any-password"
  }'
```

Response (200 OK):
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "user-1",
    "email": "nasir@omnicorex.com",
    "name": "Nasir Chase",
    "role": "admin"
  }
}
```

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@omnicorex.com",
    "password": "secure-password-123",
    "name": "New User"
  }'
```

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000"
```

Response (200 OK):
```json
{
  "id": "user-1",
  "email": "nasir@omnicorex.com",
  "name": "Nasir Chase",
  "role": "admin",
  "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=nasir",
  "verified": true
}
```

---

## Analytics API

### Get Dashboard Analytics
```bash
curl http://localhost:3000/api/analytics
```

Response (200 OK):
```json
{
  "dashboard_stats": {
    "total_leads": 6,
    "qualified_leads": 4,
    "active_projects": 2,
    "pending_approvals": 3,
    "monthly_revenue": 7500,
    "conversion_rate": 16.7,
    "avg_response_time": "1.2h",
    "upcoming_bookings": 3,
    "agents_active": 4,
    "tasks_completed_today": 23
  },
  "revenue_summary": {
    "total_revenue": 34500,
    "monthly_revenue": 7500,
    "avg_deal_size": 5750,
    "total_deals_closed": 6,
    "ytd_revenue": 34500
  },
  "pipeline_summary": {
    "by_status": {
      "new": 1,
      "contacted": 1,
      "qualified": 1,
      "proposal_sent": 1,
      "negotiation": 1,
      "won": 1
    },
    "total_pipeline_value": 45000,
    "conversion_rate": 16.7
  },
  "revenue_metrics": [
    { "month": "Oct", "revenue": 0, "deals_closed": 0, "avg_deal_size": 0, "pipeline_value": 5000 },
    { "month": "Nov", "revenue": 2500, "deals_closed": 1, "avg_deal_size": 2500, "pipeline_value": 12000 }
  ]
}
```

---

## Health Check API

### Get API Health Status
```bash
curl http://localhost:3000/api/health
```

Response (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2026-03-18T12:34:56.789Z",
  "uptime_ms": 3600000,
  "database": "using_mock_data",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## Lead Intake API (Public)

### Website Form Submission
```bash
curl -X POST http://localhost:3000/api/lead-intake \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robert Johnson",
    "email": "robert@techstartup.com",
    "phone": "(555) 999-8888",
    "business_name": "Tech Startup Inc",
    "website_url": "https://techstartup.com",
    "industry": "Software",
    "location": "Austin, TX",
    "notes": "Looking to redesign our website and add booking system",
    "source": "google",
    "goal": "Website redesign with booking system",
    "preferred_date": "2026-03-25",
    "preferred_time": "2:00 PM"
  }'
```

Response (201 Created):
```json
{
  "success": true,
  "lead": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Robert Johnson",
    "email": "robert@techstartup.com",
    "business_name": "Tech Startup Inc",
    "status": "new",
    "source": "google",
    "score": 50,
    "created_at": "2026-03-18T12:34:56Z",
    "updated_at": "2026-03-18T12:34:56Z"
  },
  "message": "Thank you for your inquiry! We will be in touch shortly."
}
```

---

## Error Examples

### Missing Required Fields (400 Bad Request)
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{ "name": "John" }'
```

Response (400):
```json
{
  "error": "Missing required fields: name, email, business_name"
}
```

### Not Found (404)
```bash
curl http://localhost:3000/api/leads/999
```

Response (404):
```json
{
  "error": "Lead not found"
}
```

### Method Not Allowed (405)
```bash
curl -X PATCH http://localhost:3000/api/leads
```

Response (405):
```json
{
  "error": "Method not allowed"
}
```

### Unauthorized (401)
```bash
curl http://localhost:3000/api/auth/me
```

Response (401):
```json
{
  "error": "Missing authorization token"
}
```
