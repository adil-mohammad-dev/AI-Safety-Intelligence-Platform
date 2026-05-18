import os
import shutil
from uuid import uuid4
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_roles
from app.models.user_model import User
from app.models.video_model import Video
from app.models.incident_model import Incident
from app.models.zone_model import RestrictedZone
from app.schemas.video_schema import VideoResponse
from app.services.zone_rule_service import evaluate_restricted_zone_violation
from app.services.video_analysis_service import (
    get_video_metadata,
    extract_sample_frames,
    detect_persons_in_frames
)
from app.services.yolo_service import (
    detect_objects_in_image,
    detect_objects_in_frames
)


router = APIRouter(
    prefix="/videos",
    tags=["Videos"]
)


UPLOAD_DIR = "uploads/videos"


@router.post("/upload", response_model=VideoResponse)
def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "safety_officer"]))
):
    allowed_extensions = [".mp4", ".avi", ".mov", ".mkv"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only video files are allowed"
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    unique_file_name = str(uuid4()) + file_extension
    file_path = os.path.join(UPLOAD_DIR, unique_file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_video = Video(
        file_name=file.filename,
        file_path=file_path,
        user_id=current_user.id,
        status="uploaded"
    )

    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return new_video


@router.get("/", response_model=List[VideoResponse])
def get_my_videos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    videos = db.query(Video).filter(
        Video.user_id == current_user.id
    ).order_by(Video.uploaded_at.desc()).all()

    return videos


@router.post("/{video_id}/analyze")
def analyze_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "safety_officer"]))
):
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.user_id == current_user.id
    ).first()

    if not video:
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    video.status = "processing"
    db.commit()

    metadata = get_video_metadata(video.file_path)

    if not metadata["success"]:
        video.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=metadata["message"]
        )

    frames_result = extract_sample_frames(video.file_path)

    if not frames_result["success"]:
        video.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=frames_result["message"]
        )

    person_detection_result = detect_persons_in_frames(
        frames_result["frames"]
    )

    yolo_detection_result = detect_objects_in_frames(
        frames_result["frames"]
    )

    opencv_persons_detected = sum(
        detection["persons_detected"]
        for detection in person_detection_result["detections"]
    )

    yolo_persons_detected = 0

    for frame_result in yolo_detection_result["results"]:
        for detection in frame_result["detections"]:
            if detection["class_name"] == "person":
                yolo_persons_detected += 1

    final_persons_detected = max(
        opencv_persons_detected,
        yolo_persons_detected
    )

    active_zone = db.query(RestrictedZone).filter(
        RestrictedZone.user_id == current_user.id,
        RestrictedZone.is_active == True
    ).order_by(RestrictedZone.created_at.desc()).first()

    if active_zone:
        restricted_zone = {
            "id": active_zone.id,
            "name": active_zone.name,
            "x": active_zone.x,
            "y": active_zone.y,
            "width": active_zone.width,
            "height": active_zone.height
        }
    else:
        restricted_zone = None

    zone_result = evaluate_restricted_zone_violation(
        yolo_detection_result,
        opencv_persons_detected,
        restricted_zone
    )

    created_incident = None

    if zone_result["violation_detected"]:
        created_incident = Incident(
            video_id=video.id,
            user_id=current_user.id,
            incident_type="restricted_zone_violation",
            severity="high",
            description="Person detected inside a monitored restricted workplace zone.",
            frame_timestamp=0,
            confidence_score=0.80,
            status="open"
        )

        db.add(created_incident)

    video.status = "completed"
    db.commit()

    if created_incident:
        db.refresh(created_incident)

    db.refresh(video)

    return {
        "message": "Video analysis completed successfully",
        "video_id": video.id,
        "video_status": video.status,
        "video_metadata": metadata,
        "frame_analysis": frames_result,
        "person_detection": person_detection_result,
        "yolo_detection": yolo_detection_result,
        "summary": {
            "detection_engine": {
                "primary": "YOLOv3-Tiny",
                "fallback": "OpenCV HOG Person Detector",
                "yolo_persons_detected": yolo_persons_detected,
                "opencv_persons_detected": opencv_persons_detected,
                "final_persons_detected": final_persons_detected
            },
            "zone_rule_engine": zone_result,
            "restricted_zone_violation": zone_result["violation_detected"],
            "incident_created": zone_result["violation_detected"]
        },
        "incident": {
            "id": created_incident.id,
            "incident_type": created_incident.incident_type,
            "severity": created_incident.severity,
            "description": created_incident.description,
            "confidence_score": created_incident.confidence_score
        } if created_incident else None
    }


@router.get("/test-yolo")
def test_yolo_on_frame():
    test_image_path = "uploads/frames/8861ee4a-947-4637-8fb4-68c6ab7d878e.jpg"

    result = detect_objects_in_image(test_image_path)

    return result