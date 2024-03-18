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
collection3 = db["modules"]
collection4 = db["lectures"]
collection5 = db["attendance"]

script_dir = os.path.dirname(os.path.abspath(__file__))

encodingsP = os.path.join(script_dir, "faces.json")
cascade = os.path.join(script_dir, "haarcascade_frontalface_default.xml")
currentname = "unknown"

with open(encodingsP, "r") as file:
    data = json.load(file)
detector = cv2.CascadeClassifier(cascade)

@app.route('/confirm-attendance', methods=['POST'])
def confirm_attendance(): 
    try:
        data = request.get_json()
        lecture_id = data.get('lecture_id')
        recorded_names = data.get('recorded_names')
        
        
        for name in recorded_names:
            record = {
                'lecture_id': lecture_id,
                'name': name,
                'attendance_status': 'present'  
            }
            collection5.insert_one(record)
        collection4.update_one({'lecture_id': lecture_id}, {'$set': {'attendance_status': 'Confirmed'}})
        return jsonify({'message': 'Attendance confirmed successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = collection.find_one({'name': username, 'password': password})
    if user:
        return jsonify({'message': 'Login successful', 'lecturer_id': str(user['lecturer_id'])}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/modules', methods=['POST'])
def get_modules():
    data = request.get_json()
    lecturer_id = int(data.get('lecturerId')) 
    
    modules = collection3.find({'lecturer_id': lecturer_id}, {'_id': 0, 'module_id': 1, 'module_name': 1})
    modules_list = list(modules)
    return jsonify(modules_list)

@app.route('/lectures', methods=['POST'])
def get_lectures():
    data = request.get_json()
    module_id = data.get('module_id')
    print(f'Lecturer ID: {module_id}')  
    lectures = collection4.find({'module_id': module_id}, {'_id': 0, 'module_id': 1, 'title': 1, 'lecture_id' : 1, 'attendance_status': 1})
    lectures_list = list(lectures)
    return jsonify(lectures_list)

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

            
            boxes = [[int(y) for y in x] for x in boxes]

            return jsonify({"names": names, "boxes": boxes, "conditions": conditions})
        else:
            return jsonify({"error": "No faces recognized in the frame."}), 404
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='192.168.205.30', port=3000, debug=True)
