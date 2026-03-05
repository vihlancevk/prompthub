package api

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"rnditb2c/prompthub/internal/store"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
)

// Server holds the dependencies needed by HTTP handlers.
type Server struct {
	store          *store.Store
	allowedOrigins []string
	port           string
}

// NewServer constructs a Server with its dependencies.
func NewServer(st *store.Store, allowedOrigins []string, port string) *Server {
	return &Server{
		store:          st,
		allowedOrigins: allowedOrigins,
		port:           port,
	}
}

// statusWriter wraps http.ResponseWriter to capture the response status code.
type statusWriter struct {
	http.ResponseWriter
	status int
}

func (sw *statusWriter) WriteHeader(code int) {
	sw.status = code
	sw.ResponseWriter.WriteHeader(code)
}

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r)
		slog.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", sw.status,
			"duration", time.Since(start),
		)
	})
}

func (s *Server) routes() http.Handler {
	r := chi.NewRouter()
	r.Use(logRequest)
	r.Use(render.SetContentType(render.ContentTypeJSON))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: s.allowedOrigins,
		AllowedMethods: []string{"GET", "POST"},
		AllowedHeaders: []string{"Content-Type"},
	}))
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
			next.ServeHTTP(w, r)
		})
	})

	r.Route("/prompts", func(r chi.Router) {
		r.Get("/", s.listPrompts)
		r.Post("/", s.createPrompt)
		r.Get("/*", s.getPrompt)
	})
	r.Route("/cards", func(r chi.Router) {
		r.Get("/*", s.getCard)
	})

	return r
}

// Serve starts the HTTP server and blocks until SIGINT or SIGTERM is received.
func (s *Server) Serve() {
	srv := &http.Server{
		Addr:         fmt.Sprintf("0.0.0.0:%s", s.port),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  60 * time.Second,
		Handler:      s.routes(),
	}

	serveErr := make(chan error, 1)
	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serveErr <- err
		}
	}()

	slog.Info("prompthub running", "addr", srv.Addr)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serveErr:
		slog.Error("server error", "err", err)
	case <-quit:
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		slog.Error("shutdown error", "err", err)
	}
	slog.Info("shutting down")
}
