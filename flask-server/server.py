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
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/")
db = client["universitysystem"]
collection = db["lecturers"]
collection2 = db["students"]

script_dir = os.path.dirname(os.path.abspath(__file__))

encodingsP = os.path.join(script_dir, "faces.json")
cascade = os.path.join(script_dir, "haarcascade_frontalface_default.xml")
currentname = "unknown"

with open(encodingsP, "r") as file:
    data = json.load(file)
detector = cv2.CascadeClassifier(cascade)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = collection.find_one({'name': username, 'password': password})
    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

def get_condition_from_database(name):
    student = collection2.find_one({'name': name})
    if student:
        condition = student.get('existing_conditions', 'none')
        return condition
    else:
        return 'none'

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
        conditions = []

        print(boxes)
        for encoding in encodings:
            matches = face_recognition.compare_faces(data["encodings"], encoding)
            name = "Unknown"
            condition = 'none'
            if True in matches:
                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}
                for i in matchedIdxs:
                    name = data["names"][i]
                    condition = get_condition_from_database(name)
                    counts[name] = counts.get(name, 0) + 1
                name = max(counts, key=counts.get)
                if currentname != name:
                    currentname = name
            names.append(name)
            conditions.append(condition)
        return names, boxes, conditions

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
            names, boxes, conditions = result

            # Convert the list of tuples to a list of lists
            boxes = [[int(y) for y in x] for x in boxes]

            return jsonify({"names": names, "boxes": boxes, "conditions": conditions})
        else:
            return jsonify({"error": "No faces recognized in the frame."}), 404
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='192.168.76.30', port=3000, debug=True)
