import json
import cv2
import face_recognition
import os
from imghdr import what

from imutils import paths

print("[INFO] start processing faces...")
imagePaths = list(paths.list_images("dataset"))


knownEncodings = []
knownNames = []


for (i, imagePath) in enumerate(imagePaths):

    print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
    name = imagePath.split(os.path.sep)[-2]


    image = cv2.imread(imagePath)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)


    boxes = face_recognition.face_locations(rgb, model="hog")


    encodings = face_recognition.face_encodings(rgb, boxes)


    for encoding in encodings:
        knownEncodings.append(encoding.tolist())
        knownNames.append(name)


print("[INFO] serializing encodings...")
data = {"encodings": knownEncodings, "names": knownNames}
with open("faces.json", "w") as f:
    json.dump(data, f)
