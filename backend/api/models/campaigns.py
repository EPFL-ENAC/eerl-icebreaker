from enacit4r_files.models.files import FileRef
from pydantic import BaseModel


class Reference(BaseModel):
    citation: str
    title: str | None = None
    doi: str


class Measures(BaseModel):
    name: str
    description: str | None = None
    datasets: list[str] | None = None


class Instrument(BaseModel):
    name: str
    description: str | None = None
    measures: list[Measures] | None


class TrackColumns(BaseModel):
    latitude: str
    longitude: str
    timestamp: str | None = None


class Track(BaseModel):
    file: FileRef
    columns: TrackColumns
    color: str | None = None
    timestamp_format: str | None


class Funding(BaseModel):
    name: str
    grant: str | None = None
    website: str | None = None


class Campaign(BaseModel):
    id: int | None = None
    name: str
    acronym: str
    website: str | None = None
    type: str | None = None
    color: str | None = None
    objectives: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    location: str | None = None
    platform: str | None = None
    start_location: tuple[float, float]
    end_location: tuple[float, float] | None = None
    images: list[FileRef] | None = None
    track: Track | None = None
    fundings: list[Funding] | None = None
    references: list[Reference] | None = None
    instruments: list[Instrument] | None = None
    offsetX: float | None = None
    offsetY: float | None = None


class CampaignStore(BaseModel):
    campaigns: list[str]
