from pymongo import MongoClient

# Replace <password> with your actual password
password = "321t071np"

# Construct the connection string
connection_string = f"mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/"

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://thinalpethiyagoda:321t071np@universitysystem.009rjim.mongodb.net/")
db = client["universitysystem"]
collection = db["lecturers"]


# Example: Find all documents in the 'lectures' collection
cursor = collection.find()
print('hi')
print(cursor)
for document in cursor:
    print(document)