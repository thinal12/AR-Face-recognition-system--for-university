from pymongo import MongoClient
import os
import glob
import base64


username = "thinalpethiyagoda"
password = "321t071np"
dbname = "universitysystem"
cluster = "universitysystem.009rjim.mongodb.net"

connection_string = f"mongodb+srv://{username}:{password}@{cluster}/{dbname}?retryWrites=true&w=majority"



client = MongoClient(connection_string)
db = client[dbname]



collection_names = ["lecturers", "students", "modules", "lectures", "attendance", "profile_pic"]
collections = {name: db[name] for name in collection_names}


script_dir = os.path.dirname(os.path.abspath(__file__))
dataset_directory = os.path.join(script_dir, "dataset")


base64_images = {}


for person_folder in os.listdir(dataset_directory):
    person_folder_path = os.path.join(dataset_directory, person_folder)
    if os.path.isdir(person_folder_path):
        profile_pic_path = os.path.join(person_folder_path, "profile_pic.*")
        profile_pic = glob.glob(profile_pic_path)
        if profile_pic:
            profile_pic = profile_pic[0]
            try:
                with open(profile_pic, "rb") as img_file:
                    base64_images[person_folder] = base64.b64encode(img_file.read()).decode('utf-8')
            except Exception as e:
                print(f"Error reading {profile_pic}: {e}")


for person, base64_string in base64_images.items():
    try:
        result = collections["profile_pic"].insert_one({"name": person, "image": base64_string})
        print(f"Inserted {person}'s profile pic into MongoDB with ID: {result.inserted_id}")
    except Exception as e:
        print(f"Failed to insert {person}'s profile pic into MongoDB:", e)
