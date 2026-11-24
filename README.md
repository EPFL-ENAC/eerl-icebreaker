# EERL-ICEBREAKER

A map of polar campaigns.

## backend

Management of polar campaigns.

Connects to S3 (at EPFL) to store polar campaigns description and data files.

Connects to Keycloak (enac-it-sso2, realm EPFL_inside) to validate users authentication. The `icebreaker-admin` role is a client role of the API client.

## frontend

A web interface to visualize the map of polar campaigns.

Connects to the backend to retrieve polar campaigns description and data files.

Connects to Keycloak to authenticate users.
## Run locally

Requirements: Python 3.11 with uv, Node.js with npm, Docker with docker compose, make. On Linux, also install `libwebp-dev`.

1. Create the `.env` file and fill in the Keycloak, S3 and map credentials:

   ```
   cp .env.example .env
   ```

2. Install the backend and frontend dependencies:

   ```
   make install
   ```

3. Start Redis, the backend and the frontend:

   ```
   make run
   ```

   The API is served on http://localhost:8000 (Swagger docs at http://localhost:8000/docs). Ctrl+C stops the backend and the frontend; `make stop` stops Redis.

Run `make` to list all targets.
