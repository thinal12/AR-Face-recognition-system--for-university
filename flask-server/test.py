from pymongo import MongoClient


password = "321t071np"


connection_string = f"mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/"


client = MongoClient("mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/")
db = client["universitysystem"]
collection = db["modules"]


cursor = collection.find_one({'module_name': 'Computing indivdual project'})
module_id = cursor['module_id']
module_name = cursor['module_name']
lecturer_id = cursor['lecturer_id']

print(module_id)
print(module_name)
print(lecturer_id)