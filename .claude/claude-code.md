# Dance App - Project Documentation

> Comprehensive dance school management system built with Next.js 14, React, TypeScript, and TailwindCSS

## Quick Start

This is a multi-tenant dance school management platform where each workspace represents a dance school with member management, class scheduling, and analytics.

**Commands** (use `pnpm` not `npm`):
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
pnpm type-check   # Run TypeScript checks
pnpm format       # Format with Prettier
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **UI Library**: Shadcn/ui
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Auth**: NextAuth.js with JWT + refresh tokens
- **Architecture**: Multi-tenant with workspace isolation

## Key Features

- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Workspaces**: Multi-tenant dance school organizations with slug-based routing (`/w/[slug]/...`)
- **Members**: Student profiles with skill levels, dance roles, and workspace roles
- **Events/Classes**: Scheduling with multiple dance types (Salsa, Bachata, Merengue, Kizomba, Cha Cha)
- **Participations**: Track attendance with status (registered, present, absent, invited)
- **Materials**: Learning resources and content management
- **Dashboard**: Comprehensive analytics and metrics

## Project Structure

```
app/
  (public)/          # Unauthenticated pages (login, signup)
  (protected)/       # Authenticated pages (dashboard, workspace pages)
  (no-auth-only)/    # Auth-exclusive routes (verify email)
  api/               # Next.js API route handlers
  layout.tsx         # Global providers and layout
  globals.css        # Global styles

components/
  ui/                # Shadcn primitives (button, dialog, input, etc.)
  [feature]/         # Feature-specific components (members/, events/, etc.)
  page-layout.tsx    # Reusable page shell
  workspace-guard.tsx # Workspace access control

hooks/               # Custom React hooks for data fetching
lib/                 # Utilities and shared logic
  api/               # API utilities and constants
  auth/              # Auth utilities

types/               # TypeScript type definitions
  index.ts           # Main types file
  dance.ts           # Domain-specific types
```

---

# Coding Guidelines

## Critical Performance Rules

### File Navigation & Search
- **ALWAYS read files before modifying them** - Never suggest changes to code you haven't read
- Use `Glob` tool for finding files by pattern (e.g., `**/*.tsx`, `hooks/use-*.ts`)
- Use `Grep` tool for searching code content with regex patterns
- Use `Read` tool to examine files before making changes
- When exploring multiple related files, read them in parallel for efficiency

### Code Modification Strategy
- **PREFER editing existing files over creating new ones**
- Before creating a new file, check if similar functionality exists
- Follow the DRY principle - reuse existing components, hooks, and utilities
- Only create new files when functionality is genuinely novel

## Naming Conventions

- **Files/Folders**: `kebab-case` (e.g., `use-workspaces.ts`, `page-layout.tsx`)
- **Components**: `PascalCase` (e.g., `MemberCreateModal`, `PageLayout`)
- **Hooks**: `camelCase` starting with `use` (e.g., `useWorkspaces`, `useMembers`)
- **Types/Interfaces**: `PascalCase` (e.g., `Member`, `Workspace`, `ApiResponse`)
- **Enums**: `PascalCase` with `UPPERCASE` values (e.g., `WorkspaceRole.OWNER`)

## File Organization Rules

1. **UI Primitives** → `components/ui/` (shadcn components)
2. **Feature Components** → `components/[feature]/` (e.g., `components/members/`)
3. **Data Hooks** → `hooks/use-[resource].ts` (e.g., `hooks/use-members.ts`)
4. **Mutation Hooks** → `hooks/use-[resource]-[action].ts` (e.g., `hooks/use-member-create.ts`)
5. **API Routes** → `app/api/workspace/[slug]/[resource]/route.ts`
6. **Pages** → `app/(protected)/w/[slug]/[page]/page.tsx`

## TypeScript Patterns

### Type Definitions
```typescript
// Always use explicit types from types/index.ts
import { Member, Workspace, LocalApiResponse } from '@/types';

// API Response pattern for Next.js routes
export type GetMembersResponse = LocalApiResponse<
  { members: Member[] },
  'MEMBER_NOT_FOUND' | 'UNAUTHORIZED'
>;

// Discriminated unions for state
export type AuthState =
  | { status: 'loading'; token: null }
  | { status: 'authenticated'; token: string }
  | { status: 'unauthenticated'; token: null };
```

### Type Safety Rules
- Enable TypeScript strict mode
- Use explicit return types for hooks and utilities
- Prefer interfaces for object shapes, types for unions
- Use enums from `types/index.ts` (WorkspaceRole, DanceRole, WeekStart)
- Never use `any` - use `unknown` and type guards instead

## React Query Patterns

### Data Fetching Hooks

**Pattern 1: External API with auth token**
```typescript
export function useWorkspaces() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const { data, isLoading, isError, error, ...query } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/workspaces`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!accessToken,
  });

  return {
    workspaces: data?.data || [],
    isLoading,
    isError,
    error,
    ...query,
  };
}
```

**Pattern 2: Internal API route**
```typescript
export function useMembers() {
  const { workspace } = useCurrentWorkspace();

  const { data, ...query } = useQuery({
    queryKey: ['members', workspace?.slug],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.slug}/members`, {
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    members: data?.members || [],
    ...query,
  };
}
```

### Mutation Hooks
```typescript
export function useMemberCreate() {
  const queryClient = useQueryClient();
  const { workspace } = useCurrentWorkspace();

  return useMutation({
    mutationFn: async (data: MemberFormData) => {
      const res = await fetch(`/api/workspace/${workspace?.slug}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to create member');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', workspace?.slug] });
    },
  });
}
```

### Query Key Patterns
- Simple resource: `['members']`
- Workspace-scoped: `['members', workspaceSlug]`
- Filtered/paginated: `['members', workspaceSlug, { page, limit }]`
- Nested resource: `['events', eventId, 'participants']`

## Component Patterns

### Client Components
```typescript
'use client'; // Always at top of file when needed

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define schema near component
const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberCreateModalProps {
  children: React.ReactNode;
}

export function MemberCreateModal({ children }: MemberCreateModalProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', email: '' },
  });

  // Component logic...
}
```

### Form Patterns
- Use `react-hook-form` + `zod` for validation
- Use Shadcn `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- Define schema above component, derive type with `z.infer`
- Use `form.handleSubmit()` for form submission
- Reset form after successful submission: `form.reset()`

### Modal/Dialog Patterns
- Use Shadcn `Dialog` for modals
- Control with local `open` state
- Pass trigger as `children` to `DialogTrigger`
- Include loading states during mutations
- Close modal on success, keep open if "create another"

### Loading States
```typescript
// Centered spinner for full-page loading
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
}

// Inline button loading
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Submit
</Button>
```

## API Route Patterns

### Next.js Route Handlers
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { LocalApiResponse, Member } from '@/types';

export type GetMembersResponse = LocalApiResponse<
  { members: Member[] },
  'UNAUTHORIZED' | 'NOT_FOUND'
>;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Validate auth (if needed)
    // const authResult = await validateOrRefreshToken();
    // if (!authResult.accessToken) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // 2. Extract params and query
    const { slug } = await params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');

    // 3. Fetch data (external API or database)
    const response = await fetch(`${BASE_URL}/workspace/${slug}/members`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 4. Return success response
    return NextResponse.json({ members: data }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### API Route Guidelines
- Export typed response types (e.g., `GetMembersResponse`)
- Use `validateOrRefreshToken()` from `lib/auth/validate-or-refresh.ts`
- Always handle errors with try/catch
- Return appropriate HTTP status codes
- Use `BASE_URL` from `lib/api/shared.api.ts` for external API calls

## Styling Guidelines

### Tailwind CSS
- Use Tailwind utility classes exclusively
- Follow existing spacing patterns (`p-4`, `gap-4`, `space-y-4`)
- Use theme colors from Shadcn (`primary`, `secondary`, `muted`, `destructive`)
- Responsive design: `sm:`, `md:`, `lg:` breakpoints
- Dark mode support: `dark:` prefix

### Common Patterns
```typescript
// Card layout
<div className="rounded-lg border bg-card p-6">

// Flex containers
<div className="flex items-center justify-between gap-4">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Text styles
<h2 className="text-2xl font-bold tracking-tight">
<p className="text-sm text-muted-foreground">
```

## Common Patterns & Best Practices

### Authentication
- Use `useSession()` from `next-auth/react` for client components
- Use `validateOrRefreshToken()` in API routes
- Store tokens in httpOnly cookies (handled by NextAuth)
- Redirect unauthenticated users with middleware

### Multi-Tenancy (Workspaces)
- All resources are scoped to a workspace
- Use workspace slug in URLs: `/w/[slug]/members`
- Use `useCurrentWorkspace()` hook to get current workspace
- Include workspace slug in query keys for data isolation

### Error Handling
- Display user-friendly error messages with `toast` from Sonner
- Log errors to console for debugging
- Use try/catch in async operations
- Validate inputs with Zod schemas

### Performance Optimizations
- Use React Query for automatic caching and deduplication
- Enable React Query `enabled` option to prevent unnecessary fetches
- Use `credentials: 'include'` for cookie-based auth
- Lazy load heavy components with `next/dynamic`

## Common Pitfalls to Avoid

### ❌ Don't Do This
```typescript
// Don't create new files unnecessarily - check for existing components first

// Don't use npm (project uses pnpm)
npm install package-name

// Don't use any type
const data: any = await fetch();

// Don't forget 'use client' directive when using hooks
import { useState } from 'react';

// Don't create inline styles
<div style={{ color: 'red' }}>

// Don't mutate state directly
members.push(newMember);

// Don't forget error handling
const data = await fetch('/api/members');
```

### ✅ Do This Instead
```typescript
// Reuse existing components from components/ui/

// Use pnpm
pnpm add package-name

// Use proper typing
const data: Member[] = await fetch().then(r => r.json());

// Add directive when using hooks
'use client';
import { useState } from 'react';

// Use Tailwind classes
<div className="text-destructive">

// Use immutable updates
setMembers([...members, newMember]);

// Always handle errors
try {
  const res = await fetch('/api/members');
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
} catch (error) {
  console.error(error);
  toast.error('Failed to load members');
}
```

## Feature-Specific Patterns

### Dance Types
- Supported: Salsa, Bachata, Merengue, Kizomba, Cha Cha
- Stored in workspace configuration
- Use `DanceType` enum from `types/dance.ts`

### Roles
- Workspace roles: `OWNER`, `TEACHER`, `STUDENT`
- Dance roles: `LEADER`, `FOLLOWER`
- Use enums from `types/index.ts`

### Events/Classes
- Include dance type, start/end time, max participants
- Track participations with status: `registered`, `present`, `absent`, `invited`
- Scope to workspace

### Members
- Can be linked to a user account or standalone
- Include skill level (1-10) and preferred dance role
- Have workspace roles

## AI Assistant Guidelines

When working on this codebase:

1. **Always read before writing** - Use Read tool on files before suggesting changes
2. **Search efficiently** - Use Glob for files, Grep for content, avoid manual searching
3. **Follow patterns** - Match existing code style in hooks, components, and API routes
4. **Reuse components** - Check `components/ui/` and feature folders before creating new
5. **Type everything** - Use types from `types/index.ts`, enable strict mode
6. **Test assumptions** - Read actual implementation before making assumptions
7. **Use pnpm** - Never suggest npm commands
8. **Respect architecture** - Follow App Router conventions and folder structure
9. **Performance first** - Use React Query, parallel reads, efficient searches
10. **Be consistent** - Match naming conventions, file structure, and code patterns

## Pre-Commit Checklist

1. Run `pnpm lint` - fix all linting errors
2. Run `pnpm type-check` - resolve type errors
3. Run `pnpm format` - ensure consistent formatting
4. Test changes manually in browser

## Reference Files

- `AGENTS.md` - Repository guidelines and development workflow
- `types/index.ts` - Core type definitions
- `lib/api/shared.api.ts` - API utilities and constants
- `components/ui/` - Available UI primitives

## Git Commit Guidelines

### Commit Policy
- **NEVER commit changes without explicit user approval**
- **ALWAYS ask the user before creating a commit**
- After making changes, inform the user and wait for them to request a commit
- Only create commits when the user explicitly asks you to commit

### Commit Messages
- **NEVER include Claude Code attribution or co-author tags** in commit messages
- **NEVER include AI-generated footers** like "🤖 Generated with Claude Code" or similar
- Keep commit messages clean and professional
- Focus on what changed and why, not on the tools used to make the change
- Use conventional commit format when appropriate: `type: description`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
  - Example: `feat: add email verification flow`
  - Example: `fix: resolve race condition in workspace creation`
