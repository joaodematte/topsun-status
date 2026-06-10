# Plan 005: Codify formatted CPF contract end-to-end

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- packages/shared/src/schemas/projects.ts apps/web/src/features/projects/schemas/client-form-schema.ts apps/web/src/features/projects/components/client-form.tsx apps/server/src/routes/projects.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-lint-baseline.md, plans/003-harden-projects-api.md
- **Category**: correctness
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

The MySQL `clientes.cpfcnpj_cliente` column stores CPF in **formatted** form (`000.000.000-00`). The web form already keeps and submits formatted CPF (`client-form.tsx` passes `data.cpf` after `formatCpf`). The shared API schema only requires `z.string().min(1)`, so malformed strings hit the DB and return generic 404s. Tightening the contract at the shared schema boundary gives fast 400s, documents the invariant for future clients, and aligns URL search params on `/steps` with the same rules.

**Do not strip formatting before the DB query** — stripping would break lookups.

## Current state

- `packages/shared/src/schemas/projects.ts:3-6` — `cpf: z.string().min(1)`.
- `apps/server/src/repositories/clientes.ts:9` — `WHERE cpfcnpj_cliente = ?` with bound `cpf` as-is.
- `apps/web/src/features/projects/components/client-form.tsx:51-55` — sends formatted `data.cpf`.
- `apps/web/src/features/projects/schemas/client-form-schema.ts` — client-side `validateCpf` on display-formatted input.
- `apps/web/src/routes/steps.tsx:15-19` — `validateSearch` uses `projectsQuerySchema`.

```typescript
// shared/schemas/projects.ts
export const projectsQuerySchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  cpf: z.string().min(1),
});
```

## Commands you will need

| Purpose   | Command               | Expected on success |
| --------- | --------------------- | ------------------- |
| Typecheck | `bun run check-types` | exit 0              |
| Lint      | `bun run check`       | exit 0              |

## Scope

**In scope**:

- `packages/shared/src/schemas/projects.ts`

**Out of scope**:

- `apps/server/src/repositories/clientes.ts` — query stays formatted; no normalization.
- `apps/web/src/features/projects/lib/cpf.ts` — client validation already correct.
- Stripping/reformatting digits-only CPF — explicitly rejected; DB stores formatted values.

Optional doc cross-reference: plan 006 README can mention formatted CPF; a one-line comment in `projects.ts` is enough if 006 is not done yet.

## Git workflow

- Branch: `advisor/005-codify-formatted-cpf-contract`
- Commit message style: `validate formatted CPF in projects query schema`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add formatted CPF regex to shared schema

In `packages/shared/src/schemas/projects.ts`, define a reusable pattern and apply it:

```typescript
/** Matches DB storage format for cpfcnpj_cliente (e.g. 123.456.789-09). */
const FORMATTED_CPF_PATTERN = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/u;

export const projectsQuerySchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  cpf: z
    .string()
    .regex(FORMATTED_CPF_PATTERN, "CPF must be formatted as 000.000.000-00"),
});
```

Export `FORMATTED_CPF_PATTERN` only if needed elsewhere; otherwise keep it file-local.

**Verify**: `bun run check-types` → exit 0 (web `validateSearch` and server route both consume this schema).

### Step 2: Confirm client form output matches pattern

Read `client-form.tsx` submit path — formatted CPF with punctuation must be what gets sent. `validateCpf` + `formatCpf` already enforce valid 11-digit CPF in display format.

**Verify**: No web changes required; if `clientFormSchema` stores formatted CPF (it does via `formatCpf` onChange), typecheck passing is sufficient.

### Step 3: Confirm API error for bad CPF shape

In `apps/server/src/routes/projects.ts`, failed `safeParse` already returns 400. No code change required unless message should be more specific — optional improvement:

```typescript
return c.json({ error: "Invalid CPF or birthDate format" }, 400);
```

Only if you touch this file for messaging; otherwise leave as-is.

**Verify**: `bun run check-types` → exit 0.

## Test plan

Manual (optional):

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8888/projects?cpf=12345678909&birthDate=1990-01-01"
# Expected: 400 (digits-only rejected)

curl -s -o /dev/null -w "%{http_code}" "http://localhost:8888/projects?cpf=123.456.789-09&birthDate=1990-01-01"
# Expected: 404 or 200 depending on DB — not 400 for format
```

## Done criteria

- [ ] `projectsQuerySchema.cpf` uses formatted CPF regex, not `min(1)`
- [ ] No code strips CPF formatting before DB query (`grep -rn "replaceAll.*cpf\|cpf.*replace" apps/server` — no new normalization)
- [ ] `bun run check-types` exits 0
- [ ] `bun run check` exits 0
- [ ] Only in-scope files modified (plus optional one-line error message in `projects.ts` if chosen)
- [ ] `plans/README.md` row 005 → DONE

## STOP conditions

- Maintainer reports DB sometimes stores **unformatted** CPF — stop; plan assumption is false.
- Real client traffic sends digits-only CPF in query strings — stop and propose dual-format lookup (out of scope here).
- `validateSearch` on `/steps` rejects valid bookmarks after schema tighten — verify with a known-good formatted URL before finishing.

## Maintenance notes

- Any new API client (mobile, partner) must send formatted CPF matching `cpfcnpj_cliente`.
- If CNPJ lookup is added later, this regex will need a union or separate field — corporate IDs use different formatting.
- Reviewers: confirm shared schema is the single source for both server query parse and router `validateSearch`.
