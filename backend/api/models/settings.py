from pydantic import BaseModel


class Settings(BaseModel):
    map_api_key: str
