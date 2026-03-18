# OmnicoreX Dashboard - Vercel Serverless API

## Overview

Complete set of 21 production-ready Vercel Serverless Functions serving as the live backend API for the OmnicoreX dashboard.

## Installation

Install required dependencies for API routes:

```bash
npm install @vercel/node pg
npm install --save-dev @types/node
```

## Environment Setup

### Optional: PostgreSQL Connection

If you want to use a real PostgreSQL database instead of in-memory mock data:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

When `DATABASE_URL` is not set, the API automatically uses in-memory mock data that persists across invocations within a serverless function lifecycle.

## API Routes

### Leads
- `GET /api/leads` - List all leads (supports `?status=qualified` filter)
- `POST /api/leads` - Create new lead
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Projects
- `GET /api/projects` - List all projects (supports `?status=design` filter)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Bookings
- `GET /api/bookings` - List all bookings (supports `?status=confirmed` filter)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get single agent
- `PUT /api/agents/:id` - Update agent status/task
- `POST /api/agents/:id` - Execute agent action (run_task, pause, resume)

### Approvals
- `GET /api/approvals` - List all approvals (supports `?status=pending` filter)
- `POST /api/approvals` - Create new approval
- `GET /api/approvals/:id` - Get single approval
- `PUT /api/approvals/:id` - Review approval (approve, reject, request_revision)

### Activities
- `GET /api/activities` - List recent activities (supports `?limit=50`)
- `POST /api/activities` - Log new activity

### Analytics
- `GET /api/analytics` - Get aggregated dashboard stats, revenue summary, pipeline summary

### Authentication
- `POST /api/auth/login` - Login (mock: nasir@omnicorex.com / any password)
- `POST /api/auth/signup` - Register new account
- `GET /api/auth/me` - Get current user (requires Bearer token)

### Special Endpoints
- `GET /api/health` - Health check with database status
- `POST /api/agent-task` - Execute agent task (run_task, etc.)
- `POST /api/lead-intake` - Public form submission (no auth required)

## Request/Response Examples

### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "business_name": "Acme Corp",
    "phone": "(555) 123-4567",
    "location": "New York, NY",
    "industry": "Technology",
    "website_url": "https://acme.com",
    "status": "new",
    "source": "website",
    "score": 75,
    "budget_range": "$10,000 - $25,000",
    "urgency": "Within 30 days",
    "notes": "High priority lead",
    "assigned_agent": "Nova"
  }'
```

### Approve Submission
```bash
curl -X PUT http://localhost:3000/api/approvals/1 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "reviewer_notes": "Looks good, approved for deployment."
  }'
```

### Execute Agent Task
```bash
curl -X POST http://localhost:3000/api/agent-task \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "nova",
    "action": "run_task",
    "entity_type": "lead",
    "entity_id": "1",
    "payload": {
      "task_name": "Send follow-up email",
      "template": "day_3_check_in"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nasir@omnicorex.com",
    "password": "any-password"
  }'
```

Response:
```json
{
  "token": "uuid-string",
  "user": {
    "id": "user-1",
    "email": "nasir@omnicorex.com",
    "name": "Nasir Chase",
    "role": "admin"
  }
}
```

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Next.js dev server)
- `https://omnicorex-dashboard.vercel.app` (Production)

Update `api/_lib/cors.ts` to add additional allowed origins.

## Mock Data

The API includes complete mock data:

### 6 Leads
- Santos Plumbing & HVAC (qualified, $82 score)
- Chen Dental Care (proposal_sent, $91 score)
- Thompson & Associates Law (new, $68 score)
- Rodriguez Auto Repair (contacted, $55 score)
- Park Fitness Studio (negotiation, $76 score)
- Kim Landscaping (won, $88 score)

### 8 Agents
- Apex (Orchestrator, working)
- Nova (Sales Agent, waiting_approval)
- Meridian (Marketing Agent, working)
- Prism (Design Agent, working)
- Vertex (Frontend Agent, idle)
- Nexus (Backend Agent, idle)
- Sentinel (QA Agent, idle)
- Compass (Operations Agent, working)

### 2 Projects
- Kim Landscaping Website Redesign (design, 25% progress)
- Chen Dental Care Full Rebrand (discovery, 5% progress)

### Other Entities
- 3 Bookings
- 4 Approvals
- 8 Activities
- 6 months of Revenue Metrics

## Local Development

### Start Local API Server

Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel dev
```

Option 2: Using Node directly
```bash
# Create a simple test server
node -e "
const http = require('http');
const handler = require('./api/leads.ts');
http.createServer((req, res) => {
  handler({ method: req.method, url: req.url, headers: req.headers }, res);
}).listen(3000);
"
```

### Test in Browser
```bash
# List all leads
curl http://localhost:3000/api/leads

# Get single lead
curl http://localhost:3000/api/leads/1

# Check health
curl http://localhost:3000/api/health
```

## Production Deployment

1. Ensure `vercel.json` or `vercel` CLI recognizes `/api` directory
2. Set `DATABASE_URL` environment variable in Vercel project settings (optional)
3. Deploy:
   ```bash
   vercel --prod
   ```

## Database Integration

### Switching to PostgreSQL

Update `api/_lib/db.ts` to use your database connection:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

Then implement SQL queries in route handlers:
```typescript
const leads = await query('SELECT * FROM leads WHERE status = $1', [status]);
```

## Status Codes

- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Missing/invalid parameters
- `401 Unauthorized` - Missing auth token
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Internal Server Error` - Server error

## Error Handling

All endpoints use consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Security Notes

- Mock auth accepts `nasir@omnicorex.com` with any password for testing
- Replace with real authentication before production
- Add API rate limiting for production
- Implement API key validation for sensitive endpoints
- Use HTTPS only in production
- Validate and sanitize all inputs
