import os
import uuid
import json
import tempfile
import urllib.parse
from api.services.s3 import s3_client
from api.config import config
from api.models.campaigns import Campaign


class CampaignsService:
  
    async def list(self) -> list[Campaign]:
        """List all campaigns"""
        folder_path = "campaigns/"
        files = [file for file in await s3_client.list_files(folder_path) if file.endswith("/campaign.json")]

        campaigns = []
        for file in files:
            content, mime_type = await s3_client.get_file(file)
            campaign_dict = json.loads(content)
            campaign = Campaign(**campaign_dict)
            campaigns.append(campaign)

        return campaigns
  
    async def delete(self, identifier: str):
        exists = await self.exists(identifier)
        if not exists:
            raise Exception(
                f"Campaign with identifier {identifier} does not exist.")

        await s3_client.delete_files(f"campaigns/{identifier}")

    async def exists(self, identifier: str) -> bool:
        return await s3_client.path_exists(f"campaigns/{identifier}/campaign.json")
    
    async def createOrUpdate(self, campaign: Campaign) -> Campaign:
        if campaign.id is None or campaign.id == "" or campaign.id == "_draft":
            campaign.id = str(uuid.uuid4())

        # Destination folder in s3
        s3_folder = f"campaigns/{campaign.id}"

        # Move tmp files to their final location
        # Images
        if campaign.images is not None:
            for i, file in enumerate(campaign.images):
                if "/tmp/" in file.path:
                    new_name = f"{i + 1}-{file.name}"
                    file_path = f"{s3_folder}/{new_name}"
                    new_key = await s3_client.move_file(file.path, file_path)
                    file.name = new_name
                    file.path = urllib.parse.quote(new_key)
                    if file.alt_path is not None:
                        new_name = f"{i + 1}-{file.alt_name}"
                        new_key = await s3_client.move_file(file.alt_path, f"{s3_folder}/{new_name}")
                        file.alt_name = new_name
                        file.alt_path = urllib.parse.quote(new_key)
        # Track
        if campaign.track is not None and campaign.track.file is not None:
            if "/tmp/" in campaign.track.file.path:
                file_path = f"{s3_folder}/{campaign.track.file.name}"
                new_key = await s3_client.move_file(campaign.track.file.path, file_path)
                campaign.track.file.path = new_key

        # Create a temporary directory to dump JSON
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"Temporary directory created at: {temp_dir}")

            # Use the temporary directory for file operations
            temp_file_path = os.path.join(temp_dir, "campaign.json")

            # Convert SQLModel object to dictionary
            campaign_dict = campaign.model_dump()
            with open(temp_file_path, "w") as temp_file:
                json.dump(campaign_dict, temp_file, indent=2)
            await s3_client.upload_local_file(temp_dir, "campaign.json", s3_folder=s3_folder)

        return campaign


    async def get(self, identifier: str) -> Campaign:
        exists = await self.exists(identifier)
        if not exists:
            raise Exception(
                f"Campaign with identifier {identifier} does not exist.")

        file_path = f"campaigns/{identifier}/campaign.json"
        content, mime_type = await s3_client.get_file(file_path)
        campaign_dict = json.loads(content)
        return Campaign(**campaign_dict)
