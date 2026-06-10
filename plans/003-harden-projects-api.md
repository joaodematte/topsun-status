# Plan 003: Harden projects API (CORS + rate limiting)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- apps/server/src/index.ts apps/server/src/routes/projects.ts apps/server/package.json turbo.json`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/001-fix-typecheck-lint-baseline.md
- **Category**: security
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

`GET /projects` looks up customer data by CPF + birth date with no authentication. Today the server applies `cors()` with default wildcard origin and has no rate limiting, making scripted enumeration easier. Restricting CORS to known web origins and adding per-IP rate limits raises the cost of abuse without changing the product flow.

CPF **format** validation is handled in plan 005 (DB stores formatted CPF). This plan covers transport-level hardening only.

## Current state

- `apps/server/src/index.ts:10` — `app.use("*", cors())` allows any origin.
- `apps/server/src/routes/projects.ts` — single unauthenticated GET handler.
- `apps/server/src/index.ts:19` — default port `8888`.
- `apps/web/.env` (local, gitignored) — `VITE_SERVER_URL=http://localhost:8888`; web dev typically on port 3001 per README.

```typescript
// index.ts:10-14
app.use("*", cors());
app.use(logger());

app.route("/health", healthRoute);
app.route("/projects", projectsRoute);
```

Hono conventions in this repo: routes in `apps/server/src/routes/*`, app wiring in `index.ts`. Use Hono middleware patterns (see `.agents/skills/hono/SKILL.md` if available).

## Commands you will need

| Purpose   | Command                                                              | Expected on success |
| --------- | -------------------------------------------------------------------- | ------------------- |
| Typecheck | `bun run check-types`                                                | exit 0              |
| Lint      | `bun run check`                                                      | exit 0              |
| Build     | `bun run build --filter=server` or `cd apps/server && bun run build` | exit 0              |

## Scope

**In scope**:

- `apps/server/src/index.ts`
- `apps/server/src/routes/projects.ts` (only if middleware is route-scoped)
- New file: `apps/server/src/middleware/rate-limit.ts` (create)
- `turbo.json` (add `CORS_ORIGIN` to build `env` if needed for Docker builds)
- `apps/server/package.json` (only if a small dependency is required)

**Out of scope**:

- `packages/shared/src/schemas/projects.ts` — CPF format is plan 005.
- Authentication / API keys — product is intentionally public lookup.
- WAF or edge rate limiting — in-process limit is sufficient for now.

## Git workflow

- Branch: `advisor/003-harden-projects-api`
- Commit message style: `restrict CORS and rate-limit projects lookup`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add configurable CORS allowlist

In `apps/server/src/index.ts`, replace bare `cors()` with an explicit origin allowlist:

```typescript
import { cors } from "hono/cors";

const defaultOrigins = ["http://localhost:3001"];
const corsOrigins = (process.env.CORS_ORIGIN ?? defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: corsOrigins,
  })
);
```

Document `CORS_ORIGIN` as a comma-separated list in plan 006's `.env.example` (can be done in either plan; if 006 not run yet, add a one-line comment in `index.ts`).

**Verify**: `bun run check-types` → exit 0.

### Step 2: Add in-memory rate limiter middleware

Create `apps/server/src/middleware/rate-limit.ts` with a simple per-IP sliding window or fixed window limiter. Requirements:

- Key: client IP from `c.req.header("x-forwarded-for")` first hop, else `c.req.header("x-real-ip")`, else `"unknown"`.
- Limit: **30 requests per 60 seconds** per IP on `/projects` only (tune constants at top of file).
- On exceed: return `429` JSON `{ error: "Too many requests" }`.
- Store: in-memory `Map` (acceptable for single-instance Docker; document limitation in code comment).

Apply only to `projectsRoute`:

```typescript
// index.ts or projects.ts
projectsRoute.use("/*", rateLimit({ windowMs: 60_000, max: 30 }));
```

Prefer scoping to `/projects` so `/health` stays unrestricted for probes.

**Verify**: `bun run check-types` → exit 0.

### Step 3: Register env in turbo build cache (if applicable)

If `CORS_ORIGIN` is read at runtime only, turbo `build` may not need it. If Docker bake inlines env, add `"CORS_ORIGIN"` to `turbo.json` `build.env` array alongside existing entries.

**Verify**: `bun run build` from `apps/server` → exit 0.

### Step 4: Smoke-test behavior (if server runnable)

With `DATABASE_URL` set:

1. `curl -i -H "Origin: http://localhost:3001" "http://localhost:8888/health"` → `200`, `Access-Control-Allow-Origin: http://localhost:3001` (or matching header).
2. `curl -i -H "Origin: https://evil.example" "http://localhost:8888/health"` → CORS origin should not reflect evil origin (behavior depends on hono/cors — verify it does not echo `*` for credentialed cases).
3. Burst >30 requests to `/projects` within 60s → eventually `429`.

If DB unavailable, skip smoke tests; typecheck + build are sufficient.

## Test plan

No test framework in repo. Optional: add a minimal unit test for the rate-limit helper only if `bun test` is already used in server — it is not today; skip.

## Done criteria

- [ ] `cors()` without origin config is gone from `index.ts`
- [ ] Rate limit middleware exists and is mounted on `/projects` only
- [ ] `bun run check-types` exits 0
- [ ] `bun run check` exits 0
- [ ] `apps/server` build exits 0
- [ ] `plans/README.md` row 003 → DONE

## STOP conditions

- Deploy target is multi-instance without sticky sessions and needs shared rate-limit store — stop and report; Redis-backed limiter is out of scope unless operator approves.
- Production web origin is unknown — stop and ask for the canonical origin URL before hardcoding production CORS.
- `hono/cors` API differs from plan — read installed `hono` version types and adapt; do not add a different CORS library without reporting.

## Maintenance notes

- In-memory rate limits reset on deploy and do not coordinate across replicas. Move to edge/WAF or Redis if traffic or replica count grows.
- Plan 006 should list `CORS_ORIGIN` with dev and production examples.
- Reviewers: confirm `/health` still works from load balancers without Origin header.
