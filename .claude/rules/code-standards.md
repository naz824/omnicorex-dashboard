# OmnicoreX Code Standards

All code written by OmnicoreX agents must meet these standards. Sentinel QA enforces these standards.

## TypeScript

### Type Safety
- **HARD RULE:** No `any` types, ever. If you don't know a type, use `unknown` and narrow it
- No `as` type assertions except `as const`
- All function parameters must have explicit types
- All function return types must be explicit
- All object keys must be typed
- Enable strict mode: `"strict": true` in `tsconfig.json`

### Examples
```typescript
// BAD
const data = response.data as any;
const parseResult = JSON.parse(text);

// GOOD
const data = response.data as unknown;
const parseResult = JSON.parse(text) as Record<string, unknown>;

type APIResponse = {
  status: 'success' | 'error';
  data: Record<string, unknown> | null;
};

function processData(response: APIResponse): string {
  if (response.status === 'error') {
    return 'Error';
  }
  return 'Success';
}
```

### Interfaces Over Types
- Use `interface` for object shapes (can extend, supports declaration merging)
- Use `type` for unions and primitives
- Export all interfaces from component files
- Name interfaces with `Props` suffix for component props

```typescript
// Component file
interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  onClick: () => void;
}

export function PricingCard(props: PricingCardProps) {
  // ...
}
```

## React

### Functional Components Only
- All components must be functional (no class components)
- Use React hooks for state management
- Use custom hooks for reusable logic
- Props defined as interfaces, exported from component file

### Hooks Best Practices
- Custom hooks go in `src/hooks/` with `use` prefix
- Use `useCallback` for memoized functions passed to children
- Use `useMemo` for expensive computations
- Use `useEffect` with explicit dependency arrays (never empty unless intentional)
- Keep hooks in order: useState, useContext, useEffect, custom hooks

```typescript
// src/hooks/useClientData.ts
export function useClientData(clientId: string) {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        const json = (await response.json()) as ClientData;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  return { data, loading, error };
}
```

### Component Structure
```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export function Component({ title, onAction, children }: ComponentProps) {
  const [state, setState] = useState(false);
  const callback = useCallback(() => {
    onAction();
  }, [onAction]);

  return (
    <div>
      <h1>{title}</h1>
      {children}
      <button onClick={callback}>Action</button>
    </div>
  );
}
```

### Performance
- Memoize components that receive heavy props: `memo(Component)`
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations
- Use dynamic imports for large components: `const Component = dynamic(() => import('./Component'))`
- Profile with React DevTools Profiler before optimizing

## Tailwind CSS

### Class Naming
- Use Tailwind utility classes exclusively (no custom CSS in components)
- Dark theme: slate-950 background, slate-900 surfaces, slate-800 elevated, cyan-400 primary accent
- Never use purple gradients or excessive rounded corners
- Responsive design: mobile-first, use `md:`, `lg:`, `xl:` breakpoints

### Examples
```html
<!-- Navigation bar -->
<nav class="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <h1 class="text-xl font-bold text-white">OmnicoreX</h1>
    <button class="px-4 py-2 bg-cyan-400 text-slate-950 rounded-md font-medium hover:bg-cyan-300 transition-colors">
      Get Started
    </button>
  </div>
</nav>

<!-- Card component -->
<div class="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
  <h2 class="text-lg font-semibold text-white mb-2">Title</h2>
  <p class="text-slate-400">Description</p>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id}>{/* content */}</div>
  ))}
</div>
```

### Custom CSS (Rare)
If Tailwind utilities aren't sufficient:
- Put custom CSS in `src/styles/` (one file per feature)
- Use CSS variables for consistency: `var(--color-primary)`
- BEM naming convention for classes: `.block__element--modifier`
- Must pass accessibility and performance review

## Git Commit Conventions

### Commit Messages
- Format: `[AGENT] type: description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `perf`, `chore`
- Description: imperative mood, lowercase, no period
- Body: explain why, not what (limit 72 chars per line)

### Examples
```
[VERTEX] feat: add pricing table component with responsive grid

The pricing table displays all three service packages (Starter, Growth,
Premium) with feature lists and call-to-action buttons. Uses responsive
grid that collapses to single column on mobile.

Closes #42
```

```
[SENTINEL] fix: improve accessibility of form inputs

- Add explicit labels to all form fields
- Add aria-required to required inputs
- Ensure proper focus states and keyboard navigation
- Test with screen reader

Fixes #89
```

### Atomic Commits
- One logical change per commit
- Don't mix feature work with refactoring
- Don't mix formatting changes with logic changes
- Should be testable in isolation
- History should be readable and bisectable

### Push Protocol
- Always pull before push: `git pull origin main`
- Never force push to main
- Create feature branches: `[agent]/feature-name`
- Request Nasir review before merging to main
- Delete branch after merge

```bash
git checkout -b vertex/pricing-table
git add src/components/PricingTable.tsx
git commit -m "[VERTEX] feat: add pricing table component"
git push -u origin vertex/pricing-table
# Request review and merge via GitHub PR
```

## Testing

### Test Coverage
- Minimum 90% code coverage (enforced by Sentinel)
- All business logic covered (calculations, conditionals, error paths)
- All React components have render + interaction tests
- All API routes have happy path + error path tests

### Testing Patterns

```typescript
// src/components/__tests__/Button.test.ts
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### API Route Testing
```typescript
// src/api/clients/__tests__/route.test.ts
import { POST } from '../route';
import { mockRequest } from '@testing-library/node';

describe('POST /api/clients', () => {
  it('creates a new client', async () => {
    const request = mockRequest('POST', {
      json: async () => ({ name: 'Test Client', industry: 'dental' })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json() as { id: string };
    expect(data.id).toBeDefined();
  });

  it('returns 400 for missing required fields', async () => {
    const request = mockRequest('POST', {
      json: async () => ({ name: 'Test Client' })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## File Organization

### Components
```
src/components/
├── dashboard/
│   ├── Dashboard.tsx
│   ├── DashboardHeader.tsx
│   ├── PipelineWidget.tsx
│   └── __tests__/
│       └── Dashboard.test.ts
├── pricing/
│   ├── PricingTable.tsx
│   ├── PricingCard.tsx
│   └── __tests__/
│       └── PricingTable.test.ts
└── common/
    ├── Button.tsx
    ├── Modal.tsx
    ├── Form.tsx
    └── __tests__/
        ├── Button.test.ts
        ├── Modal.test.ts
        └── Form.test.ts
```

### Hooks
```
src/hooks/
├── useClientData.ts
├── usePipelineStats.ts
├── useLocalStorage.ts
└── __tests__/
    ├── useClientData.test.ts
    ├── usePipelineStats.test.ts
    └── useLocalStorage.test.ts
```

### Types
```
src/types/
├── api.ts (all API response types)
├── domain.ts (business logic types: Client, Project, Lead)
├── ui.ts (UI component types)
└── forms.ts (form submission types)
```

### Services
```
src/services/
├── supabase.ts (Supabase queries)
├── stripe.ts (Stripe API calls)
├── gmail.ts (Gmail API calls)
└── __tests__/
    ├── supabase.test.ts
    ├── stripe.test.ts
    └── gmail.test.ts
```

## Security

### Secrets Management
- NEVER hardcode API keys, database passwords, or credentials
- Use `.env.local` for local development (not committed to git)
- Use Vercel Environment Variables for production
- Client-side vars: prefix with `VITE_` (e.g., `VITE_STRIPE_PUBLIC_KEY`)
- Server-side vars: no prefix (e.g., `DATABASE_URL`, `STRIPE_SECRET_KEY`)

```typescript
// src/lib/stripe.ts
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}

export const stripe = new Stripe(stripePublicKey);
```

### Input Validation
- Use Zod for form validation (client and server)
- Validate all API request bodies
- Sanitize HTML input (prevent XSS)
- Use parameterized queries (never string concatenation for database)

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const CreateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[0-9\s\-()]{10,}$/, 'Invalid phone number'),
  industry: z.enum(['dental', 'hvac', 'plumbing', 'restaurant']),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
```

## Performance

### Optimization Checklist
- Images: optimized and responsive (use `next/image`)
- Fonts: system font stack first, Google Fonts as fallback
- Code splitting: dynamic imports for large components
- Bundle analysis: run `npm run analyze` regularly
- Lazy loading: defer non-critical resources
- Caching: leverage browser cache and CDN

### Next.js Best Practices
- Use Server Components by default (faster, smaller bundle)
- Use Client Components only when needed (state, events, hooks)
- Use Route Handlers for API routes (not `getServerSideProps` or `getStaticProps`)
- Use Vercel analytics for real-world performance data
- Image: always use `next/image` with `width`, `height`, and `alt` tags

```typescript
// app/layout.tsx (Server Component by default)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  const data = await fetchDashboardData(); // Runs on server
  return <Dashboard data={data} />;
}

// app/dashboard/client-component.tsx (Client Component - explicit)
'use client';
import { useState } from 'react';

export function InteractiveWidget() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

## Accessibility (WCAG 2.1 AA)

### Essential Practices
- Semantic HTML: use `<button>`, `<nav>`, `<main>`, `<header>`, `<footer>`, not just `<div>`
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation: all interactive elements must be reachable via Tab key
- Form labels: all inputs must have associated `<label>` elements
- ARIA labels: use when semantic HTML isn't sufficient
- Screen readers: test with NVDA (Windows) or VoiceOver (Mac)

### Examples
```typescript
// Good
<form>
  <label htmlFor="email">Email:</label>
  <input id="email" type="email" required />
  <button type="submit">Submit</button>
</form>

// Bad
<form>
  <input type="email" placeholder="Email" />
  <div onClick={() => submit()}>Submit</div>
</form>

// Good (Aria when semantic HTML insufficient)
<div role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
  Toggle Menu
</div>

// Bad (Aria doesn't fix semantics)
<span role="button">Toggle Menu</span>
```

---

All agents must follow these standards. Sentinel QA enforces them before deployment.
