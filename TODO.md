API Summary and QA Checklist

- Context: Next.js App Router API routes under `app/api/**`. Mocking is globally enabled via `lib/mock-api.ts` (`USE_MOCK_DATA = true`) and is hardcoded on. Many routes short‑circuit to mock responses.
- Legend: ✅ implemented and consistent · ❌ problem/incomplete/inconsistent · 🤖 mocked/stubbed

Auth

- POST `/auth/sign-in` — ✅: NextAuth credentials provider hits backend directly (no `/api` proxy); errors mapped via `ERROR_MESSAGES`.
- POST `/auth/sign-up` — ✅: Front-end calls backend directly (no `/api` proxy).
- POST `/auth/verify-email` — ✅: Front-end calls backend directly via `apiCall` (no `/api` proxy; API route removed).
- GET `/auth/me` — direct backend call only (proxy removed).
- GET/POST `/api/auth/[...nextauth]` — ✅: NextAuth credentials provider; uses backend (mocks removed).

Workspaces

- GET `/api/workspace` — 🤖 ❌: Returns `{ workspaces: { data, meta } }` under a wrapper; clients typically expect `{ data, meta }`. Normalize envelope.
- POST `/api/workspace` — 🤖 ✅: Validates input; returns `CreateWorkspaceResponse { success, data: { workspace } }` aligned with hook.

Workspace: Members

- GET `/api/workspace/[slug]/members` — 🤖 ✅: Supports `page`/`limit`; returns `{ members }` (mocked uses `data.data`). Fallback to local `fakeMembers`.
- PUT `/api/workspace/[slug]/members/[id]` — 🤖 ❌: Mocked update works; real backend path returns 501 (not implemented).
- DELETE `/api/workspace/[slug]/members/[id]` — 🤖 ❌: Mocked delete works; real backend path returns 501 (not implemented).
- POST `/api/workspace/[slug]/members` — ❌: Missing; add for CRUD parity.

Workspace: Events

- GET `/api/workspace/[slug]/events` — 🤖 ❌: Mocked returns `{ events, danceTypes, meta }`; fallback lacks `meta`. Align response shape.
- POST `/api/workspace/[slug]/events` — 🤖 ❌: Mocked returns event directly; fallback returns `{ event }`. Normalize shape.

Workspace: Materials

- GET `/api/workspace/[slug]/materials` — 🤖 ✅: Uses `MockApi.getMaterials` and returns `{ materials: { data, meta } }` (matches hook). Fallback proxies real backend and wraps as `{ materials: ... }`.
- POST `/api/workspace/[slug]/materials` — ❌: Handler expects `params.id` but folder is `[slug]`; returns `{ material: null }`. Fix param and implement create (can use `MockApi.createMaterial`).
- PUT `/api/workspace/[slug]/materials` — ❌: Uses `params.id` and an empty array placeholder; no real update. Fix param, use mock or backend.
- DELETE `/api/workspace/[slug]/materials` — ❌: Uses `params.id`; always returns success without deletion. Fix param and deletion logic.
- Hooks mismatch — ❌: Hooks call `/api/workspace/${workspace.id}/materials` (id) while route is `[slug]`. Standardize on `slug` or `id` across hooks and routes.

Marketplace

- GET `/api/marketplace/materials` — 🤖 ❌: Auth validated; filters an empty array; always returns empty `{ materials, total, hasMore }`. Should use `MockApi.getMarketplaceMaterials` or backend.
- POST `/api/marketplace/materials` — 🤖 ❌: Validates input; looks up in empty array → 404. Implement lookup/copy via mock dataset or backend.

General Notes

- Mock flag: `USE_MOCK_DATA = true` enables most 🤖 paths by default (no env toggle).
- Auth: Several GET routes comment out `validateOrRefreshToken`; decide consistent policy and enforce.
- Params: Materials routes defined under `[slug]` but use `params.id`; hooks often use `workspace.id`. Align naming everywhere.
- Response: Normalize envelopes (e.g., events POST and workspaces GET) to avoid UI conditionals.

Recommended Fixes (Short List)

- Materials: Use `{ slug }` param, update hooks to slug, and implement POST/PUT/DELETE (via `MockApi` now; backend later).
- Marketplace: Wire to `MockApi.getMarketplaceMaterials` and add real copy logic in POST; later proxy to backend.
- Shapes: Make list routes return `{ data, meta }`; single-item routes return a consistent shape (e.g., `{ event }` or direct object — pick one and apply).
- Auth: Re-enable token validation on protected GETs for consistency.
