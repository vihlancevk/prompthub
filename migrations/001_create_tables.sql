-- +goose Up
CREATE TABLE IF NOT EXISTS authors (
    id   SERIAL      PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS prompts (
    name        TEXT    NOT NULL,
    author_id   INTEGER NOT NULL REFERENCES authors(id),
    version     TEXT    NOT NULL,
    tags        TEXT[]  NOT NULL DEFAULT '{}',
    description TEXT    NOT NULL,
    text        TEXT    NOT NULL,
    card        TEXT,
    PRIMARY KEY (name, author_id)
);

CREATE TABLE IF NOT EXISTS skills (
    name        TEXT    NOT NULL,
    author_id   INTEGER NOT NULL REFERENCES authors(id),
    version     TEXT    NOT NULL,
    tags        TEXT[]  NOT NULL DEFAULT '{}',
    description TEXT    NOT NULL,
    text        TEXT    NOT NULL,
    card        TEXT,
    PRIMARY KEY (name, author_id)
);

-- +goose Down
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS prompts;
DROP TABLE IF EXISTS authors;
