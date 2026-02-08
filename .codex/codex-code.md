# Codex Code Guide

High-level guardrails for this repo. When in doubt, read `AGENTS.md` and `CLAUDE.md` first and mirror existing patterns before inventing new ones.

## Project Shape
- Next.js App Router (app/) with grouped segments: `(public)` unauth, `(protected)` auth-only, `(no-auth-only)` auth-exclusive, plus api route handlers under `app/api/**`.
- Multi-tenant: workspace pages live at `/w/[slug]/...`; components/hooks expect a workspace slug for scoping.
- Shared UI lives in `components/` (`components/ui/` for primitives, feature folders for composed widgets). Hooks sit in `hooks/`, utilities in `lib/`, shared types in `types/`, design tokens in `styles/`, static assets in `public/`.
- Global providers (`SessionProvider`, React Query, Jotai) are wired in `components/providers.tsx`, attached in `app/layout.tsx`.

## Commands (pnpm only)
- `pnpm dev` to run the app; `pnpm build` + `pnpm start` for production flow.
- `pnpm lint`, `pnpm lint:fix`, `pnpm type-check` for validation; `pnpm format` / `pnpm format:check` for Prettier.

## Coding Conventions
- TypeScript/TSX everywhere; typed props/returns for public helpers; avoid `any`.
- File/folder names in kebab-case; components PascalCase; hooks camelCase starting with `use`.
- Keep UI primitives in `components/ui/`; prefer editing existing components/hooks before creating new files.
- Tailwind only for styling (no inline styles); match spacing and color tokens already used.
- Add `use client` at the top of any component using hooks/state.

## Data & APIs
- Data fetching via TanStack Query; defaults set in `components/providers.tsx` (5m staleTime, no refetchOnWindowFocus). Use meaningful query keys with workspace slug for scoping.
- Use `lib/api/client.ts` (`apiCall`) and `BASE_URL` from `lib/api/shared.api.ts` for backend calls; internal API routes should align with these utilities.
- API handlers in `app/api/**` should be typed, wrap logic in try/catch, and return proper status codes. Reuse `validateOrRefreshToken` for protected routes where applicable.

## Forms, Auth, UI
- Forms: `react-hook-form` + `zod`; define schema above the component, infer types, and show validation messages via shadcn form primitives.
- Auth: NextAuth (credentials + OAuth). Use `useSession()` client-side; keep tokens in cookies (handled by NextAuth).
- UI: reuse shadcn primitives in `components/ui/` (Dialog for modals, Form for forms, Sonner/Toast for notifications). Keep loading/empty states consistent with existing components.

## Testing & Quality
- No dedicated test runner; rely on `pnpm lint` and `pnpm type-check` before handoff. Add lightweight RTL tests only if needed (`*.test.tsx`).
- Avoid regressions noted in `TODO.md` (e.g., prefer real backend integration over mock/fake data; keep workspace slug/id usage consistent).

## Pitfalls to Avoid
- Don’t use `npm`; don’t add inline styles; don’t skip reading files before editing.
- Maintain workspace scoping in query keys and routes; keep response envelopes consistent (`{ data, meta }` etc.).
- Reuse existing utilities/hooks instead of duplicating logic; prefer enhancing current files over adding new ones.

## Pre-Commit Hygiene
- Run lint + type-check + format locally; capture new env vars or migrations in PR notes.
- Never create commits unless the user explicitly asks.
