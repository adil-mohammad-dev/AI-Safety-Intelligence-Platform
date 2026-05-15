def is_point_inside_zone(point_x, point_y, zone):
    return (
        zone["x"] <= point_x <= zone["x"] + zone["width"]
        and zone["y"] <= point_y <= zone["y"] + zone["height"]
    )


def is_bbox_inside_zone(bbox, zone):
    center_x = bbox["x"] + bbox["width"] / 2
    center_y = bbox["y"] + bbox["height"] / 2

    return is_point_inside_zone(center_x, center_y, zone)


def evaluate_restricted_zone_violation(yolo_detection_result, fallback_person_count):
    restricted_zone = {
        "x": 500,
        "y": 150,
        "width": 500,
        "height": 450
    }

    zone_violations = []

    for frame_result in yolo_detection_result["results"]:
        for detection in frame_result["detections"]:
            if detection["class_name"] == "person":
                is_violation = is_bbox_inside_zone(
                    detection["bbox"],
                    restricted_zone
                )

                if is_violation:
                    zone_violations.append({
                        "frame_number": frame_result["frame_number"],
                        "timestamp_seconds": frame_result["timestamp_seconds"],
                        "frame_path": frame_result["frame_path"],
                        "bbox": detection["bbox"],
                        "confidence": detection["confidence"]
                    })

    # Fallback logic:
    # If YOLO does not detect bounding boxes but OpenCV HOG detects people,
    # we still flag monitored-zone activity as possible restricted-zone violation.
    fallback_violation = False

    if len(zone_violations) == 0 and fallback_person_count > 0:
        fallback_violation = True

    return {
        "restricted_zone": restricted_zone,
        "zone_violations": zone_violations,
        "fallback_violation": fallback_violation,
        "violation_detected": len(zone_violations) > 0 or fallback_violation
    }