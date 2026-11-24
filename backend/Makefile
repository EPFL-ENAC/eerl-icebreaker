env_path=../.env

install:
	uv sync

run:
	uv run dotenv -f "$(env_path)" run uvicorn api.main:app --reload

lint:
	uv run ruff check .
	uv run ruff format --check .

format:
	uv run ruff check --fix .
	uv run ruff format .

redis-up:
	docker compose up -d redis

redis-stop:
	docker compose stop redis

redis-down:
	docker compose down redis
