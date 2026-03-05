# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromptHub is a full-stack application that serves a collection of ready-made NLP prompts. The backend is a Go HTTP API backed by PostgreSQL; the frontend is a React SPA.

## Commands

### Backend

```sh
make migrate-up     # Apply DB migrations (requires .env with DATABASE_* vars)
make migrate-down   # Rollback last migration
make build          # Compile Go binary → ./prompthub
make run            # Build + run server on :8000
make test           # Run all Go tests
make clean          # Remove binary and test cache
```

### Frontend

```sh
cd frontend
npm install         # Install deps
npm run dev         # Dev server on :3000 (proxies /api/* → http://localhost:8000/*)
npm run build       # Production build → frontend/dist/
npm run preview     # Preview production build
```

### Running both together

Run `make run` (backend on :8000) and `npm run dev` simultaneously — the Vite dev proxy handles CORS automatically. No need to configure CORS when using the dev proxy.

## Architecture

### Backend (Go)

Three internal packages under the module `rnditb2c/prompthub`:

- **`index/`** — Database layer. `index.Init()` opens a pgxpool connection stored in a package-level variable. `GetPrompts`, `GetPrompt`, `GetCard` are the only public query functions.
- **`api/`** — HTTP layer using chi router. `api.Serve()` wires up routes, middleware (CORS, body limit, content-type), and handles graceful shutdown on SIGINT.
- **`output/`** — Leveled logging (FATAL, ERROR, INFO, DEBUG) initialized by `output.Init(verbosity)`.

Config is managed by Viper, which reads `prompthub.yaml` and env vars prefixed with `PROMPTHUB_`. The database URL is passed via `PROMPTHUB_DATABASE_URL` or built from `.env` vars by the Makefile.

### API Routes

| Method | Path | Handler |
|--------|------|---------|
| GET | `/prompts` | `ListPrompts` — returns all prompts as JSON array |
| GET | `/prompts/{name}` | `GetPrompt` — returns single prompt by name |
| GET | `/cards/{name}` | `GetCard` — returns prompt card as plain text |

Prompt names can contain slashes (e.g., `rnditb2c/idea-generator`); routing uses chi's wildcard `/*`.

### Frontend (React + TypeScript)

Single-page app in `frontend/src/`:

- **`App.tsx`** — Root component. Manages all state: fetched prompts, search text, active tag filter, selected prompt, and theme (dark/light, persisted in localStorage).
- **`api.ts`** — Fetches from `/api/prompts` using relative URLs.
- **`types.ts`** — `Prompt` interface matching the backend JSON shape.
- **`components/`** — `Header`, `PromptCard`, `PromptDetail`, `TagBadge`.

### Database Schema

Defined in `migrations/001_create_table.sql`. Managed by [Goose](https://github.com/pressly/goose).

```sql
CREATE TABLE prompts (
    name        TEXT PRIMARY KEY,  -- e.g., "org/prompt-name"
    text        TEXT NOT NULL,
    description TEXT NOT NULL,
    tags        TEXT[] NOT NULL DEFAULT '{}',
    meta        JSONB NOT NULL DEFAULT '{}',  -- e.g., {"authors": [...]}
    version     TEXT NOT NULL,
    card        TEXT
);
```

### Configuration

`prompthub.yaml` (copy from `prompthub.yaml.example`):
- `port` — HTTP listen port (default: `"8000"`)
- `allowed_origins` — CORS allowed origins list

`.env` (copy from `.env.example`) — PostgreSQL credentials used by the Makefile to construct `DATABASE_URL`.

All config keys can be overridden with `PROMPTHUB_<KEY>` environment variables.
