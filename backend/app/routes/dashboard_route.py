from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.dependencies import get_db, get_current_user
from app.models.user_model import User
from app.models.video_model import Video
from app.models.incident_model import Incident


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_videos = db.query(Video).filter(
        Video.user_id == current_user.id
    ).count()

    completed_analyses = db.query(Video).filter(
        Video.user_id == current_user.id,
        Video.status == "completed"
    ).count()

    total_incidents = db.query(Incident).filter(
        Incident.user_id == current_user.id
    ).count()

    high_severity_incidents = db.query(Incident).filter(
        Incident.user_id == current_user.id,
        Incident.severity == "high"
    ).count()

    open_incidents = db.query(Incident).filter(
        Incident.user_id == current_user.id,
        Incident.status == "open"
    ).count()

    return {
        "total_videos": total_videos,
        "completed_analyses": completed_analyses,
        "total_incidents": total_incidents,
        "high_severity_incidents": high_severity_incidents,
        "open_incidents": open_incidents
    }

@router.get("/recent-incidents")
def get_recent_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incidents = db.query(Incident).filter(
        Incident.user_id == current_user.id
    ).order_by(Incident.created_at.desc()).limit(5).all()

    return [
        {
            "id": incident.id,
            "incident_type": incident.incident_type,
            "severity": incident.severity,
            "status": incident.status,
            "description": incident.description,
            "created_at": incident.created_at
        }
        for incident in incidents
    ]

@router.get("/severity-breakdown")
def get_severity_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    low_count = db.query(Incident).filter(
        Incident.user_id == current_user.id,
        Incident.severity == "low"
    ).count()

    medium_count = db.query(Incident).filter(
        Incident.user_id == current_user.id,
        Incident.severity == "medium"
    ).count()

    high_count = db.query(Incident).filter(
        Incident.user_id == current_user.id,
        Incident.severity == "high"
    ).count()

    return {
        "low": low_count,
        "medium": medium_count,
        "high": high_count
    }

@router.get("/incident-trends")
def get_incident_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trends = db.query(
        func.date(Incident.created_at).label("date"),
        func.count(Incident.id).label("count")
    ).filter(
        Incident.user_id == current_user.id
    ).group_by(
        func.date(Incident.created_at)
    ).order_by(
        func.date(Incident.created_at)
    ).all()

    return [
        {
            "date": str(row.date),
            "count": row.count
        }
        for row in trends
    ]