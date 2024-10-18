from typing import List
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from api.services.campaigns import CampaignsService
from api.models.campaigns import Campaign
from api.auth import require_admin, User

router = APIRouter()


@router.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(
    #user: User = Depends(require_admin),
) -> List[Campaign]:
    """Get all campaigns"""
    service = CampaignsService()
    return await service.list()

@router.post("/campaigns", status_code=201, response_model=List[Campaign])
async def create_or_update_campaigns(
    campaigns: List[Campaign],
    user: User = Depends(require_admin),
):
    """Create or update campaigns, move temporary files to there final location"""
    service = CampaignsService()
    for campaign in campaigns:
        await service.createOrUpdate(campaign)
    return Response(status_code=201)

@router.get("/campaign/{identifier}", response_model=Campaign)
async def get_campaign(
    identifier: str,
    #user: User = Depends(require_admin),
) -> Campaign:
    """Get a campaign"""
    service = CampaignsService()
    return await service.get(identifier)

@router.delete("/campaign/{identifier}", response_model=List[Campaign])
async def delete_campaign(
    identifier: str,
    user: User = Depends(require_admin),
) -> List[Campaign]:
    """Delete a campaign and associated files"""
    service = CampaignsService()
    return await service.delete(identifier)

