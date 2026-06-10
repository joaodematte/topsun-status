# Plan 004: Create QueryClient per router instance

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0a4e3a3..HEAD -- apps/web/src/router.tsx`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-typecheck-lint-baseline.md
- **Category**: bug
- **Planned at**: commit `0a4e3a3`, 2026-06-10

## Why this matters

`apps/web/src/router.tsx` creates a module-level `QueryClient` shared by every SSR request and browser session that reuses the same module instance. TanStack Query cache is mutable per-client state; sharing it across requests can leak cached project data between users if queries ever run during SSR (or if the module is reused in a long-lived server process). Moving construction inside `getRouter()` gives each router instance its own cache.

Today all project fetches are client-triggered (`enabled` guards in `steps-page.tsx`), so the bug is latent — but the pattern is wrong for TanStack Start SSR.

## Current state

```typescript
// apps/web/src/router.tsx:6-17
const queryClient = new QueryClient();

export function getRouter() {
  const router = createTanStackRouter({
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    context: {},
    // ...
  });
  return router;
}
```

Consumers use `useQueryClient()` in:

- `apps/web/src/features/projects/components/client-form.tsx`
- `apps/web/src/features/projects/components/steps-page.tsx`

They will continue to work as long as they sit under the same `QueryClientProvider` — no changes needed there.

## Commands you will need

| Purpose   | Command                                                        | Expected on success |
| --------- | -------------------------------------------------------------- | ------------------- |
| Typecheck | `bun run check-types`                                          | exit 0              |
| Lint      | `bun run check`                                                | exit 0              |
| Build     | `bun run build --filter=web` or `cd apps/web && bun run build` | exit 0              |

## Scope

**In scope**:

- `apps/web/src/router.tsx`

**Out of scope**:

- `steps-page.tsx` query `enabled` logic — works today.
- Dehydration/hydration setup — not used yet; do not add unless already present elsewhere.
- Default `staleTime` / `gcTime` tuning — optional, not required.

## Git workflow

- Branch: `advisor/004-per-request-query-client`
- Commit message style: `create QueryClient inside getRouter`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Move QueryClient into getRouter

Refactor `apps/web/src/router.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    context: {},
    defaultNotFoundComponent: () => <div>Not Found</div>,
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
```

Remove the module-level `const queryClient = new QueryClient();`.

**Verify**: `bun run check-types` → exit 0.

### Step 2: Confirm no module-level QueryClient remains

**Verify**: `grep -n "new QueryClient" apps/web/src/router.tsx` → exactly one match, inside `getRouter`.

### Step 3: Build web app

**Verify**: `cd apps/web && bun run build` → exit 0.

## Test plan

Manual UX check if dev server available:

1. `bun run dev:web` and `bun run dev:server`
2. Submit form on `/` → navigate to `/steps` → projects render (cache from mutation still works).
3. Hard refresh `/steps?cpf=...&birthDate=...` → refetch works.

If env/DB unavailable, build + typecheck suffice.

## Done criteria

- [ ] No module-scoped `QueryClient` in `router.tsx`
- [ ] `bun run check-types` exits 0
- [ ] `bun run check` exits 0
- [ ] Web build exits 0
- [ ] Only `apps/web/src/router.tsx` modified (unless drift required otherwise — report if so)
- [ ] `plans/README.md` row 004 → DONE

## STOP conditions

- `getRouter()` is imported and cached as a singleton at module level elsewhere — grep `getRouter` across `apps/web`; if a singleton wrapper exists, stop and report path.
- Moving QueryClient breaks HMR or client navigation in dev — report behavior; do not revert without operator input.
- TanStack Start entry expects QueryClient on router `context` — read framework entry files; if required, extend `context` typing instead of improvising a different pattern.

## Maintenance notes

- If SSR prefetch of projects is added later, pair with proper dehydrate/hydrate using the per-request `queryClient` from router context.
- Reviewers: grep for other module-level caches (`new Map`, `let cache`) in `apps/web/src`.
