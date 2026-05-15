from datetime import datetime
from pydantic import BaseModel


class VideoResponse(BaseModel):
    id: int
    file_name: str
    file_path: str
    status: str
    user_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True