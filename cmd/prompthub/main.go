package main

import (
	"context"
	"log/slog"
	"os"

	"rnditb2c/prompthub/internal/api"
	"rnditb2c/prompthub/internal/config"
	"rnditb2c/prompthub/internal/store"

	"github.com/spf13/pflag"
)

func main() {
	configPath := pflag.StringP("config", "c", "", "path to config file")
	verbosity := pflag.IntP("verbose", "v", 1, "verbosity: 0 errors only, 1 normal, 2 debug")
	pflag.Parse()

	setupSlog(verbosity)

	cfg, err := config.Load(*configPath)
	if err != nil {
		slog.Error("failed to load config", "err", err)
		os.Exit(1)
	}
	if cfg.ConfigFile != "" {
		slog.Debug("config loaded", "file", cfg.ConfigFile)
	} else {
		slog.Info("config file not found, using defaults and env vars")
	}

	st, err := store.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		slog.Error("failed to connect to database", "err", err)
		os.Exit(1)
	}

	defer st.Close()

	srv := api.NewServer(st, cfg.AllowedOrigins, cfg.Port)
	srv.Serve()
}

func setupSlog(verbosity *int) {
	level := slog.LevelInfo
	switch *verbosity {
	case 0:
		level = slog.LevelError
	case 2:
		level = slog.LevelDebug
	}
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: level})))
}
