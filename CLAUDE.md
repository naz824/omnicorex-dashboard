# OmnicoreX Dashboard

## Project Overview
This is the OmnicoreX command center dashboard — a React + TypeScript application that serves as the operational hub for the OmnicoreX web design agency. It manages leads, projects, bookings, agent coordination, approvals, analytics, and integrations.

## Tech Stack
- React 18 + TypeScript (strict mode)
- Vite 6 (build tool)
- Tailwind CSS v4 (styling)
- shadcn/ui (component library — Radix primitives)
- Recharts (data visualization)
- React Router v7 (client-side routing)
- React Hook Form + Zod (form validation)
- Supabase (database, auth, realtime, edge functions)
- Stripe (payments)
- TanStack Query (server state management)

## Design System
- Dark theme: slate-950 background, slate-900 surfaces, slate-800 elevated, cyan-400 primary accent
- Never use purple gradients, excessive rounded corners, or centered-everything layouts
- Typography: system font stack, Inter for headings
- All components must pass WCAG 2.1 AA accessibility standards

## Coding Standards
- No `any` types — ever
- No `as` type assertions except `as const`
- All components are functional with hooks
- Props defined as interfaces, exported from component file
- Custom hooks in `src/hooks/`
- Types in `src/types/`
- Supabase queries in `src/services/`
- Constants in `src/config/`

## Agent Team
This project is managed by 7 specialized AI agents + 1 orchestrator (see `.claude/agents/`). All client-facing communications and financial actions require human approval through the dashboard.

## File Organization
```
src/
├── components/     # All React components by category
├── lib/           # Third-party library configurations
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── context/       # React Context providers
├── utils/         # Pure utility functions
├── config/        # App configuration constants
├── services/      # API service functions (Supabase, Stripe, Gmail)
└── data/          # Mock data and seed data
```

## Important Notes
- Always run `npx tsc --noEmit` before committing
- Always run the build before marking anything as complete
- Every screen must have loading states, error states, and empty states
- Supabase RLS policies must be on every table
- All env vars prefixed with `VITE_` for client exposure
