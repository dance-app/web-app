# Dance App - Project Memory

## Project Overview

This is a comprehensive dance school management system built with Next.js 14, React, TypeScript, and TailwindCSS. The app manages dance schools as workspaces with member management, class scheduling, and subscription billing.

**For detailed AI coding guidelines, see `.claude-rules`**

## Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **UI Components**: Shadcn/ui component library
- **State Management**: TanStack Query (React Query) + custom hooks
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js with JWT + refresh token mechanism
- **Architecture**: Multi-tenant with workspace isolation

## Key Features

- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Workspaces**: Multi-tenant dance school organizations with slug-based routing
- **Members**: Student profiles with skill levels, dance roles, and workspace roles
- **Events/Classes**: Scheduling with multiple dance types (Salsa, Bachata, Merengue, Kizomba, Cha Cha)
- **Participations**: Track attendance with status (registered, present, absent, invited)
- **Materials**: Learning resources and content management
- **Dashboard**: Comprehensive analytics and metrics

## Core Patterns

### File Structure
```
app/
  (public)/          # Unauthenticated pages
  (protected)/       # Authenticated pages (workspace pages)
  (no-auth-only)/    # Auth-exclusive routes
  api/               # Next.js API route handlers
components/
  ui/                # Shadcn UI primitives
  [feature]/         # Feature components (members/, events/, etc.)
hooks/               # React Query hooks (use-[resource].ts)
lib/                 # Utilities and shared logic
types/               # TypeScript type definitions
```

### Naming Conventions
- **Files**: kebab-case (e.g., `use-workspaces.ts`, `member-create-modal.tsx`)
- **Components**: PascalCase (e.g., `MemberCreateModal`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWorkspaces`)
- **Types**: PascalCase (e.g., `Member`, `Workspace`)

### Code Patterns
- **Data Fetching**: Custom hooks with React Query (see `hooks/use-*.ts`)
- **Mutations**: Separate hooks per action (e.g., `use-member-create.ts`, `use-member-update.ts`)
- **Forms**: React Hook Form + Zod validation schemas
- **Components**: Functional components only, use Shadcn UI primitives
- **API Routes**: Next.js route handlers with typed responses
- **Types**: Centralized in `types/index.ts` with strict typing

## Development Commands

**Important**: This project uses `pnpm`, not `npm`

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
pnpm type-check   # Run TypeScript checks
pnpm format       # Format with Prettier
```

## Quick Reference

### Data Fetching Pattern
```typescript
// hooks/use-members.ts
export function useMembers() {
  const { workspace } = useCurrentWorkspace();
  const { data, ...query } = useQuery({
    queryKey: ['members', workspace?.slug],
    queryFn: () => fetch(`/api/workspace/${workspace?.slug}/members`).then(r => r.json()),
    enabled: !!workspace,
  });
  return { members: data?.members || [], ...query };
}
```

### Component Pattern
```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof schema>;

export function MyComponent() {
  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  // ...
}
```

### API Route Pattern
```typescript
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;
    // Fetch data, return response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
```

## Important Notes

- **Multi-tenancy**: All resources are scoped to workspaces via slug (`/w/[slug]/...`)
- **Authentication**: Use `useSession()` in components, `validateOrRefreshToken()` in API routes
- **Types**: Import from `@/types` and use enums (WorkspaceRole, DanceRole, WeekStart)
- **Styling**: Tailwind only, no inline styles
- **Error Handling**: Use toast notifications from Sonner
- **Mock Data**: Development mode supports mock API (see `lib/mock-api.ts`)

## Documentation

- **Detailed AI Guidelines**: See `.claude-rules` for comprehensive patterns and best practices
- **Repository Guidelines**: See `AGENTS.md` for development workflow and commit conventions
- **Type Definitions**: See `types/index.ts` for all core types
