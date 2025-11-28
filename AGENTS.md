# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `app/` with grouped segments: `(public)` for unauthenticated pages, `(protected)` for authenticated flows, `(no-auth-only)` for auth-exclusive routes, plus `api/` for Next.js route handlers. `layout.tsx` wires global providers and `globals.css`.
- Shared UI and layouts sit in `components/`; `components/ui/` holds primitives (shadcn-style), while feature folders such as `classes/`, `events/`, `members/`, and `workspaces/` host composed widgets. Cross-cutting wrappers (e.g., `page-layout.tsx`, `workspace-guard.tsx`) ensure consistent shell behavior.
- Reusable hooks live in `hooks/`; utilities and data helpers in `lib/`; shared types in `types/`. Tailwind and PostCSS config files are in the repo root; global theme tokens are in `styles/`. Static assets belong in `public/`.

## Build, Test, and Development Commands
- `pnpm dev` — run the Next.js dev server with hot reloading.
- `pnpm build` / `pnpm start` — create a production build and serve it.
- `pnpm lint` / `pnpm lint:fix` — run Next.js/ESLint checks (autofix with `lint:fix`).
- `pnpm type-check` — compile TypeScript without emitting output.
- `pnpm format` / `pnpm format:check` — format with Prettier or verify formatting.

## Coding Style & Naming Conventions
- Code in TypeScript/TSX; prefer typed props and explicit return types for public helpers. Functional React components only.
- File and folder names favor kebab-case (`page-layout.tsx`); components and hooks use PascalCase/CamelCase in code. Keep UI primitives in `components/ui/`; keep feature-specific pieces within their domain folder.
- Styling uses Tailwind CSS; extend design tokens via `tailwind.config.ts` and `styles/`. Run Prettier before committing to keep consistent spacing and quotes.

## Testing Guidelines
- No automated test runner is configured yet; lean on `pnpm lint` and `pnpm type-check` for regressions. When adding tests, follow `*.test.ts(x)` naming near the implementation or in `__tests__/`.
- Favor component-level tests with React Testing Library and lightweight integration coverage over brittle snapshots. Include fixtures/mocks alongside the test when possible.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative descriptions (e.g., `Fix layout`, `Add delete flow`). Keep each commit focused.
- Before a PR, run `pnpm lint` and `pnpm type-check`. Attach concise descriptions, link relevant issues, and include UI screenshots or recordings for visible changes.
- Note any migrations or new environment variables in the PR body; store secrets in `.env.local` and never commit them.
