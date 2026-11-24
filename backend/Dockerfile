FROM python:3.11-bookworm
ENV POETRY_VERSION=2.4.1
RUN pip install "poetry==$POETRY_VERSION"
ENV PYTHONPATH="$PYTHONPATH:/app"

WORKDIR /app

COPY poetry.lock pyproject.toml /app/
RUN poetry config installer.max-workers 10
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

COPY start.sh /app/
COPY api /app/api

ENTRYPOINT sh start.sh