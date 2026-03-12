# PromptHub

PromptHub serves a collection of ready-made prompts for the most common NLP tasks.

## Prompt format

Defined in `migrations/001_create_tables.sql`. Each prompt belongs to an author and is uniquely identified by the `(name, author_id)` pair.

```sql
authors (id, name)
prompts (name, author_id, version, tags, description, text, card)
skills  (name, author_id, version, tags, description, text, card)
```

## PromptHub API

### Get all prompts

`GET /prompts`

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "name": "<...>",
    "author_name": "<...>",
    "version": "<...>",
    "tags": ["<...>"],
    "description": "<...>",
    "text": "<...>"
  }
]
```

### Get a specific prompt

`GET /prompts/{author}/{name}`

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "name": "<...>",
  "author_name": "<...>",
  "version": "<...>",
  "tags": ["<...>"],
  "description": "<...>",
  "text": "<...>"
}
```

### Create a prompt

`POST /prompts`

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

### Get a prompt card

`GET /cards/{author}/{name}`

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

<markdown content>
```

## Development

### Backend

Requires a recent version of [Go](https://go.dev) (1.25+) and a running PostgreSQL database.

```sh
# Apply DB migrations
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
