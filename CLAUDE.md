# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromptHub is a full-stack application that serves a collection of ready-made NLP prompts. The backend is a Go HTTP API backed by PostgreSQL; the frontend is a React SPA.

## Commands

### Backend

```sh
make migrate-up     # Apply DB migrations (requires .env with DATABASE_* vars)
make migrate-down   # Rollback last migration
make build          # Compile Go binary → ./prompthub (entry: cmd/prompthub/main.go)
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

Entry point: `cmd/prompthub/main.go`. Three internal packages under `internal/`:

- **`internal/config/`** — `config.Load()` reads `prompthub.yaml` and env vars (prefix `PROMPTHUB_`) via Viper. Returns a typed `Config` struct. A missing config file is not fatal; env vars and defaults suffice.
- **`internal/store/`** — Database layer. `store.New()` opens a pgxpool connection. Methods: `GetPrompts`, `GetPrompt`, `GetCard`. Returns `store.ErrNotFound` when a record is absent.
- **`internal/api/`** — HTTP layer. `Server` struct holds `*store.Store` as a dependency (constructor injection via `api.NewServer`). Routes and middleware are in `server.go`; handlers are in `handlers.go`. Uses structured logging via `log/slog`.

### API Routes

| Method | Path | Handler |
|--------|------|---------|
| GET | `/prompts` | `listPrompts` — returns all prompts as JSON array |
| GET | `/prompts/{name}` | `getPrompt` — returns single prompt by name |
| GET | `/cards/{name}` | `getCard` — returns prompt card as plain text |

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
- `database_url` — PostgreSQL DSN

`.env` (copy from `.env.example`) — PostgreSQL credentials used by the Makefile to construct `DATABASE_URL`.

All config keys can be overridden with `PROMPTHUB_<KEY>` environment variables.

### Logging

Uses Go's standard `log/slog`. Verbosity is set via `-v` flag: `0` = errors only, `1` = info (default), `2` = debug.
