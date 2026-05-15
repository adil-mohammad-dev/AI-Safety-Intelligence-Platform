from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.core.database import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    status = Column(String(50), default="uploaded")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    uploaded_at = Column(DateTime, default=datetime.utcnow)