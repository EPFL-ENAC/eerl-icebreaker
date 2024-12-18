from typing import List, Optional, Tuple
from pydantic import BaseModel
from enacit4r_files.models.files import FileRef


class Reference(BaseModel):
    citation: str
    title: Optional[str] = None
    doi: str


class Measures(BaseModel):
    name: str
    description: Optional[str] = None
    datasets: Optional[List[str]] = None


class Instrument(BaseModel):
    name: str
    description: Optional[str] = None
    measures: Optional[List[Measures]]


class TrackColumns(BaseModel):
    latitude: str
    longitude: str
    timestamp: Optional[str] = None


class Track(BaseModel):
    file: FileRef
    columns: TrackColumns
    color: Optional[str] = None
    timestamp_format: Optional[str]


class Funding(BaseModel):
    name: str
    grant: Optional[str] = None
    website: Optional[str] = None


class Campaign(BaseModel):
    id: Optional[int] = None
    name: str
    acronym: str
    website: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    objectives: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    platform: Optional[str] = None
    start_location: Tuple[float, float]
    end_location: Optional[Tuple[float, float]] = None
    images: Optional[List[FileRef]] = None
    track: Optional[Track] = None
    fundings: Optional[List[Funding]] = None
    references: Optional[List[Reference]] = None
    instruments: Optional[List[Instrument]] = None
    offsetX: Optional[float] = None
    offsetY: Optional[float] = None


class CampaignStore(BaseModel):
    campaigns: List[str]
