package config

import (
	"errors"

	"github.com/spf13/viper"
)

// Config holds all runtime configuration for the application.
type Config struct {
	Port           string
	DatabaseURL    string
	AllowedOrigins []string
	// ConfigFile is the path of the config file that was loaded, empty if none.
	ConfigFile string
}

// Load reads configuration from file (if found) and environment variables.
// Environment variables take precedence; all keys can be set via PROMPTHUB_<KEY>.
func Load(configPath string) (*Config, error) {
	v := viper.New()
	v.SetDefault("port", "8000")
	v.SetEnvPrefix("prompthub")
	v.AutomaticEnv()

	v.AddConfigPath(".")
	v.SetConfigName("prompthub")
	if configPath != "" {
		v.SetConfigFile(configPath)
	}

	if err := v.ReadInConfig(); err != nil {
		var notFound viper.ConfigFileNotFoundError
		if !errors.As(err, &notFound) {
			return nil, err
		}
	}

	return &Config{
		Port:           v.GetString("port"),
		DatabaseURL:    v.GetString("database_url"),
		AllowedOrigins: v.GetStringSlice("allowed_origins"),
		ConfigFile:     v.ConfigFileUsed(),
	}, nil
}
