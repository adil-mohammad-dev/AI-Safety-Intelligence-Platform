import cv2
import numpy as np


YOLO_CONFIG_PATH = "models/yolo/yolov3-tiny.cfg"
YOLO_WEIGHTS_PATH = "models/yolo/yolov3-tiny.weights"
YOLO_CLASSES_PATH = "models/yolo/coco.names"


def load_yolo_model():
    with open(YOLO_CLASSES_PATH, "r") as file:
        classes = [line.strip() for line in file.readlines()]

    net = cv2.dnn.readNetFromDarknet(
        YOLO_CONFIG_PATH,
        YOLO_WEIGHTS_PATH
    )

    layer_names = net.getLayerNames()
    unconnected_layers = net.getUnconnectedOutLayers()

    output_layers = []

    for i in unconnected_layers:
        if isinstance(i, (list, tuple)):
            output_layers.append(layer_names[i[0] - 1])
        else:
            output_layers.append(layer_names[int(i) - 1])

    return net, classes, output_layers


def detect_objects_in_image(image_path: str):
    net, classes, output_layers = load_yolo_model()

    image = cv2.imread(image_path)

    if image is None:
        return {
            "success": False,
            "message": "Unable to read image"
        }

    height, width, _ = image.shape

    blob = cv2.dnn.blobFromImage(
        image,
        scalefactor=1 / 255.0,
        size=(416, 416),
        swapRB=True,
        crop=False
    )

    net.setInput(blob)
    outputs = net.forward(output_layers)

    detections = []

    confidence_threshold = 0.25

    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = int(np.argmax(scores))
            confidence = float(scores[class_id])

            if confidence > confidence_threshold:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                box_width = int(detection[2] * width)
                box_height = int(detection[3] * height)

                x = int(center_x - box_width / 2)
                y = int(center_y - box_height / 2)

                detections.append({
                    "class_name": classes[class_id],
                    "confidence": round(confidence, 2),
                    "bbox": {
                        "x": x,
                        "y": y,
                        "width": box_width,
                        "height": box_height
                    }
                })

    return {
        "success": True,
        "detections": detections
    }

def detect_objects_in_frames(frames):
    all_results = []

    for frame_info in frames:
        frame_path = frame_info["frame_path"]

        result = detect_objects_in_image(frame_path)

        all_results.append({
            "frame_number": frame_info["frame_number"],
            "timestamp_seconds": frame_info["timestamp_seconds"],
            "frame_path": frame_path,
            "detections": result.get("detections", [])
        })

    return {
        "success": True,
        "total_frames_checked": len(frames),
        "results": all_results
    }