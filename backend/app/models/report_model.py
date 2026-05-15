from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from datetime import datetime

from app.core.database import Base


class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    ai_summary = Column(Text, nullable=False)
    risk_analysis = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)