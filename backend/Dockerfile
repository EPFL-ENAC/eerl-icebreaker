FROM python:3.11-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.9 /uv /bin/uv
ENV PYTHONPATH="$PYTHONPATH:/app" \
    UV_PROJECT_ENVIRONMENT=/usr/local \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

COPY uv.lock pyproject.toml /app/
RUN uv sync --locked --no-dev --no-install-project

COPY start.sh /app/
COPY api /app/api

ENTRYPOINT sh start.sh
