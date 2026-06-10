# topsun-status

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Hono** - Lightweight, performant server framework
- **Bun** - Runtime environment
- **Turborepo** - Optimized monorepo build system
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)

## Getting Started

First, install the dependencies:

```bash
bun install
```

Copy the environment templates and fill in your values:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

Set `DATABASE_URL` in `apps/server/.env` to your MySQL connection string. Ask the team for production CDN values if needed.

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:8888](http://localhost:8888).

### Environment variables

| Variable          | App    | Required   | Description                                                                            |
| ----------------- | ------ | ---------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | server | yes        | MySQL connection string                                                                |
| `HOSTNAME`        | server | no         | Bind address (default `0.0.0.0`)                                                       |
| `PORT`            | server | no         | API port (default `8888`)                                                              |
| `CORS_ORIGIN`     | server | production | Comma-separated browser origins allowed by CORS (dev: include `http://localhost:3001`) |
| `VITE_SERVER_URL` | web    | yes        | API base URL (must match server port, e.g. `http://localhost:8888`)                    |
| `VITE_CDN_URL`    | web    | yes        | Static assets CDN base URL                                                             |

Templates live in `apps/server/.env.example` and `apps/web/.env.example`.

### API: formatted CPF

The `/projects` endpoint expects the `cpf` query parameter in **formatted** Brazilian CPF notation (`000.000.000-00`). The database stores CPF values with punctuation; unformatted digits will not match. The web form already submits formatted CPF.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@topsun-status/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Run checks: `bun run check`

## Project Structure

```
topsun-status/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   └── server/      # Backend API (Hono)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Oxlint and Oxfmt
