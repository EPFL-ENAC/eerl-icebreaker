import os
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware


from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

from api.config import config
from api.cache import redis
from logging import basicConfig, INFO
from pydantic import BaseModel
from api.views.files import router as files_router
from api.views.campaigns import router as campaigns_router
from api.views.settings import router as settings_router

basicConfig(level=INFO)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    FastAPICache.init(RedisBackend(redis), prefix="ib-cache")
    yield

app = FastAPI(root_path=config.PATH_PREFIX, lifespan=lifespan)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthCheck(BaseModel):
    """Response model to validate and return when performing a health check."""
    status: str = "OK"


@app.get(
    "/healthz",
    tags=["Healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
async def get_health(
) -> HealthCheck:
    return HealthCheck(status="OK")

app.include_router(
    files_router,
    prefix="/files",
    tags=["Files"],
)

app.include_router(
    campaigns_router,
    prefix="/catalog",
    tags=["Catalog"],
)

app.include_router(
    settings_router,
    prefix="/settings",
    tags=["Settings"],
)
