# OmnicoreX Security Rules

These rules protect OmnicoreX and client data from security threats. All agents must follow them without exception.

## Secrets Management

### Hard Rules
- NEVER commit `.env` files to git
- NEVER hardcode API keys in source code
- NEVER log API keys, database passwords, or tokens
- NEVER share credentials in Slack, email, or comments
- NEVER access production secrets from local machine
- NEVER copy secrets into drafts, proposals, or client communications

### Secret Storage
- Local development: `.env.local` (git-ignored)
- Production: Vercel Environment Variables dashboard
- Database: Supabase Vault (encrypted at rest)
- Third-party: Use OAuth/SSO instead of secrets when possible

### Environment Variables
- Client-side (browser): `VITE_STRIPE_PUBLIC_KEY`, `VITE_SUPABASE_URL`
- Server-side only: `DATABASE_URL`, `STRIPE_SECRET_KEY`, `GITHUB_TOKEN`, `GMAIL_REFRESH_TOKEN`
- Never pass server secrets to client in API responses
- Never log secrets in error messages

```typescript
// BAD
const apiKey = process.env.STRIPE_SECRET_KEY;
console.log('Using API key:', apiKey); // Logged!
const response = await fetch('/api/charge', { key: apiKey }); // Sent to client!

// GOOD
const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) throw new Error('Missing STRIPE_SECRET_KEY');
// Call Stripe from server-side only
const charge = await stripe.charges.create({ amount: 100 });
// Never send secret to client
const response = await fetch('/api/charge', {}); // No secrets in request
```

### Rotating Secrets
- Every 90 days: rotate database password (Supabase)
- Every 90 days: rotate Stripe API keys (keep 2 active, retire old)
- Every 6 months: rotate GitHub personal access tokens
- Immediately: if ever leaked, committed, or exposed in logs

## API Security

### Authentication
- All API endpoints require authentication (except public marketing pages)
- Use JWT tokens from Supabase auth
- Tokens stored in httpOnly cookies (never localStorage)
- Token expiry: 1 hour (with refresh token)
- Refresh tokens stored securely and rotated on use

```typescript
// src/api/middleware/auth.ts
export async function verifyAuth(request: Request) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    return { userId: decoded.sub };
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
```

### Authorization
- Check user role on every API endpoint (don't trust client)
- OmnicoreX staff: can view all clients, projects, financials
- Clients: can only view their own project
- Public: cannot access any protected data

```typescript
// src/api/clients/[id]/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await verifyAuth(request);
  const userRole = await getUserRole(userId);

  const clientId = params.id;
  const client = await db.clients.findById(clientId);

  // Authorization check
  if (userRole === 'client' && client.ownerId !== userId) {
    return new Response('Forbidden', { status: 403 });
  }

  return Response.json(client);
}
```

### Rate Limiting
- Client API: 100 requests/minute per IP
- Public API: 10 requests/minute per IP
- Stripe webhooks: no rate limiting (allow all)

### CORS
- Allow only trusted domains
- Never use `Access-Control-Allow-Origin: *` for sensitive endpoints
- Credentials in cookies: `credentials: 'include'` only for same-domain requests

```typescript
// next.config.js
const allowedOrigins = [
  'https://omnicorex-dashboard.vercel.app',
  'https://omnicorex.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined,
].filter(Boolean);

export const headers = () => [{
  source: '/api/:path*',
  headers: [
    {
      key: 'Access-Control-Allow-Origin',
      value: allowedOrigins.includes(request.headers.origin) ? request.headers.origin : '',
    },
    {
      key: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS',
    },
  ],
}];
```

## Data Protection

### Database Security
- Use Supabase Row-Level Security (RLS) on every table
- Never query `SELECT *` — specify columns
- Use parameterized queries (Supabase handles this)
- Never concatenate SQL strings
- Audit logging enabled for sensitive operations

```typescript
// Enable RLS on all tables
-- supabase/migrations/001_enable_rls.sql
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "OmnicoreX staff can view all clients"
  ON clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'staff'
    )
  );
```

### Data Encryption
- Database: Supabase encrypts at rest (transparent)
- In transit: Always use HTTPS (no HTTP)
- Sensitive fields: Encrypt before storage if needed (PII like SSN)
- Stripe: Never store full credit card numbers (tokenize instead)

### Data Retention
- Client data: Keep for 2 years after contract ends, then delete
- Logs: Keep for 90 days, then archive to cold storage
- Audit trail: Keep indefinitely for financial/legal compliance
- GDPR: Right to be forgotten — client can request data deletion

## Input Validation & Sanitization

### Server-Side Validation
- Always validate on server (client validation can be bypassed)
- Use Zod for schema validation
- Reject requests with invalid data (don't try to fix them)
- Return clear error messages (don't expose implementation details)

```typescript
// src/api/clients/route.ts
import { z } from 'zod';

const CreateClientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s\-()]{10,}$/),
});

export async function POST(request: Request) {
  const { userId } = await verifyAuth(request);
  const body = await request.json();

  // Validate input
  const result = CreateClientSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: 'Invalid input', issues: result.error.issues },
      { status: 400 }
    );
  }

  // Create client
  const client = await db.clients.create(result.data);
  return Response.json(client, { status: 201 });
}
```

### HTML Sanitization
- Never render user input as HTML without sanitization
- Use `dangerouslySetInnerHTML` only after sanitizing with `DOMPurify`
- Better: render as plain text by default

```typescript
// BAD
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// GOOD (plain text)
<div>{userContent}</div>

// GOOD (if HTML needed, sanitize first)
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userContent);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

### URL/Query Parameter Validation
- Never trust URL parameters (can be tampered with)
- Always verify access rights in API endpoint
- Never put secrets in URLs
- Validate format and length

```typescript
// BAD
const clientId = window.location.pathname.split('/')[2]; // Unvalidated!
const client = await fetch(`/api/clients/${clientId}`);

// GOOD
const router = useRouter();
const { id } = router.query;
const result = ClientIdSchema.safeParse(id);
if (!result.success) return <Error />;
const client = await fetch(`/api/clients/${result.data}`); // Validated!
```

## Cross-Site Scripting (XSS) Prevention

### Content Security Policy
- Strict CSP header on all responses
- No inline scripts (`<script>` tags)
- No eval() or Function() constructors
- Whitelist external scripts

```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https:;
  font-src 'self';
`;

export const headers = () => [{
  source: '/:path*',
  headers: [{
    key: 'Content-Security-Policy',
    value: cspHeader,
  }],
}];
```

### Template Injection Prevention
- Use templating engines with auto-escaping by default
- Never evaluate user input as template code
- React: auto-escapes by default (safe)
- Handlebars: use `{{variable}}` not `{{{variable}}}`

## CSRF (Cross-Site Request Forgery) Prevention

### Tokens
- Generate CSRF tokens for all state-changing requests (POST, PUT, DELETE)
- Verify token matches on server
- Next.js: use built-in CSRF protection with cookies

```typescript
// src/api/clients/route.ts
export async function POST(request: Request) {
  const csrfToken = request.headers.get('x-csrf-token');
  const sessionCsrfToken = request.cookies.get('csrf-token')?.value;

  if (!csrfToken || csrfToken !== sessionCsrfToken) {
    return new Response('Invalid CSRF token', { status: 403 });
  }

  // Process request
}

// src/components/Form.tsx
export function ClientForm() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
    setCsrfToken(token);
  }, []);

  const handleSubmit = async (data: ClientData) => {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(data),
    });
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## Dependency Security

### Vulnerability Scanning
- Run `npm audit` weekly
- Update critical and high-severity dependencies immediately
- Update medium/low dependencies monthly (batch updates)
- Verify updates don't break tests before deploying

```bash
# Check for vulnerabilities
npm audit

# Update specific package
npm update lodash --save

# Check what would be updated
npm outdated

# Audit fix
npm audit fix
```

### Supply Chain
- Use only official npm packages
- Verify package author and maintainers
- Check for recent updates (abandoned packages are risk)
- Never use packages from untrusted sources
- Pin versions in `package-lock.json` (committed to git)

## Error Handling & Logging

### Never Log Secrets
- Filter out API keys, tokens, passwords from logs
- Sanitize user input before logging
- Never log credit card numbers or PII

```typescript
// BAD
console.error('API call failed:', error); // Might contain secrets!
logger.error(`Payment failed: ${JSON.stringify(chargeData)}`); // Logs card!

// GOOD
console.error('API call failed:', error.message);
logger.error('Payment failed', { amount, currency, status });
```

### Error Messages
- Don't expose implementation details to users
- Don't reveal database structure, file paths, or software versions
- Provide helpful error messages to developers (in logs, not UI)

```typescript
// BAD
catch (error) {
  return Response.json({ error: error.message }, { status: 500 });
  // Might expose "database connection failed" to user
}

// GOOD
catch (error) {
  console.error('Database query failed:', error);
  return Response.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
}
```

## Third-Party Integrations

### Stripe
- Never store credit card numbers (use Stripe tokens)
- Use Stripe webhooks for payment events (not polling)
- Verify webhook signatures

```typescript
// src/api/stripe/webhook.ts
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  // Handle event
}
```

### Google APIs
- Use OAuth for authentication (never username/password)
- Store refresh token securely (Supabase vault)
- Request only necessary scopes (principle of least privilege)

### GitHub
- Use personal access tokens with minimal scopes
- Rotate tokens every 6 months
- Never commit tokens to git

## Incident Response

### Security Incident Steps
1. **Detect** — Monitor logs, alerts, and Sentinel QA reports
2. **Contain** — If breach: revoke tokens, rotate passwords immediately
3. **Investigate** — What was accessed? How did it happen? Who was affected?
4. **Notify** — If client data exposed, notify affected clients and Nasir immediately
5. **Remediate** — Fix the vulnerability, update code, patch systems
6. **Learn** — Post-incident review, update procedures

### Reporting Security Issues
- Email Nasir directly (don't post in public channels)
- Include: what, when, impact, steps to reproduce
- Do not exploit vulnerability further for investigation

---

All agents must follow these rules. Security breaches are unacceptable and require immediate escalation.
