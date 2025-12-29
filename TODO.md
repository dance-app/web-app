API Summary and QA Checklist

- Context: Next.js App Router API routes under `app/api/**`. All mock functionality has been removed - the app now uses real API calls to the backend.
- Legend: ✅ implemented and consistent · ❌ problem/incomplete/inconsistent · ⚠️ needs implementation

Auth

- POST `/auth/sign-in` — ✅: NextAuth credentials provider hits backend directly (no `/api` proxy); errors mapped via `ERROR_MESSAGES`.
- POST `/auth/sign-up` — ✅: Front-end calls backend directly (no `/api` proxy).
- POST `/auth/verify-email` — ✅: Front-end calls backend directly via `apiCall` (no `/api` proxy; API route removed).
- GET `/auth/me` — direct backend call only (proxy removed).
- GET/POST `/api/auth/[...nextauth]` — ✅: NextAuth credentials provider; uses backend.

Workspaces

- GET `/api/workspace` — ✅: Returns workspaces from real backend API with authentication.
- POST `/api/workspace` — ✅: Validates input; returns `CreateWorkspaceResponse { success, data: { workspace } }` aligned with hook.

Workspace: Members

- GET `/api/workspace/[slug]/members` — ⚠️: Currently uses fallback `fakeMembers` array; needs real backend integration.
- PUT `/api/workspace/[slug]/members/[id]` — ⚠️: Returns 501 (not implemented); needs real backend integration.
- DELETE `/api/workspace/[slug]/members/[id]` — ⚠️: Returns 501 (not implemented); needs real backend integration.
- POST `/api/workspace/[slug]/members` — ❌: Missing; add for CRUD parity.

Workspace: Events

- GET `/api/workspace/[slug]/events` — ⚠️: Uses fallback `mockEvents` array; needs real backend integration.
- POST `/api/workspace/[slug]/events` — ⚠️: Uses fallback logic; needs real backend integration.

Workspace: Materials

- GET `/api/workspace/[slug]/materials` — ✅: Proxies to real backend API.
- POST `/api/workspace/[slug]/materials` — ❌: Returns `{ material: null }`; needs implementation.
- PUT `/api/workspace/[slug]/materials` — ❌: Uses placeholder logic; needs implementation.
- DELETE `/api/workspace/[slug]/materials` — ❌: Always returns success without deletion; needs implementation.
- Hooks mismatch — ❌: Hooks call `/api/workspace/${workspace.id}/materials` (id) while route is `[slug]`. Standardize on `slug` or `id` across hooks and routes.

Marketplace

- GET `/api/marketplace/materials` — ⚠️: Needs real backend integration.
- POST `/api/marketplace/materials` — ⚠️: Needs real backend integration.

General Notes

- Mock data removed: All `MockApi` and `mock-data` files have been deleted. The app now makes real API calls.
- Auth: Several GET routes comment out `validateOrRefreshToken`; decide consistent policy and enforce.
- Params: Materials routes defined under `[slug]` but use `params.id`; hooks often use `workspace.id`. Align naming everywhere.
- Response: Normalize envelopes (e.g., events POST and workspaces GET) to avoid UI conditionals.
- Fallback data: Some routes still use local fallback arrays (fakeMembers, mockEvents) when backend is not available. These should be removed once backend integration is complete.

Recommended Fixes (Short List)

- Materials: Use `{ slug }` param consistently, update hooks to slug, and implement POST/PUT/DELETE with real backend calls.
- Marketplace: Integrate with real backend API for GET and POST operations.
- Members/Events: Replace fallback arrays with real backend API calls.
- Shapes: Make list routes return `{ data, meta }`; single-item routes return a consistent shape (e.g., `{ event }` or direct object — pick one and apply).
- Auth: Re-enable token validation on protected GETs for consistency.
- Backend Integration: Complete integration for all routes marked with ⚠️ (needs implementation).
