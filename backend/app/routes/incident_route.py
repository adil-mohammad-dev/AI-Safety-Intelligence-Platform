from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user_model import User
from app.models.incident_model import Incident
from app.schemas.incident_schema import IncidentCreate, IncidentResponse


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


@router.post("/", response_model=IncidentResponse)
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_incident = Incident(
        video_id=incident.video_id,
        user_id=current_user.id,
        incident_type=incident.incident_type,
        severity=incident.severity,
        description=incident.description,
        frame_timestamp=incident.frame_timestamp,
        confidence_score=incident.confidence_score,
        status="open"
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident


@router.get("/", response_model=List[IncidentResponse])
def get_my_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incidents = db.query(Incident).filter(
        Incident.user_id == current_user.id
    ).order_by(Incident.created_at.desc()).all()

    return incidents

@router.patch("/{incident_id}/resolve", response_model=IncidentResponse)
def resolve_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(
        Incident.id == incident_id,
        Incident.user_id == current_user.id
    ).first()

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    incident.status = "resolved"

    db.commit()
    db.refresh(incident)

    return incident