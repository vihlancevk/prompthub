# PromptHub

PromptHub serves a collection of ready-made prompts and skills for the most common NLP tasks.

## Data format

Defined in `migrations/001_create_tables.sql`. Each record belongs to an author and is uniquely identified by the `(name, author_id)` pair.

```sql
authors (id, name)
prompts (name, author_id, version, tags, description, text, card)
skills  (name, author_id, version, tags, description, text, card)
```

## PromptHub API

### Prompts

#### Get all prompts

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

#### Get a specific prompt

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

#### Create a prompt

`POST /prompts`

Request body (JSON): `name`, `author_name`, `text`, `version` required; `tags`, `description`, `card` optional.

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

#### Get a prompt card

`GET /cards/{author}/{name}`

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

<markdown content>
```

### Skills

#### Get all skills

`GET /skills`

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

#### Get a specific skill

`GET /skills/{author}/{name}`

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

#### Create a skill

`POST /skills`

Request body (JSON): `name`, `author_name`, `text`, `version` required; `tags`, `description`, `card` optional.

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
```

#### Get a skill card

`GET /skill-cards/{author}/{name}`

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

React 18 + TypeScript + Vite + Tailwind CSS + React Router v6. Source in `frontend/`.

Three pages:
- `/` — Welcome page with navigation to Prompts and Skills
- `/prompts` — Browse, search, filter, and create prompts
- `/skills` — Browse, search, filter, and create skills

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

#### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8000` | Proxy target for `/api/*` requests during development |
| `VITE_API_BASE_URL` | `/api` | API base URL used by the browser-side HTTP client |
