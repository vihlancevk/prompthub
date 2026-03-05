-include .env

DATABASE_URL := postgres://$(DATABASE_USER):$(DATABASE_PASSWORD)@$(DATABASE_IP):$(DATABASE_PORT)/$(DATABASE_NAME)
GOOSE_MIGRATION_DIR := ./migrations

.PHONY: all setup-migrate migrate-up migrate-down build run test clean

all: build

setup-migrate:
	@which goose > /dev/null || go install github.com/pressly/goose/v3/cmd/goose@latest

migrate-up: setup-migrate
	GOOSE_DRIVER=postgres GOOSE_DBSTRING=$(DATABASE_URL) GOOSE_MIGRATION_DIR=$(GOOSE_MIGRATION_DIR) goose up

migrate-down: setup-migrate
	GOOSE_DRIVER=postgres GOOSE_DBSTRING=$(DATABASE_URL) GOOSE_MIGRATION_DIR=$(GOOSE_MIGRATION_DIR) goose down

build:
	go build -v -o prompthub ./

run: build
	PGUSER=$(DATABASE_USER) PGPASSWORD=$(DATABASE_PASSWORD) PROMPTHUB_DATABASE_URL=$(DATABASE_URL) ./prompthub -v 2

test:
	go test -v ./...

clean:
	rm -f prompthub
	go clean -testcache