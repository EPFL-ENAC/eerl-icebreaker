.PHONY: help install install-backend install-frontend run run-backend run-frontend stop

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-18s %s\n", $$1, $$2}'

install: install-backend install-frontend ## Install backend and frontend dependencies

install-backend: ## Install backend dependencies (uv)
	$(MAKE) -C backend install

install-frontend: ## Install frontend dependencies (npm)
	cd frontend && npm install

run: ## Run redis, backend and frontend together (Ctrl+C stops both apps)
	$(MAKE) -C backend redis-up
	$(MAKE) -j2 run-backend run-frontend

run-backend: ## Run the backend API on http://localhost:8000 (reads .env)
	$(MAKE) -C backend run

run-frontend: ## Run the frontend dev server
	cd frontend && npm run dev

stop: ## Stop the redis container
	$(MAKE) -C backend redis-stop
