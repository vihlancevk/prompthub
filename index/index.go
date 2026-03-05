package index

import (
	"context"
	"encoding/json"
	"errors"
	"rnditb2c/prompthub/output"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var db *pgxpool.Pool

func Init(dsn string) error {
	pool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		return err
	}

	if err := pool.Ping(context.Background()); err != nil {
		return err
	}

	db = pool

	return err
}

func GetPrompts(ctx context.Context) []*Prompt {
	rows, err := db.Query(ctx,
		`SELECT name, text, description, tags, meta, version FROM prompts`)
	if err != nil {
		output.ERROR.Printf("Failed to get promtps: %s", err)
		return nil
	}
	defer rows.Close()

	var result []*Prompt
	for rows.Next() {
		var p Prompt
		var metaBytes []byte
		if err := rows.Scan(&p.Name, &p.Text, &p.Description, &p.Tags, &metaBytes, &p.Version); err != nil {
			continue
		}
		if err := json.Unmarshal(metaBytes, &p.Meta); err != nil {
			continue
		}
		result = append(result, &p)
	}
	return result
}

func GetPrompt(ctx context.Context, name string) (*Prompt, error) {
	row := db.QueryRow(ctx,
		`SELECT name, text, description, tags, meta, version FROM prompts WHERE name=$1`, name)

	var p Prompt
	var metaBytes []byte
	if err := row.Scan(&p.Name, &p.Text, &p.Description, &p.Tags, &metaBytes, &p.Version); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("not found")
		}
		return nil, err
	}
	if err := json.Unmarshal(metaBytes, &p.Meta); err != nil {
		return nil, err
	}
	return &p, nil
}

func GetCard(ctx context.Context, name string) (string, error) {
	row := db.QueryRow(ctx,
		`SELECT card FROM prompts WHERE name=$1`, name)

	var card *string
	if err := row.Scan(&card); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", errors.New("not found")
		}
		return "", err
	}
	if card == nil {
		return "", errors.New("not found")
	}
	return *card, nil
}
