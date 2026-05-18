from datetime import datetime
from pydantic import BaseModel


class ZoneCreate(BaseModel):
    name: str
    x: int
    y: int
    width: int
    height: int


class ZoneResponse(BaseModel):
    id: int
    name: str
    x: int
    y: int
    width: int
    height: int
    is_active: bool
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True