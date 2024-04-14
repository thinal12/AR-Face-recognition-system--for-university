import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Header from '../Lecturer/Header';

const AddStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [disciplinaryIssues, setDisciplinaryIssues] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [trainingData, setTrainingData] = useState([]);
  const [isCameraVisible, setCamera] = useState(false);
  const [isProfilePicMode, setProfilePicMode] = useState(false);

  const cameraRef = useRef(null);

  const handleAddStudent = () => {
    console.log('Adding student:', {
      studentId,
      name,
      disciplinaryIssues,
      existingConditions,
      profilePic,
      trainingData,
    });
  };

  const handleShowCamera = (isProfile, isCamera) => {
    console.log('Showing camera:', isProfile, isCamera);
    setProfilePicMode(isProfile);
    setCamera(isCamera);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      if (isProfilePicMode === true) {
        setProfilePic(data.base64);
      } else {
        setTrainingData([...trainingData, data.base64]);
      }
    }
  };

  return (
    <>
      {isCameraVisible && (
        <>
          <RNCamera
            ref={cameraRef}
            style={{flex: 1, width: '100%'}}
            type={RNCamera.Constants.Type.front}
          />
          <Button title="Capture" onPress={handleTakePicture} />
        </>
      )}
      {!isCameraVisible && (
        <>
          <Header />
          <View style={styles.container}>
            <View style={styles.form}>
              <Text style={styles.heading}>Add Student</Text>

              <Text style={styles.label}>Student ID:</Text>
              <TextInput
                style={styles.input}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Enter Student ID"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
              />

              <Text style={styles.label}>Disciplinary Issues:</Text>
              <TextInput
                style={styles.input}
                value={disciplinaryIssues}
                onChangeText={setDisciplinaryIssues}
                placeholder="Enter disciplinary issues"
              />

              <Text style={styles.label}>Existing Conditions:</Text>
              <TextInput
                style={styles.input}
                value={existingConditions}
                onChangeText={setExistingConditions}
                placeholder="Enter existing conditions"
              />

              <Button
                title="Take Profile Picture"
                onPress={() => handleShowCamera(true, true)}
              />
              <Button
                title="Take Training Picture"
                onPress={() => handleShowCamera(false, true)}
              />

              <Button title="Add Student" onPress={handleAddStudent} />
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  form: {
    width: '80%',
    backgroundColor: '#13505B',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default AddStudent;
