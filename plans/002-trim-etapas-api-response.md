# Plan 002: Trim etapas API response to required fields

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- apps/server/src/repositories/etapas.ts apps/server/src/types.ts packages/shared/src/schemas/projects.ts apps/web/src/features/projects/components/project-timeline.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-lint-baseline.md
- **Category**: security
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

`GET /projects` is unauthenticated. Today it runs `SELECT * FROM etapas` and serializes every column to the client. The shared Zod schema uses `.catchall(z.unknown())`, so internal DB fields pass through unchecked. The UI only reads `cod_cfg_etapa` and `status_etapa` (see `project-timeline.tsx`). Trimming the query and schema closes an unnecessary data exposure and shrinks payloads.

## Current state

- `apps/server/src/repositories/etapas.ts:17-27` — `findEtapasByProjetoIds` uses `SELECT * FROM etapas`.
- `apps/server/src/types.ts:12-16` — `Etapa` interface includes fields used only because of `SELECT *`.
- `packages/shared/src/schemas/projects.ts:8-13` — `projectStepSchema` allows arbitrary extra keys via `.catchall(z.unknown())`.
- `apps/web/src/features/projects/components/project-timeline.tsx:30-35` — consumes only `step.cod_cfg_etapa` and `step.status_etapa`.

Repository pattern: SQL in `apps/server/src/repositories/*`, Zod contracts in `packages/shared`, UI in `apps/web`.

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Typecheck | `bun run check-types` | exit 0              |
| Lint      | `bun run check`       | exit 0              |
| Build     | `bun run build`       | exit 0              |

## Scope

**In scope**:

- `apps/server/src/repositories/etapas.ts`
- `apps/server/src/types.ts`
- `packages/shared/src/schemas/projects.ts`

**Out of scope**:

- `apps/web/**` — UI already works with the two fields; no change needed unless types break (they should not).
- Database schema / migrations — read-only query change only.
- `PROJECT_STEPS` dead code in `config/steps.ts`.

## Git workflow

- Branch: `advisor/002-trim-etapas-api-response`
- Commit message style: `limit etapas fields in projects API`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Select only required columns in the repository

In `apps/server/src/repositories/etapas.ts`, change `findEtapasByProjetoIds` SQL from `SELECT *` to:

```sql
SELECT cod_cfg_etapa, status_etapa, cod_coleta_etapa FROM etapas WHERE cod_coleta_etapa IN (...)
```

Keep `cod_coleta_etapa` in the SELECT — it is used server-side to group steps into projects (`etapas.ts:41`) but must **not** appear in the JSON sent to clients. Strip it when building `project.steps` (only push `{ cod_cfg_etapa, status_etapa }`).

Update the loop at lines 40-48 to push trimmed step objects:

```typescript
project.steps.push({
  cod_cfg_etapa: step.cod_cfg_etapa,
  status_etapa: step.status_etapa,
});
```

**Verify**: `bun run check-types` → exit 0.

### Step 2: Narrow server Etapa type

In `apps/server/src/types.ts`, keep `Etapa` as the row shape including `cod_coleta_etapa` for grouping. No need to export extra columns that are no longer selected.

**Verify**: `bun run check-types` → exit 0.

### Step 3: Remove catchall from shared schema

In `packages/shared/src/schemas/projects.ts`, replace:

```typescript
export const projectStepSchema = z
  .object({
    cod_cfg_etapa: z.number(),
    status_etapa: z.number(),
  })
  .catchall(z.unknown());
```

with:

```typescript
export const projectStepSchema = z.object({
  cod_cfg_etapa: z.number(),
  status_etapa: z.number(),
});
```

**Verify**: `bun run check-types` → exit 0 across all packages.

### Step 4: Confirm response shape

Manually inspect `getEtapasByProjetosId` return value: each `project.steps[]` entry must have exactly two keys. `cod_coleta_etapa` must not appear in the JSON response.

**Verify**: `bun run build` → exit 0.

## Test plan

No automated tests in repo today. Manual check if server is runnable:

```bash
bun run dev:server
# In another terminal (with DATABASE_URL set):
curl -s "http://localhost:8888/projects?cpf=000.000.000-00&birthDate=1990-01-01" | head -c 500
```

Expected: JSON object keyed by project id; each step object contains only `cod_cfg_etapa` and `status_etapa`. If DB is unavailable, skip manual curl and rely on build + typecheck gates.

## Done criteria

- [ ] `SELECT *` removed from etapas query (`grep -n "SELECT \*" apps/server/src/repositories/etapas.ts` → no match)
- [ ] `projectStepSchema` has no `.catchall`
- [ ] `bun run check-types` exits 0
- [ ] `bun run build` exits 0
- [ ] Only in-scope files modified
- [ ] `plans/README.md` row 002 → DONE

## STOP conditions

- `etapas` table column names differ from `cod_cfg_etapa`, `status_etapa`, `cod_coleta_etapa` — stop and report actual schema.
- Removing `.catchall` causes `projectsByIdSchema.parse` failures against real API responses — stop with sample payload.
- Any consumer outside `project-timeline.tsx` reads additional step fields — grep `cod_coleta_etapa` and `status_etapa` usage across repo before deleting fields.

## Maintenance notes

- If new UI needs more step fields, add them explicitly to the SELECT, server mapping, and `projectStepSchema` — never revert to `SELECT *`.
- Reviewers should confirm no internal etapa columns appear in network tab responses.
