# PromptHub

PromptHub serves a collection of ready-made prompts for the most common NLP tasks.

## Prompt format

A prompt format is defined in the migrations/001_create_table.sql file.

## PromptHub API

### Get all the prompts

`GET /prompts`

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: <...>
Content-Length: <...>

[
  {
    "name": "<...>",
    "tags": ["<...>"],
    "meta": {
      "authors": ["<...>", "<...>"]
    },
    "version": "<...>",
    "text": "<...>",
    "description": "<...>"
  }
]
```

### Get a specific prompt by name

`GET /prompts/{name}`

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: <...>
Content-Length: <...>

{
  "name": "<...>",
  "tags": ["<...>"],
  "meta": {
    "authors": ["<...>"]
  },
  "version": "<...>",
  "text": "<...>",
  "description": "<...>"
}
```

### Get a prompt card by name

`GET /cards/{name}`

Response:

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Vary: Origin
Date: <...>
Content-Length: <...>

<...>
```

## Development

### Backend

Requires a recent version of [Go](https://go.dev) (1.25+) and a running PostgreSQL database.

```sh
# Migrate db
make migrate-up

# Build
make build

# Start the HTTP server (default: port 8000)
make run

# Run tests
make test
```

### Frontend

React 18 + TypeScript + Vite + Tailwind CSS. Source in `frontend/`.

```sh
cd frontend

# Install dependencies
npm install

# Dev server (http://localhost:3000, proxies /api/* → http://localhost:8000/*)
npm run dev

# Production build (output: frontend/dist/)
npm run build
```

Run `make run` (backend on :8000) and `npm run dev` simultaneously — the Vite dev proxy handles CORS automatically.
