package store

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ErrNotFound is returned when a requested record does not exist.
var ErrNotFound = errors.New("not found")

// Store wraps a pgxpool connection and exposes prompt queries.
type Store struct {
	pool *pgxpool.Pool
}

// Close releases all connections held by the pool.
func (s *Store) Close() {
	s.pool.Close()
}

// New opens a connection pool, verifies connectivity, and returns a Store.
func New(ctx context.Context, dsn string) (*Store, error) {
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		return nil, err
	}
	return &Store{pool: pool}, nil
}

// GetPrompts returns all prompts. Returns an error on any DB failure.
func (s *Store) GetPrompts(ctx context.Context) ([]*Prompt, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT name, text, description, tags, meta, version FROM prompts`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*Prompt
	for rows.Next() {
		var p Prompt
		var metaBytes []byte
		if err := rows.Scan(&p.Name, &p.Text, &p.Description, &p.Tags, &metaBytes, &p.Version); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(metaBytes, &p.Meta); err != nil {
			return nil, err
		}
		result = append(result, &p)
	}
	return result, rows.Err()
}

// GetPrompt returns a single prompt by name, or ErrNotFound if it doesn't exist.
func (s *Store) GetPrompt(ctx context.Context, name string) (*Prompt, error) {
	row := s.pool.QueryRow(ctx,
		`SELECT name, text, description, tags, meta, version FROM prompts WHERE name=$1`, name)

	var p Prompt
	var metaBytes []byte
	if err := row.Scan(&p.Name, &p.Text, &p.Description, &p.Tags, &metaBytes, &p.Version); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	if err := json.Unmarshal(metaBytes, &p.Meta); err != nil {
		return nil, err
	}
	return &p, nil
}

// GetCard returns the markdown card for a prompt.
// Returns ErrNotFound if the prompt does not exist.
// Returns ("", nil) if the prompt exists but has no card (card is optional).
func (s *Store) GetCard(ctx context.Context, name string) (string, error) {
	row := s.pool.QueryRow(ctx,
		`SELECT card FROM prompts WHERE name=$1`, name)

	var card *string
	if err := row.Scan(&card); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrNotFound
		}
		return "", err
	}
	if card == nil {
		return "", nil
	}
	return *card, nil
}
