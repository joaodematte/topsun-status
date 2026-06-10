# Plan 001: Fix red typecheck and lint baseline

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- apps/web/tsconfig.json apps/web/src/features/projects/components/steps-page.tsx apps/server/tsdown.config.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

`bun run check-types` and `bun run check` both fail today. No later plan can be verified reliably until these gates are green. The failures are small and localized: `Array.prototype.toSorted` is used in web code but `lib` stops at ES2022, and a server build regex is missing the `u` flag.

## Current state

- `apps/web/tsconfig.json` — web TypeScript config; `lib` is `["ES2022", "DOM", "DOM.Iterable"]` (line 7).
- `apps/web/src/features/projects/components/steps-page.tsx:94-99` — uses `.toSorted()` on `Object.entries(projects)`, which requires ES2023 lib types.
- `apps/server/tsdown.config.ts:7` — `noExternal: [/@topsun-status\/.*/]` triggers `eslint(require-unicode-regexp)`.

Relevant excerpts:

```typescript
// steps-page.tsx:94-99
const projectList = Object.entries(projects)
  .toSorted(
    ([firstProjectId], [secondProjectId]) =>
      Number(firstProjectId) - Number(secondProjectId)
  )
  .map(([, project]) => project);
```

```typescript
// tsdown.config.ts:7
noExternal: [/@topsun-status\/.*/],
```

Repo convention: run `bun run check-types` and `bun run check` from the monorepo root (see root `package.json`).

## Commands you will need

| Purpose   | Command               | Expected on success       |
| --------- | --------------------- | ------------------------- |
| Typecheck | `bun run check-types` | exit 0, all packages pass |
| Lint/fmt  | `bun run check`       | exit 0                    |

## Scope

**In scope**:

- `apps/web/tsconfig.json`
- `apps/server/tsdown.config.ts`

**Out of scope**:

- `apps/web/src/features/projects/components/steps-page.tsx` — do not replace `.toSorted()`; fix the lib instead (immutable sort is preferred in this repo's AGENTS.md).
- `.agents/skills/improve/**` — formatting issues there are unrelated to app code; do not touch.

## Git workflow

- Branch: `advisor/001-fix-typecheck-lint-baseline`
- Commit message style (from repo history): short imperative, e.g. `fix typecheck baseline`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Bump web TypeScript lib to ES2023

In `apps/web/tsconfig.json`, change the `lib` array from:

```json
"lib": ["ES2022", "DOM", "DOM.Iterable"]
```

to:

```json
"lib": ["ES2023", "DOM", "DOM.Iterable"]
```

**Verify**: `bun run check-types` → exit 0 (web package must pass; no `toSorted` or implicit `any` errors in `steps-page.tsx`).

### Step 2: Add unicode flag to tsdown regex

In `apps/server/tsdown.config.ts`, change line 7 to:

```typescript
noExternal: [/@topsun-status\/.*/u],
```

**Verify**: `bun run check` → exit 0. If formatting complaints remain only under `.agents/skills/improve/`, that is acceptable — the app lint error must be gone.

## Test plan

No new tests (tests were not selected for this audit). Verification is the command gates above.

## Done criteria

- [ ] `bun run check-types` exits 0
- [ ] `bun run check` exits 0 (no eslint errors in `apps/`)
- [ ] Only in-scope files modified (`git status`)
- [ ] `plans/README.md` status row for 001 updated to DONE

## STOP conditions

- `steps-page.tsx` no longer uses `.toSorted()` — compare live file; if changed, either restore usage or adjust approach and report.
- `bun run check` still fails on files outside `apps/` after step 2 — report; do not reformat `.agents/skills/` unless operator asks.
- Bumping `lib` to ES2023 causes new errors outside `steps-page.tsx` — stop and report the error list.

## Maintenance notes

- If future code uses ES2024+ APIs (e.g. `Object.groupBy`), bump `lib` again or use explicit polyfill patterns.
- Keep `bun run check-types` green before merging any other advisor plan.
