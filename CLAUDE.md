# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a **Turborepo monorepo** for a multi-tenant vehicle rental platform:

```
drive247-monorepo/
├── apps/
│   ├── booking/      # Customer booking site (port 8080)
│   ├── portal/       # Operations portal for fleet management (port 3001)
│   ├── web/          # Marketing/landing pages (port 3002)
│   └── admin/        # Super admin dashboard (port 3003)
├── packages/         # Shared packages (config, types, ui)
└── supabase/
    ├── functions/    # 60+ Deno Edge Functions
    └── migrations/   # Database migrations
```

All apps share a **single Supabase backend** (PostgreSQL + Auth + Edge Functions).

## Development Commands

From the monorepo root:
```bash
npm install              # Install all dependencies
npm run dev              # Run all apps
npm run dev:booking      # Run booking app only
npm run dev:portal       # Run portal app only
npm run build            # Build all apps
npm run lint             # Lint all apps
```

Or from within individual app directories:
```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint check
```

## Architecture Overview

### Tech Stack (All Apps)
- **Frontend**: Next.js 15/16 + React 18/19 + TypeScript
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS
- **State**: TanStack React Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)

### Multi-Tenancy Architecture

The platform supports multiple rental companies (tenants) via subdomain routing:

**Booking App** (`apps/booking`):
- Pattern: `{tenant}.drive-247.com` or `{tenant}.localhost:8080`
- Middleware extracts tenant from subdomain → sets `x-tenant-slug` header
- `TenantContext` provides tenant config (branding, settings) to all components
- Reserved subdomains: `www`, `admin`, `portal`, `api`, `app`

**Portal App** (`apps/portal`):
- Pattern: `{tenant}.portal.drive-247.com` or `{tenant}.portal.localhost:3001`
- Role-based auth via `useAuthStore` (Zustand): `head_admin`, `admin`, `ops`, `viewer`
- Each tenant sees only their own data (filtered by `tenant_id`)

### Key App Features

**Booking App** (`apps/booking`):
- Customer vehicle rental booking flow
- Key integrations: Stripe (payments), Veriff (identity verification)
- Routes: `/booking` → `/fleet` → `/booking-success`

**Portal App** (`apps/portal`):
- Fleet management, rentals, payments, fines, CMS
- Key integrations: DocuSign (contracts), Veriff, Stripe
- Dashboard sections: `(auth)` for login, `(dashboard)` for main features

### Supabase Edge Functions

Located in `supabase/functions/`. Key categories:
- `admin-*` - User management (create, update role, reset password)
- `apply-payment`, `apply-fine` - Ledger operations
- `dashboard-kpis` - Cached KPI calculations
- `create-docusign-envelope`, `docusign-webhook` - Contract signing
- `notify-*` - Email/SMS notifications via AWS SES/SNS
- `create-checkout-session`, `stripe-webhook` - Payment processing
- `create-veriff-session`, `veriff-webhook` - Identity verification

Shared utilities in `supabase/functions/_shared/`:
- `aws-config.ts` - AWS SES/SNS signing and configuration

### Database Schema (Key Tables)

- `tenants` - Rental company configuration (branding, settings)
- `vehicles` - Fleet inventory with status (Available/Rented)
- `customers` - Customer records (Individual/Company)
- `rentals` - Active rental agreements
- `ledger_entries` - Financial ledger (charges/payments)
- `fines` - Traffic fine management
- `app_users` - Portal user accounts with roles
- `cms_*` - Content management tables

### Path Aliases

All apps use `@/*` → `./src/*` configured in `tsconfig.json`.

## Key Patterns

### Supabase Client
```typescript
import { supabase } from '@/integrations/supabase/client';
// Types auto-generated in src/integrations/supabase/types.ts
```

### Tenant Context
```typescript
import { useTenant } from '@/contexts/TenantContext';
const { tenant, loading, tenantSlug } = useTenant();
```

### Auth (Portal)
```typescript
import { useAuth, useAuthStore } from '@/stores/auth-store';
const { appUser, hasRole, isAdmin, signIn, signOut } = useAuth();
```

### Data Fetching
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['vehicles', tenant?.id],
  queryFn: () => supabase.from('vehicles').select('*').eq('tenant_id', tenant?.id)
});
```

### Toast Notifications
```typescript
import { toast } from 'sonner';  // booking app
import { toast } from '@/hooks/use-toast';  // portal app
```

## TypeScript Configuration

Apps use **loose type checking**:
- `strict: false`
- `noImplicitAny: false` (portal)
- `strictNullChecks: false` (portal) / `true` (booking)

## Deployment

All apps deploy to **Vercel** with subdomain routing:
- Main booking: `drive-247.com` and `{tenant}.drive-247.com`
- Portal: `portal.drive-247.com` and `{tenant}.portal.drive-247.com`
- Admin: `admin.drive-247.com`

## Language & Localization Rules

**IMPORTANT**: This project uses US English and USD currency throughout:

- **Grammar**: Always use US English spelling (e.g., "color" not "colour")
- **Currency**: Always use USD ($) with `en-US` locale formatting
- **Date format**: Use US format (MM/DD/YYYY) where applicable

```typescript
// Currency formatting - ALWAYS use USD
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
```

## AWS Configuration

- **Account ID**: 464115713515
- **Region**: us-east-1
- **SES**: Used for transactional emails (via edge functions)
- **SNS**: Used for SMS notifications

Edge function secrets are configured in Supabase dashboard.

## Supabase CLI

For working with edge functions:
```bash
npx supabase functions serve <function-name>  # Local testing
npx supabase functions deploy <function-name> # Deploy to production
```
