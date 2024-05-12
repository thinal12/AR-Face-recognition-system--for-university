# VisageAR

VisageAR is a Face Recognition system that also uses Augmented Reality made specifically for universities. This application can be used for recording attendance of students and also be used for given an AR profile of the students which would provide convenient access to information of the students.  This app has only been tested on Android

## Installing Packages

### React Native
- First you must install Node.js from https://nodejs.org/en . Make sure the downloaded version is v20.11.0 or newer.
- Then from the root directory, navigate to the VisageAR folder using your terminal and running `cd VisageAR`
- Run the command  `npm install` or `npm i`

### Flask server
- You must make sure that you install the C and C++ build tool.
- First you must install python. Make sure the downloaded version is 3.10 or newer.
- Then from the root directory, navigate to the sever folder using your terminal by running `cd server`.
- Then install the packages specified in requirements.txt file by running the command `pip install -r requirements.txt`
  
## How to run
- Enable developer options on your mobile device.
- Enable USB Debugging on your mobile device.
- Open 2 terminals.
### How to run the server
- Then from the root directory, navigate to the sever folder using one of the terminals by running `cd server`.
- Then run `python server.py` to run the server.
- Then you be able to see the IPv4 address that the server is run on. (do not use http://127.0.0.1:3000)
  
  ![Screenshot 2024-05-09 094124](https://github.com/thinal12/AR-Face-recognition-system--for-university/assets/114849355/c4b77289-557b-412e-8d9d-79d25385c8ce)

- Copy this address and paste it in the config.js file which is located in components/other. Replace http://192.168.94.30:3000 with your ipv4 address along with the port.
  
  ![Screenshot 2024-05-09 094500](https://github.com/thinal12/AR-Face-recognition-system--for-university/assets/114849355/b7b7b917-69b0-4340-963d-6e0fd840cd99)

### How to run mobile app
- Enable developer options and USB Debugging on your Android device.
- Connect it to your computer using a cabel.
- Then on the other terminal navigate to the VisageAR folder.
- Then run `npm start`.
- After some time it aill ask what dev server you would like to use. Press 'a' to select Android and you will be able to run the app.
  
  ![Screenshot 2024-05-09 100934](https://github.com/thinal12/AR-Face-recognition-system--for-university/assets/114849355/cf26039a-0216-4f8d-99de-1819335ee4b0)
  
- Please note that you have to keep your phone plugged into the same device that yoir server runs on

## Login Credentials
- Administrator account
  Username: Admin, 
  Password: Admin
- Lecturer Account
  Username: David, 
  password: Mypass
## Futher Instuctions
- There is a help button on the Header of each page. You use to view the instructions on how to use the app.
### GitHub Repository
- Link: https://github.com/thinal12/AR-Face-recognition-system--for-university
