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

@app.route('/create-lecturer', methods=['POST'])
def create_lecturer():
    try:
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        
        lecturer_count = collection.count_documents({})

        
        lecturer_id = lecturer_count

        
        lecturer = {
            'name': name,
            'password': password,
            'lecturer_id': lecturer_id
        }
        collection.insert_one(lecturer)

        return jsonify({'message': 'Lecturer created successfully', 'lecturer_id': lecturer_id}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/create-module', methods=['POST'])
def create_module():
    try:
        data = request.get_json()
        module_code = data.get('module_code')
        module_name = data.get('module_name')
        lecturer_id = int(data.get('lecturer_id'))  
        number_of_lectures = int(data.get('number_of_lectures'))  

        
        module = {
            'module_code': module_code,
            'module_name': module_name,
            'lecturer_id': lecturer_id,
        }
        module = collection3.insert_one(module)

     
        for i in range(1, number_of_lectures + 1):
            lecture_id = f'{module_code}{i}'  
            title = f'Lecture {i}'
            lecture = {
                'lecture_id': lecture_id,
                'module_code': module_code,
                'title': title,
                'attendance_status': 'none'
            }
            collection4.insert_one(lecture)

        return jsonify({'message': 'Module and lectures created successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500



@app.route('/confirm-attendance', methods=['POST'])
def confirm_attendance(): 
    try:
        data = request.get_json()
        lecture_id = data.get('lecture_id')
        recorded_names = data.get('recorded_names')
        
        for name in recorded_names:
            user = collection2.find_one({'name': name})
            record = {
                'lecture_id': lecture_id,
                'student_id': user['student_id'],
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

@app.route('/search-students', methods=['POST'])
def search_students():
    try:
        data = request.get_json()
        search_query = data.get('searchQuery')
        
        students = collection2.find({"name": {"$regex": search_query, "$options": "i"}})
        
        search_results = []
        for student in students:
            student_info = {
                'student_id': str(student.get('student_id')),
                'name': student.get('name'),
                'disciplinary_issues': student.get('disciplinary_issues'),
                'existing_conditions': student.get('existing_conditions')
            }
            search_results.append(student_info)

        return jsonify(search_results), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

from bson import ObjectId
from flask import jsonify

@app.route('/get-studentattendance',methods=['POST'])
def get_student_attendance():
    
    data = request.get_json()
    student_id = data.get('student_id')
    student_id = int(student_id)
    modules_list = collection3.find()
    modules= list(modules_list)
    module_attendance = []
    for module in modules:
        total_attended = 0
        print(module['module_code'])
        lectures = collection4.find({'module_code': module['module_code'], 'attendance_status': 'Confirmed'})
        total_lectures = 0
        for lecture in lectures:
            total_lectures += 1
            attendance_records = collection5.find({'student_id': student_id,'lecture_id': lecture['lecture_id']})
            attendance = len(list(attendance_records))
            print(list(attendance_records))
            if attendance > 0:
                total_attended += 1
        
        attendance_percentage = (total_attended / total_lectures) * 100
        
        module['_id'] = str(module['_id'])  
        module_attendance.append(attendance_percentage)
        print(module_attendance)
        print(modules)
    return jsonify({'modules': modules, 'module_attendance': module_attendance})


    
@app.route('/edit_attendance', methods=['POST'])
def edit_attendance():
    try:
        data = request.get_json()
        student = data.get('student')
        lecture_id = data.get('lecture_id')
        if any(char.isdigit() for char in student):
            student = int(student)
            print(student)
            user = collection2.find_one({'student_id': student})
            record = {
                    'lecture_id': lecture_id,
                    'student_id': user['student_id'],
                    'attendance_status': 'present'  
                }
        else:
            user = collection2.find_one({'name': student})
            record = {
                    'lecture_id': lecture_id,
                    'student_id': user['student_id'],
                    'attendance_status': 'present'  
                }
        collection5.insert_one(record)
        return jsonify({'message': 'Attendance edited successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/modules', methods=['POST'])
def get_modules():
    data = request.get_json()
    lecturer_id = int(data.get('lecturerId')) 
    modules = collection3.find({'lecturer_id': lecturer_id}, {'_id': 0, 'module_code': 1, 'module_name': 1})
    modules_list = list(modules)
    return jsonify(modules_list)

@app.route('/lectures', methods=['POST'])
def get_lectures():
    data = request.get_json()
    module_id = data.get('module_code') 
    lectures = collection4.find({'module_code': module_id}, {'_id': 0, 'module_code': 1, 'title': 1, 'lecture_id' : 1, 'attendance_status': 1})
    lectures_list = list(lectures)
    return jsonify(lectures_list)

def get_condition_from_database(name):
    student = collection2.find_one({'name': name})
    if student:
        return student
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
        previous_names = data.get("prev_names")
        result = process_frame(base64_frame, width, height)
        conditions = []
        issues = []
        
        if result is not None:
            names, boxes = result
            boxes = [[int(y) for y in x] for x in boxes]
            if set(names) != set(previous_names):
                print(names)
                print(previous_names)
                for name in names:
                    student = get_condition_from_database(name)
                    conditions.append(student["existing_conditions"])
                    issues.append(student["disciplinary_issues"])
            

            return jsonify({"names": names, "boxes": boxes, "conditions": conditions, "issues": issues})
        else:
            return jsonify({"error": "No faces recognized in the frame."}), 404
        
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500




if __name__ == "__main__":
    app.run(host='192.168.205.30', port=3000, debug=True)
