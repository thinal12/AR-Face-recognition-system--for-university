import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  BackHandler,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../Lecturer/Header';
import {serverAddress} from '../other/config';

const AddStudent = ({navigation}) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [disciplinaryIssues, setDisciplinaryIssues] = useState('None');
  const [existingConditions, setExistingConditions] = useState('None');
  const [profilePic, setProfilePic] = useState(null);
  const [trainingData, setTrainingData] = useState([]);
  const [gpa, setGPA] = useState('0.0');
  const [isCameraVisible, setCamera] = useState(false);
  const [isProfilePicMode, setProfilePicMode] = useState(false);
  const [isTrainingPicMode, setTrainingPicMode] = useState(false);
  const [isProfilePicTaken, setProfilePicTaken] = useState(false);
  const [isTrainingPicTaken, setTrainingPicTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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

  const handleAddStudent = async () => {
    if (!studentId || !name || !gpa || !profilePic || !trainingData.length) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage('Adding student...');

      const data = {
        studentId,
        name,
        disciplinaryIssues,
        existingConditions,
        profilePic,
        trainingData,
        gpa,
      };

      const response = await fetch(serverAddress + '/add_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      setStudentId('');
      setName('');
      setDisciplinaryIssues('');
      setExistingConditions('');
      setProfilePic(null);
      setTrainingData([]);
      setGPA('');
      setProfilePicTaken(false);
      setTrainingPicTaken(false);

      Alert.alert('Success', 'Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCamera = (isProfile, isCamera) => {
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
        setProfilePicTaken(true);
        setCamera(false);
      } else {
        setTrainingPicTaken(true);
        setTrainingData([...trainingData, data.base64]);
      }
    }
  };

  const handleCompleteTraining = () => {
    setCamera(false);
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isLoading}
        onRequestClose={() => {
          setIsLoading(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}> Loading training data</Text>
          </View>
        </View>
      </Modal>

      {isCameraVisible && (
        <>
          <RNCamera
            ref={cameraRef}
            style={{flex: 1, width: '100%'}}
            type={RNCamera.Constants.Type.back}
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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ImageBackground
              source={require('../images/Background3.jpg')}
              style={styles.backgroundImage}>
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
                  <Text style={styles.label}>GPA:</Text>
                  <TextInput
                    style={styles.input}
                    value={gpa}
                    onChangeText={setGPA}
                    placeholder="Enter GPA"
                    keyboardType="numeric"
                  />
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Take Profile Picture"
                      onPress={() => handleShowCamera(true, true)}
                    />
                  </View>
                  <Text
                    style={[
                      styles.PicText,
                      isProfilePicTaken ? styles.greenText : styles.whiteText,
                    ]}>
                    {isProfilePicTaken
                      ? '* Profile Picture Taken'
                      : '* Profile Required'}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Take Training Picture"
                      onPress={() => handleShowCamera(false, true)}
                    />
                  </View>
                  <Text
                    style={[
                      styles.PicText,
                      isTrainingPicTaken ? styles.greenText : styles.whiteText,
                    ]}>
                    {isTrainingPicTaken
                      ? '* Training Picture Taken'
                      : '* Training Required'}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <Button title="Add Student" onPress={handleAddStudent} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </ScrollView>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    paddingTop: 38,
    paddingBottom: 10,
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
    backgroundColor: '#14151a',
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
  PicText: {
    fontSize: 12,
    color: 'green',
    marginBottom: 10,
  },
  greenText: {
    color: 'green',
  },
  whiteText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

export default AddStudent;
