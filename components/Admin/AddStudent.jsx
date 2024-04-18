import React, {useState, useRef} from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../Lecturer/Header';
import {serverAddress} from '../config';

const AddStudent = ({navigation}) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [disciplinaryIssues, setDisciplinaryIssues] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [trainingData, setTrainingData] = useState([]);
  const [isCameraVisible, setCamera] = useState(false);
  const [isProfilePicMode, setProfilePicMode] = useState(false);
  const [isTrainingPicMode, setTrainingPicMode] = useState(false);
  const cameraRef = useRef(null);

  const handleBackPress = async () => {
    navigation.goBack();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  const handleAddStudent = () => {
    const data = {
      studentId,
      name,
      disciplinaryIssues,
      existingConditions,
      profilePic,
      trainingData,
    };
    fetch(serverAddress + '/add_student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch(error => {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student');
    });
  };

  const handleShowCamera = (isProfile, isCamera) => {
    console.log('Showing camera:', isProfile, isCamera);
    if (isProfile) {
      setProfilePicMode(true);
      setTrainingPicMode(false);
    } else {
      setProfilePicMode(false);
      setTrainingPicMode(true);
    }
    setCamera(isCamera);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      if (isProfilePicMode) {
        setProfilePic(data.base64);
        setCamera(false);
      } else {
        setTrainingData([...trainingData, data.base64]);
      }
    }
  };
  const handleCompleteTraining = () => {
    setCamera(false);
  };

  return (
    <ImageBackground
      source={require('../images/Background.jpg')}
      style={styles.backgroundImage}>
      {isCameraVisible && (
        <>
          <RNCamera
            ref={cameraRef}
            style={{flex: 1, width: '100%'}}
            type={RNCamera.Constants.Type.front}
          />
          {isProfilePicMode && (
            <Button title="Capture" onPress={handleTakePicture} />
          )}
          {isTrainingPicMode && (
            <>
              <Button title="Capture" onPress={handleTakePicture} />
              <Button title="Complete" onPress={handleCompleteTraining} />
            </>
          )}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#a3abff',
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
