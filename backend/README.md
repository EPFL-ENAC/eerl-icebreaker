# FastAPI
Based loosely on https://github.com/gauravgola96/FastAPI-Example

## Requirements
- python 3.11
- [uv](https://docs.astral.sh/uv/)
- Make
- Docker with docker compose
- OS:
  - Windows: docker desktop with wsl
  - Apple: with docker desktop dependencies installed via brew
  - Linux: libwebp-dev

## How to run
API for uploading object(.png|.jpg) to S3 bucket asynchronously
-> convert png or jpg to webp files

Create a `.env` file at the repo root and fill in the Keycloak, S3 and map credentials:
```
cp ../.env.example ../.env
```


Run Locally
```
make install; make run
```

Lint and format (ruff)
```
make lint    # check
make format  # fix
```

Swagger docs
```
http://localhost:8000/docs
```

To provide .env use Dockerfile.
```
Path : ./Dockerfile
```

## Install
Don't forget to install libwebp-dev on the machine (cf Dockerfile)
