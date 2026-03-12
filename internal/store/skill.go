package store

import "net/http"

// Skill is the core data model returned by all skill queries.
type Skill struct {
	Name        string   `json:"name"`
	AuthorName  string   `json:"author_name"`
	Version     string   `json:"version"`
	Tags        []string `json:"tags,omitempty"`
	Description string   `json:"description"`
	Text        string   `json:"text"`
	Card        *string  `json:"card,omitempty"`
}

// Render implements render.Renderer so *Skill can be passed directly to chi/render.
func (s *Skill) Render(_ http.ResponseWriter, _ *http.Request) error { return nil }
