from typing import List
from fastapi import APIRouter, Depends, Body
from fastapi.responses import FileResponse
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File
from api.services.campaigns import CampaignsService
from api.models.campaigns import Campaign
from api.utils.file_size import size_checker
from api.auth import require_admin, User

router = APIRouter()


@router.get("/campaigns", response_model=List[Campaign])
async def get_study_drafts(
    #user: User = Depends(require_admin),
) -> List[Campaign]:
    """Get all campaigns"""
    service = CampaignsService()
    return await service.list()
    