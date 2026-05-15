from datetime import datetime
from pydantic import BaseModel


class IncidentCreate(BaseModel):
    video_id: int
    incident_type: str
    severity: str
    description: str
    frame_timestamp: float
    confidence_score: float


class IncidentResponse(BaseModel):
    id: int
    video_id: int
    user_id: int
    incident_type: str
    severity: str
    description: str
    frame_timestamp: float
    confidence_score: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True