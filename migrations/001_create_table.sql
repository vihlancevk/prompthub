-- +goose Up
CREATE TABLE IF NOT EXISTS prompts (
    name        TEXT PRIMARY KEY,
    text        TEXT NOT NULL,
    description TEXT NOT NULL,
    tags        TEXT[] NOT NULL DEFAULT '{}',
    meta        JSONB NOT NULL DEFAULT '{}',
    version     TEXT NOT NULL,
    card        TEXT
);

-- +goose Down
DROP TABLE IF EXISTS prompts;