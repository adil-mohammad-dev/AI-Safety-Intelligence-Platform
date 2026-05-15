from datetime import datetime
from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: int
    incident_id: int
    user_id: int
    ai_summary: str
    risk_analysis: str
    recommended_action: str
    created_at: datetime

    class Config:
        from_attributes = True