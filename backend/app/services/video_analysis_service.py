import os
import cv2
from uuid import uuid4


def get_video_metadata(video_path: str):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {
            "success": False,
            "message": "Unable to open video file"
        }

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    duration = 0

    if fps > 0:
        duration = total_frames / fps

    cap.release()

    return {
        "success": True,
        "total_frames": total_frames,
        "fps": fps,
        "duration_seconds": round(duration, 2),
        "width": width,
        "height": height
    }


def extract_sample_frames(video_path: str, frame_interval: int = 300):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {
            "success": False,
            "message": "Unable to open video file"
        }

    output_dir = "uploads/frames"
    os.makedirs(output_dir, exist_ok=True)

    frames_data = []
    frame_count = 0

    while True:
        success, frame = cap.read()

        if not success:
            break

        if frame_count % frame_interval == 0:
            timestamp_ms = cap.get(cv2.CAP_PROP_POS_MSEC)
            timestamp_seconds = round(timestamp_ms / 1000, 2)

            frame_file_name = str(uuid4()) + ".jpg"
            frame_path = os.path.join(output_dir, frame_file_name)

            cv2.imwrite(frame_path, frame)

            frames_data.append({
                "frame_number": frame_count,
                "timestamp_seconds": timestamp_seconds,
                "frame_path": frame_path
            })

        frame_count += 1

    cap.release()

    return {
        "success": True,
        "sampled_frames_count": len(frames_data),
        "frames": frames_data
    }

def detect_persons_in_frames(frames):
    hog = cv2.HOGDescriptor()
    hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    detection_results = []

    for frame_info in frames:
        frame_path = frame_info["frame_path"]

        image = cv2.imread(frame_path)

        if image is None:
            continue

        boxes, weights = hog.detectMultiScale(
            image,
            winStride=(8, 8),
            padding=(8, 8),
            scale=1.05
        )

        persons_count = len(boxes)

        detection_results.append({
            "frame_number": frame_info["frame_number"],
            "timestamp_seconds": frame_info["timestamp_seconds"],
            "frame_path": frame_path,
            "persons_detected": persons_count
        })

    return {
        "success": True,
        "total_frames_checked": len(frames),
        "detections": detection_results
    }