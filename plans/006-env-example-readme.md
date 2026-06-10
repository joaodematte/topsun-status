# Plan 006: Add .env.example and fix README onboarding

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- README.md apps/web/.env.example apps/server/.env.example .env.example`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (cross-references plan 003 `CORS_ORIGIN` and plan 005 formatted CPF docs)
- **Category**: dx
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

Required environment variables are undocumented. New developers must guess from code: `DATABASE_URL` for MySQL, `VITE_SERVER_URL` and `VITE_CDN_URL` for the web app, ports that disagree between README (3000/3001) and server default (8888), and (after plan 003) `CORS_ORIGIN`. Missing vars fail silently (`undefined/logo.png`, broken API base URL). `.env` is gitignored correctly — but there is no `.env.example` template.

## Current state

- `README.md:30-31` — says API at `http://localhost:3000`, web at `http://localhost:3001`.
- `apps/server/src/index.ts:19` — `port: process.env.PORT ?? 8888`.
- `apps/web/.env` (gitignored, local only) — contains `VITE_SERVER_URL=http://localhost:8888` and `VITE_CDN_URL=https://cdn-status.topsun.dev` (do **not** copy secret values into committed files; URLs shown here are non-secret CDN/dev endpoints).
- `apps/server/src/database.ts:5` — `uri: process.env.DATABASE_URL`.
- `turbo.json` — lists `DATABASE_URL`, `HOSTNAME`, `PORT`, `VITE_SERVER_URL`, `VITE_CDN_URL` for build cache.
- `.gitignore` — ignores `.env` and `.env*.local` but not `.env.example`.

## Commands you will need

| Purpose | Command         | Expected on success |
| ------- | --------------- | ------------------- |
| Lint    | `bun run check` | exit 0              |

No typecheck change expected from docs-only work.

## Scope

**In scope**:

- `README.md`
- `.env.example` (create at repo root **or** `apps/web/.env.example` + `apps/server/.env.example` — pick one layout and document it in README)

**Out of scope**:

- Committing real `.env` files or database credentials.
- Changing runtime port defaults in code.
- Docker Compose — not present today.

## Git workflow

- Branch: `advisor/006-env-example-readme`
- Commit message style: `document env vars and fix README ports`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create env example files

Create `apps/server/.env.example`:

```env
# MySQL connection string (required)
DATABASE_URL=mysql://user:password@host:3306/database

# Server bind (optional)
HOSTNAME=0.0.0.0
PORT=8888

# Comma-separated allowed browser origins for CORS (required in production)
# After plan 003: must include the web app origin
CORS_ORIGIN=http://localhost:3001
```

Create `apps/web/.env.example`:

```env
# API base URL (required) — must match server PORT
VITE_SERVER_URL=http://localhost:8888

# Static assets CDN base URL (required)
VITE_CDN_URL=https://cdn-status.topsun.dev
```

Use placeholder credentials in `DATABASE_URL` only — never real passwords.

**Verify**: `git status` shows new `.env.example` files, not `.env`.

### Step 2: Update README Getting Started

In `README.md`, after `bun install`, add a setup step:

1. Copy env templates:
   ```bash
   cp apps/server/.env.example apps/server/.env
   cp apps/web/.env.example apps/web/.env
   ```
2. Fill in `DATABASE_URL` in `apps/server/.env`.

Fix the ports section (lines 30-31) to:

- Web: `http://localhost:3001` (unchanged if Vite default)
- API: `http://localhost:8888` (matches server default and local `VITE_SERVER_URL`)

Add a short **Environment variables** subsection listing each var, which app uses it, and whether required.

Document the **formatted CPF contract** (plan 005): API expects `cpf` query param as `000.000.000-00` because the database stores formatted values.

**Verify**: Read README aloud for consistency — no reference to port 3000 for API unless code changes to match (it has not).

### Step 3: Mention CORS_ORIGIN in turbo.json comment (optional)

If plan 003 added `CORS_ORIGIN` to `turbo.json` `build.env`, no README change beyond step 2. If not yet added, note in README that server reads `CORS_ORIGIN` at runtime.

**Verify**: `bun run check` → exit 0.

## Test plan

Onboarding dry-run (manual):

1. Fresh clone mental check: README steps mention both `.env.example` copies.
2. `grep -r "localhost:3000" README.md` → should not describe API port (unless web dev proxy uses 3000 — it does not today).

## Done criteria

- [ ] `apps/server/.env.example` and `apps/web/.env.example` exist with placeholders only
- [ ] README documents env setup and correct ports (API 8888)
- [ ] README mentions formatted CPF for `/projects` queries
- [ ] No `.env` files committed (`git ls-files | grep '\.env$'` → no matches)
- [ ] `bun run check` exits 0
- [ ] `plans/README.md` row 006 → DONE

## STOP conditions

- Production CDN or API URLs are secret — use obvious placeholders in examples and mark "ask team for values".
- Monorepo convention expects a single root `.env` — stop and report; adapt layout to match existing deploy docs if found.
- README port 3001 for web is wrong for current Vite config — read `apps/web/vite.config.ts` and `package.json` dev script; fix to actual port.

## Maintenance notes

- When new env vars are added (rate-limit Redis, etc.), update both `.env.example` files and README in the same PR.
- Reviewers: ensure no credential values appear in committed files.
