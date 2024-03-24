from pymongo import MongoClient


password = "321t071np"


connection_string = f"mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/"


client = MongoClient("mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/")
db = client["universitysystem"]

collection = db["lecturers"]
collection2 = db["students"]
collection3 = db["modules"]
collection4 = db["lectures"]
collection5 = db["attendance"]


modules = collection3.find()

for module in modules:
    module_id = module['module_id']
    module_name = module['module_name']


    confirmed_lectures = collection4.find({
        'module_id': module_id,
        'attendance_status': 'Confirmed'
    })

    print(f"Lectures for module '{module_name}':")
    for lecture in confirmed_lectures:
        print(lecture)
