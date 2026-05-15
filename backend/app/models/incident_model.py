from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from datetime import datetime

from app.core.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    incident_type = Column(String(100), nullable=False)
    severity = Column(String(50), default="low")

    description = Column(Text, nullable=False)
    frame_timestamp = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)

    status = Column(String(50), default="open")

    created_at = Column(DateTime, default=datetime.utcnow)