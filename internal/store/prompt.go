package store

// Prompt is the core data model returned by all prompt queries.
type Prompt struct {
	Name        string         `json:"name"`
	Tags        []string       `json:"tags,omitempty"`
	Meta        map[string]any `json:"meta,omitempty"`
	Version     string         `json:"version"`
	Text        string         `json:"text"`
	Description string         `json:"description"`
}
