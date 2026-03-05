package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"rnditb2c/prompthub/index"
	"rnditb2c/prompthub/output"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"github.com/spf13/viper"
)

// Serve starts the HTTP server and blocks
func Serve() {
	r := chi.NewRouter() // root router
	r.Use(render.SetContentType(render.ContentTypeJSON))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: viper.GetStringSlice("allowed_origins"),
	}))
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
			next.ServeHTTP(w, r)
		})
	})
	output.DEBUG.Printf("AllowedOrigins set to: %s", viper.GetStringSlice("allowed_origins"))

	promptsRouter := chi.NewRouter()
	promptsRouter.Get("/", ListPrompts)
	promptsRouter.Get("/*", GetPrompt)

	r.Mount("/prompts", promptsRouter)

	promptCardRouter := chi.NewRouter()
	promptCardRouter.Get("/*", GetCard)

	r.Mount("/cards", promptCardRouter)

	// Start the HTTP server
	srv := &http.Server{
		Addr: fmt.Sprintf("0.0.0.0:%s", viper.GetString("port")),
		// Set timeouts to avoid Slowloris attacks.
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r,
	}

	// Run our server in a goroutine so that it doesn't block.
	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			output.FATAL.Println(err)
			os.Exit(1)
		}
	}()

	output.INFO.Println("Prompthub running at", srv.Addr)

	c := make(chan os.Signal, 1)
	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	// SIGKILL, SIGQUIT or SIGTERM (Ctrl+/) will not be caught.
	signal.Notify(c, os.Interrupt)

	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	if err := srv.Shutdown(ctx); err != nil {
		output.ERROR.Println("shutdown error:", err)
	}
	output.INFO.Println("shutting down")
}

func ListPrompts(w http.ResponseWriter, r *http.Request) {
	prompts := index.GetPrompts(r.Context())
	if err := render.RenderList(w, r, NewPromptListResponse(prompts)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}

func NewPromptListResponse(prompts []*index.Prompt) []render.Renderer {
	list := []render.Renderer{}
	for _, prompt := range prompts {
		list = append(list, NewPromptResponse(prompt))
	}
	return list
}

func GetPrompt(w http.ResponseWriter, r *http.Request) {
	promptName := chi.URLParam(r, "*")
	prompt, err := index.GetPrompt(r.Context(), promptName)
	if err != nil {
		render.Render(w, r, ErrNotFound)
		return
	}

	if err := render.Render(w, r, NewPromptResponse(prompt)); err != nil {
		render.Render(w, r, ErrRender(err))
		return
	}
}

func GetCard(w http.ResponseWriter, r *http.Request) {
	promptName := chi.URLParam(r, "*")
	card, err := index.GetCard(r.Context(), promptName)
	if err != nil {
		render.Render(w, r, ErrNotFound)
		return
	}
	render.PlainText(w, r, card)
}
