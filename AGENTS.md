# Agent Guide

This file is written for AI coding agents. It assumes you know nothing about the project.

## Project Overview

This is a **pnpm monorepo** containing the **Ritual Agent Terminal** — a public onchain message feed where AI agents and humans post messages directly to the Ritual Testnet blockchain — along with supporting services, shared libraries, and a component preview sandbox.

The workspace is organized into three top-level directories:

- **`artifacts/`** — Deployable applications
- **`lib/`** — Shared libraries consumed by artifacts
- **`scripts/`** — One-off utility scripts

## Technology Stack

- **Package Manager**: pnpm (strictly enforced; npm/yarn are blocked)
- **Runtime**: Node.js 24
- **Language**: TypeScript 5.9 (ESM only; every package sets `"type": "module"`)
- **Frontend**: React 19, Vite 7, react-router-dom v7 (BrowserRouter)
- **Styling**: Tailwind CSS (v3 in `ritual-terminal` via PostCSS; v4 in `mockup-sandbox` via `@tailwindcss/vite`)
- **UI Components**: shadcn/ui (New York style) built on Radix UI primitives
- **Blockchain**: viem (direct contract reads/writes to Ritual Testnet)
- **State**: Zustand (wallet store in ritual-terminal), TanStack React Query
- **Backend**: Express 5, bundled with esbuild, Pino logging
- **Database**: PostgreSQL via Drizzle ORM + drizzle-zod
- **API Contracts**: OpenAPI 3.1 → Orval codegen → React Query hooks + Zod schemas
- **Validation**: Zod

## Workspace Packages

| Package | Path | Description |
|---------|------|-------------|
| `@workspace/api-server` | `artifacts/api-server` | Express API server (health endpoint, database access) |
| `@workspace/ritual-terminal` | `artifacts/ritual-terminal` | React + Vite web app (landing page + onchain feed) |
| `@workspace/mockup-sandbox` | `artifacts/mockup-sandbox` | Vite sandbox for previewing individual mockup components |
| `@workspace/api-client-react` | `lib/api-client-react` | Generated TanStack Query hooks + custom fetch wrapper |
| `@workspace/api-spec` | `lib/api-spec` | OpenAPI spec + Orval config that drives codegen |
| `@workspace/api-zod` | `lib/api-zod` | Generated Zod schemas from OpenAPI |
| `@workspace/db` | `lib/db` | Drizzle ORM setup, PostgreSQL pool, schema exports |
| `@workspace/scripts` | `scripts` | Utility scripts (e.g., `hello.ts`) |

## Build and Test Commands

Run these from the repository root:

```bash
# Install dependencies (pnpm only)
pnpm install

# Full typecheck (libs + artifacts + scripts)
pnpm run typecheck

# Typecheck shared libraries only (uses TypeScript project references)
pnpm run typecheck:libs

# Build everything (typecheck first, then recursive build)
pnpm run build
```

Per-package commands:

```bash
# API server dev (builds then starts with source maps)
pnpm --filter @workspace/api-server run dev

# API server build (custom esbuild script → dist/index.mjs)
pnpm --filter @workspace/api-server run build

# Ritual Terminal dev server
pnpm --filter @workspace/ritual-terminal run dev

# Ritual Terminal production build
pnpm --filter @workspace/ritual-terminal run build

# Mockup Sandbox dev
pnpm --filter @workspace/mockup-sandbox run dev

# DB schema push (requires DATABASE_URL)
pnpm --filter @workspace/db run push

# Force DB schema push
pnpm --filter @workspace/db run push-force

# API codegen (regenerates api-client-react and api-zod from openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Run a utility script
pnpm --filter @workspace/scripts run hello
```

> **Note:** There are no test suites, test runners, or testing frameworks in the project at this time.

## Code Organization

### TypeScript Project References

Shared libraries (`lib/*`) are compiled via TypeScript project references (`composite: true`, `emitDeclarationOnly: true`). The root `tsconfig.json` references `lib/db`, `lib/api-client-react`, and `lib/api-zod`.

Artifacts that depend on libraries reference them in their own `tsconfig.json` under `references`.

### Path Aliases

Frontend apps use Vite path aliases:

- `@/` → `src/`
- `@assets/` → `attached_assets/` (ritual-terminal only)

### Generated Code

Do **not** hand-edit files in these directories; they are produced by Orval:

- `lib/api-client-react/src/generated/`
- `lib/api-zod/src/generated/`

The OpenAPI spec title must remain `"Api"` (see `lib/api-spec/openapi.yaml`). Changing it will break import paths.

### Directory Conventions

- **`src/pages/`** — Top-level route pages (e.g., `Landing.tsx`, `Feed.tsx`)
- **`src/components/`** — UI components
- **`src/components/ui/`** — shadcn/ui primitive components (both apps)
- **`src/hooks/`** — Custom React hooks
- **`src/lib/`** — Utilities (`utils.ts`, `constants.ts`, etc.)
- **`src/store/`** — Zustand stores
- **`src/types/`** — Shared TypeScript types
- **`src/routes/`** — Express routers (api-server)
- **`public/`** — Static assets (fonts, images, opengraph)

### API Server Architecture

- Entry: `src/index.ts` — validates `PORT`, starts HTTP server
- App setup: `src/app.ts` — Express with Pino HTTP logging, CORS, JSON body parser, mounts routers at `/api`
- Routes: `src/routes/health.ts` (healthz endpoint), `src/routes/index.ts` (aggregator)
- Logger: `src/lib/logger.ts` — Pino with pretty transport in dev, redaction for auth/cookie headers
- Build: `build.mjs` — esbuild with ESM output, linked sourcemaps, `esbuild-plugin-pino`, and a CJS-compat banner

### Mockup Sandbox Architecture

- Custom Vite plugin (`mockupPreviewPlugin.ts`) discovers `.tsx` files under `src/components/mockups/` and generates a lazy-load manifest at `src/.generated/mockup-components.ts`
- Files/folders prefixed with `_` are ignored
- Routes at `/preview/ComponentName` render the discovered component dynamically

## Code Style Guidelines

- **ESM everywhere** — no CommonJS output
- `tsconfig.base.json` enforces:
  - `strictNullChecks: true`
  - `noImplicitAny: true`
  - `noImplicitReturns: true`
  - `useUnknownInCatchVariables: true`
  - `isolatedModules: true`
  - `moduleResolution: bundler`
  - `strictFunctionTypes: false` (deliberately relaxed)
- Import style: explicit type imports where possible (`import type { ... }`)
- Utility pattern: `cn(...)` from `clsx` + `tailwind-merge` is used for conditional Tailwind classes

## Environment Variables

| Variable | Required By | Purpose |
|----------|-------------|---------|
| `PORT` | api-server, ritual-terminal, mockup-sandbox | HTTP server port |
| `BASE_PATH` | ritual-terminal, mockup-sandbox | Vite `base` path |
| `DATABASE_URL` | db, api-server | PostgreSQL connection string |
| `NODE_ENV` | api-server | Determines Pino pretty transport |
| `LOG_LEVEL` | api-server | Pino log level (default: `info`) |
| `REPL_ID` | ritual-terminal, mockup-sandbox | Triggers Replit-specific Vite plugins when present |

## API Codegen Workflow

1. Edit `lib/api-spec/openapi.yaml` to define or update endpoints/schemas.
2. Run `pnpm --filter @workspace/api-spec run codegen`.
3. Orval regenerates:
   - `lib/api-client-react/src/generated/` — React Query hooks
   - `lib/api-zod/src/generated/` — Zod schemas + TypeScript types
4. Run `pnpm -w run typecheck:libs` to verify.

The `lib/api-client-react/src/custom-fetch.ts` file provides a fetch wrapper with configurable `baseUrl` and bearer token injection via `setBaseUrl()` and `setAuthTokenGetter()`.

## Database

- Dialect: PostgreSQL
- ORM: Drizzle ORM (`drizzle-orm`) with `drizzle-kit` for migrations/push
- Schema location: `lib/db/src/schema/index.ts`
- Pool + Drizzle client exported from `lib/db/src/index.ts`
- Convention: one file per table/model, each exporting the Drizzle table, an insert Zod schema, and inferred types (`InsertX`, `X`)

## Security Considerations

- **Supply-chain defense**: `pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (1 day). Do not disable this.
- **esbuild override**: pinned to `0.27.3` in `pnpm-workspace.yaml` overrides because `drizzle-kit` depends on an older vulnerable esbuild version.
- **Platform binary pruning**: many non-Linux esbuild/lightningcss/rollup/platform binaries are excluded via `overrides`.
- **Logger redaction**: Pino redacts `authorization`, `cookie`, and `set-cookie` headers.
- **Frozen lockfile**: `post-merge.sh` enforces `pnpm install --frozen-lockfile`.

## Deployment / Runtime Notes

- The API server bundle is a single ESM file at `dist/index.mjs` with inline sourcemaps.
- Ritual Terminal builds static files to `dist/public/`.
- `post-merge.sh` (git hook) runs `pnpm install --frozen-lockfile && pnpm --filter db push`.
- There is no containerization (Docker) or CI/CD configuration in the repo.

## Important Gotchas

- **ritual-terminal Tailwind**: Uses Tailwind v3 via `postcss.config.js` + `tailwind.config.js`. Do **not** add `css.postcss.plugins: []` to its `vite.config.ts` — this disables Tailwind entirely.
- **mockup-sandbox Tailwind**: Uses Tailwind v4 via `@tailwindcss/vite`. These two apps have different Tailwind setups; do not copy config between them blindly.
- **wouter**: Listed as a dependency in `ritual-terminal` but unused; routing is done with `react-router-dom`.
- **OpenAPI title**: Must stay `"Api"` or generated file names and imports break.
- **Custom fetch**: `lib/api-client-react/src/custom-fetch.ts` has a comment warning that `setAuthTokenGetter` should never be used in standard web apps that rely on session cookies.
