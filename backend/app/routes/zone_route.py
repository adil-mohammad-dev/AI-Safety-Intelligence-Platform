from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_roles
from app.models.user_model import User
from app.models.zone_model import RestrictedZone
from app.schemas.zone_schema import ZoneCreate, ZoneResponse


router = APIRouter(
    prefix="/zones",
    tags=["Restricted Zones"]
)


@router.post("/", response_model=ZoneResponse)
def create_zone(
    zone: ZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "safety_officer"]))
):
    # deactivate previous zones for this user
    db.query(RestrictedZone).filter(
        RestrictedZone.user_id == current_user.id
    ).update({"is_active": False})

    new_zone = RestrictedZone(
        name=zone.name,
        x=zone.x,
        y=zone.y,
        width=zone.width,
        height=zone.height,
        is_active=True,
        user_id=current_user.id
    )

    db.add(new_zone)
    db.commit()
    db.refresh(new_zone)

    return new_zone


@router.get("/", response_model=List[ZoneResponse])
def get_my_zones(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    zones = db.query(RestrictedZone).filter(
        RestrictedZone.user_id == current_user.id
    ).order_by(RestrictedZone.created_at.desc()).all()

    return zones


@router.get("/active", response_model=ZoneResponse)
def get_active_zone(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    zone = db.query(RestrictedZone).filter(
        RestrictedZone.user_id == current_user.id,
        RestrictedZone.is_active == True
    ).order_by(RestrictedZone.created_at.desc()).first()

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="No active restricted zone found"
        )

    return zone