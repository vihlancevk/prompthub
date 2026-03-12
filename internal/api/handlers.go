package api

import (
	"errors"
	"net/http"
	"strings"

	"rnditb2c/prompthub/internal/store"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func (s *Server) listPrompts(w http.ResponseWriter, r *http.Request) {
	prompts, err := s.store.GetPrompts(r.Context())
	if err != nil {
		render.Render(w, r, errInternal(err))
		return
	}

	list := make([]render.Renderer, len(prompts))
	for i, p := range prompts {
		list[i] = p
	}
	if err := render.RenderList(w, r, list); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) createPrompt(w http.ResponseWriter, r *http.Request) {
	var p store.Prompt
	if err := render.DecodeJSON(r.Body, &p); err != nil {
		render.Render(w, r, errBadRequest(err))
		return
	}
	p.Name = strings.TrimSpace(p.Name)
	if p.Name == "" || p.Text == "" || p.Version == "" {
		render.Render(w, r, errBadRequest(errors.New("name, text, and version are required")))
		return
	}
	if err := s.store.CreatePrompt(r.Context(), &p); err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			render.Render(w, r, errConflict(errors.New("a prompt with this name already exists")))
		} else {
			render.Render(w, r, errInternal(err))
		}
		return
	}
	render.Status(r, http.StatusCreated)
	if err := render.Render(w, r, &p); err != nil {
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
	if err := render.Render(w, r, prompt); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) listSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := s.store.GetSkills(r.Context())
	if err != nil {
		render.Render(w, r, errInternal(err))
		return
	}

	list := make([]render.Renderer, len(skills))
	for i, sk := range skills {
		list[i] = sk
	}
	if err := render.RenderList(w, r, list); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) createSkill(w http.ResponseWriter, r *http.Request) {
	var sk store.Skill
	if err := render.DecodeJSON(r.Body, &sk); err != nil {
		render.Render(w, r, errBadRequest(err))
		return
	}
	sk.Name = strings.TrimSpace(sk.Name)
	if sk.Name == "" || sk.Text == "" || sk.Version == "" {
		render.Render(w, r, errBadRequest(errors.New("name, text, and version are required")))
		return
	}
	if err := s.store.CreateSkill(r.Context(), &sk); err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			render.Render(w, r, errConflict(errors.New("a skill with this name already exists")))
		} else {
			render.Render(w, r, errInternal(err))
		}
		return
	}
	render.Status(r, http.StatusCreated)
	if err := render.Render(w, r, &sk); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) getSkill(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "*")
	skill, err := s.store.GetSkill(r.Context(), name)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			render.Render(w, r, errNotFound)
		} else {
			render.Render(w, r, errInternal(err))
		}
		return
	}
	if err := render.Render(w, r, skill); err != nil {
		render.Render(w, r, errRender(err))
	}
}

func (s *Server) getSkillCard(w http.ResponseWriter, r *http.Request) {
	name := chi.URLParam(r, "*")
	card, err := s.store.GetSkillCard(r.Context(), name)
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
