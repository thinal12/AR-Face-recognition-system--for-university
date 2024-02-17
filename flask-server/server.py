from flask import Flask, request, jsonify
import base64
import imutils
import os
from PIL import Image
import face_recognition
from io import BytesIO
import cv2
import numpy as np
import json

app = Flask(__name__)

script_dir = os.path.dirname(os.path.abspath(__file__))

encodingsP = os.path.join(script_dir, "faces.json")
cascade = os.path.join(script_dir, "haarcascade_frontalface_default.xml")
currentname = "unknown"

with open(encodingsP, "r") as file:
    data = json.load(file)
detector = cv2.CascadeClassifier(cascade)

def process_frame(base64_frame,width, height):
    global currentname
    try:
        frame_bytes = base64.b64decode(base64_frame)
        frame_array = np.frombuffer(frame_bytes, dtype=np.uint8)
        frame = cv2.imdecode(frame_array, cv2.IMREAD_COLOR)

        frame = imutils.resize(frame, width=width, height=height)

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rects = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)
        boxes = [[y, x + w, y + h, x] for (x, y, w, h) in rects]

        encodings = face_recognition.face_encodings(rgb, boxes)
        names = []

        print(boxes)
        for encoding in encodings:
            matches = face_recognition.compare_faces(data["encodings"], encoding)
            name = "Unknown"
            if True in matches:
                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}
                for i in matchedIdxs:
                    name = data["names"][i]
                    counts[name] = counts.get(name, 0) + 1
                name = max(counts, key=counts.get)
                if currentname != name:
                    currentname = name
            names.append(name)
        return names, boxes

    except Exception as e:
        return str(e)

@app.route("/process-frame", methods=["POST"])
def receive_frame():
    try:
        data = request.get_json()
        base64_frame = data.get("base64Frame")
        width = data.get("width")  
        height = data.get("height") 
        result = process_frame(base64_frame, width, height)
        
        if result is not None:
            names, boxes = result

            # Convert the list of tuples to a list of lists
            boxes = [[int(y) for y in x] for x in boxes]

            return jsonify({"names": names, "boxes": boxes})
        else:
            return jsonify({"error": "No faces recognized in the frame."}), 404
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='192.168.76.30', port=3000, debug=True)
