package store

// Prompt is the core data model returned by all prompt queries.
type Prompt struct {
	Name        string   `json:"name"`
	AuthorName  string   `json:"author_name"`
	Version     string   `json:"version"`
	Tags        []string `json:"tags,omitempty"`
	Description string   `json:"description"`
	Text        string   `json:"text"`
	Card        *string  `json:"card,omitempty"`
}
