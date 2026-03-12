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

- **`internal/config/`** — `config.Load()` reads `prompthub.yaml` and env vars (prefix `PROMPTHUB_`) via Viper. Returns a typed `Config` struct. A missing config file is not fatal; env vars and defaults suffice. Returns an error if a config file is found but cannot be parsed.
- **`internal/store/`** — Database layer. `store.New()` opens a pgxpool connection. Methods: `GetPrompts`, `GetPrompt`, `GetCard`, `CreatePrompt`. `Close()` releases the pool. Returns `store.ErrNotFound` when a record is absent. `GetCard` returns `("", nil)` when the prompt exists but has no card.
- **`internal/api/`** — HTTP layer. `Server` struct holds `*store.Store` as a dependency (constructor injection via `api.NewServer`). Routes and middleware are in `server.go`; handlers are in `handlers.go`. Uses structured logging via `log/slog`. A `logRequest` middleware logs method, path, status, and duration for every request.

### API Routes

| Method | Path | Handler |
|--------|------|---------|
| GET | `/prompts` | `listPrompts` — returns all prompts as JSON array |
| POST | `/prompts` | `createPrompt` — creates a new prompt; requires `name`, `author_name`, `text`, `version` |
| GET | `/prompts/{author}/{name}` | `getPrompt` — returns single prompt by author and name |
| GET | `/cards/{author}/{name}` | `getCard` — returns prompt card as plain text |

CORS allows `GET` and `POST` with `Content-Type` header.

### Frontend (React + TypeScript)

Single-page app in `frontend/src/`:

- **`App.tsx`** — Root component. Manages all state: fetched prompts, search text, active tag filter, selected prompt, and theme (dark/light, persisted in localStorage).
- **`api.ts`** — Fetches from `/api/prompts` using relative URLs.
- **`types.ts`** — `Prompt` interface matching the backend JSON shape.
- **`components/`** — `Header`, `PromptCard`, `PromptDetail`, `TagBadge`, `CreatePromptModal`.

### Database Schema

Defined in `migrations/001_create_tables.sql`. Managed by [Goose](https://github.com/pressly/goose).

```sql
CREATE TABLE authors (
    id   SERIAL      PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE prompts (
    name        TEXT    NOT NULL,
    author_id   INTEGER NOT NULL REFERENCES authors(id),
    version     TEXT    NOT NULL,
    tags        TEXT[]  NOT NULL DEFAULT '{}',
    description TEXT    NOT NULL,
    text        TEXT    NOT NULL,
    card        TEXT,
    PRIMARY KEY (name, author_id)
);

CREATE TABLE skills (
    name        TEXT    NOT NULL,
    author_id   INTEGER NOT NULL REFERENCES authors(id),
    version     TEXT    NOT NULL,
    tags        TEXT[]  NOT NULL DEFAULT '{}',
    description TEXT    NOT NULL,
    text        TEXT    NOT NULL,
    card        TEXT,
    PRIMARY KEY (name, author_id)
);
```

Prompts and skills are uniquely identified by `(name, author_id)`. The API resolves author by name and returns `author_name` via JOIN.

### Configuration

`prompthub.yaml` (copy from `prompthub.yaml.example`):
- `port` — HTTP listen port (default: `"8000"`)
- `allowed_origins` — CORS allowed origins list
- `database_url` — PostgreSQL DSN

`.env` (copy from `.env.example`) — PostgreSQL credentials used by the Makefile to construct `DATABASE_URL`.

All config keys can be overridden with `PROMPTHUB_<KEY>` environment variables.

### Logging

Uses Go's standard `log/slog`. Verbosity is set via `-v` flag: `0` = errors only, `1` = info (default), `2` = debug.
