package api

import (
	"errors"
	"net/http"

	"rnditb2c/prompthub/internal/store"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

// promptResponse adapts *store.Prompt to the render.Renderer interface.
type promptResponse struct {
	*store.Prompt
}

func (p *promptResponse) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

func (s *Server) listPrompts(w http.ResponseWriter, r *http.Request) {
	prompts, err := s.store.GetPrompts(r.Context())
	if err != nil {
		render.Render(w, r, errInternal(err))
		return
	}

	list := make([]render.Renderer, len(prompts))
	for i, p := range prompts {
		list[i] = &promptResponse{p}
	}
	if err := render.RenderList(w, r, list); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) getPrompt(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "*")
	prompt, err := s.store.GetPrompt(r.Context(), name)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			render.Render(w, r, errNotFound)
		} else {
			render.Render(w, r, errInternal(err))
		}
		return
	}
	if err := render.Render(w, r, &promptResponse{prompt}); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) getCard(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "*")
	card, err := s.store.GetCard(r.Context(), name)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			render.Render(w, r, errNotFound)
		} else {
			render.Render(w, r, errInternal(err))
		}
		return
	}
	render.PlainText(w, r, card)
}
