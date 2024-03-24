from pymongo import MongoClient


password = "321t071np"


connection_string = f"mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/"


client = MongoClient("mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/")
db = client["universitysystem"]
collection = db["modules"]
collection = db["lecturers"]
collection2 = db["students"]
collection3 = db["modules"]
collection4 = db["lectures"]
collection5 = db["attendance"]


cursor = collection.find({'lecturer_id': 2})
modules_list = list(cursor)
print(modules_list)
for module in modules_list:
    print(module['module_id'])
    
