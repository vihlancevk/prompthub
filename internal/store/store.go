package store

import (
	"context"
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
		`SELECT p.name, a.name, p.version, p.tags, p.description, p.text
		 FROM prompts p
		 JOIN authors a ON a.id = p.author_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*Prompt
	for rows.Next() {
		var p Prompt
		if err := rows.Scan(&p.Name, &p.AuthorName, &p.Version, &p.Tags, &p.Description, &p.Text); err != nil {
			return nil, err
		}
		result = append(result, &p)
	}
	return result, rows.Err()
}

// GetPrompt returns a single prompt by name, or ErrNotFound if it doesn't exist.
func (s *Store) GetPrompt(ctx context.Context, name string) (*Prompt, error) {
	row := s.pool.QueryRow(ctx,
		`SELECT p.name, a.name, p.version, p.tags, p.description, p.text
		 FROM prompts p
		 JOIN authors a ON a.id = p.author_id
		 WHERE p.name = $1`, name)

	var p Prompt
	if err := row.Scan(&p.Name, &p.AuthorName, &p.Version, &p.Tags, &p.Description, &p.Text); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &p, nil
}

// CreatePrompt inserts a new prompt. Returns an error if the name already exists
// or the author does not exist.
func (s *Store) CreatePrompt(ctx context.Context, p *Prompt) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO prompts (name, author_id, version, tags, description, text, card)
		 VALUES ($1, (SELECT id FROM authors WHERE name = $2), $3, $4, $5, $6, $7)`,
		p.Name, p.AuthorName, p.Version, p.Tags, p.Description, p.Text, p.Card)
	return err
}

// GetSkills returns all skills. Returns an error on any DB failure.
func (s *Store) GetSkills(ctx context.Context) ([]*Skill, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT sk.name, a.name, sk.version, sk.tags, sk.description, sk.text
		 FROM skills sk
		 JOIN authors a ON a.id = sk.author_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*Skill
	for rows.Next() {
		var sk Skill
		if err := rows.Scan(&sk.Name, &sk.AuthorName, &sk.Version, &sk.Tags, &sk.Description, &sk.Text); err != nil {
			return nil, err
		}
		result = append(result, &sk)
	}
	return result, rows.Err()
}

// GetSkill returns a single skill by name, or ErrNotFound if it doesn't exist.
func (s *Store) GetSkill(ctx context.Context, name string) (*Skill, error) {
	row := s.pool.QueryRow(ctx,
		`SELECT sk.name, a.name, sk.version, sk.tags, sk.description, sk.text
		 FROM skills sk
		 JOIN authors a ON a.id = sk.author_id
		 WHERE sk.name = $1`, name)

	var sk Skill
	if err := row.Scan(&sk.Name, &sk.AuthorName, &sk.Version, &sk.Tags, &sk.Description, &sk.Text); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &sk, nil
}

// CreateSkill inserts a new skill. Returns an error if the name already exists
// or the author does not exist.
func (s *Store) CreateSkill(ctx context.Context, sk *Skill) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO skills (name, author_id, version, tags, description, text, card)
		 VALUES ($1, (SELECT id FROM authors WHERE name = $2), $3, $4, $5, $6, $7)`,
		sk.Name, sk.AuthorName, sk.Version, sk.Tags, sk.Description, sk.Text, sk.Card)
	return err
}

// GetSkillCard returns the markdown card for a skill.
// Returns ErrNotFound if the skill does not exist.
// Returns ("", nil) if the skill exists but has no card (card is optional).
func (s *Store) GetSkillCard(ctx context.Context, name string) (string, error) {
	row := s.pool.QueryRow(ctx,
		`SELECT card FROM skills WHERE name=$1`, name)

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
