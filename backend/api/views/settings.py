from fastapi import APIRouter
from api.config import config
from api.models.settings import Settings

router = APIRouter()


@router.get("", response_model=Settings)
async def get_settings(
    # user: User = Depends(require_admin),
) -> Settings:
    """Get the public app settings"""
    return Settings(map_api_key=config.MAP_API_KEY)
