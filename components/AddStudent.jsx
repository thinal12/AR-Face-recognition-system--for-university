import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Header from './Header';

const AddStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [disciplinaryIssues, setDisciplinaryIssues] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleAddStudent = () => {
    console.log('Adding student:', {
      studentId,
      name,
      disciplinaryIssues,
      existingConditions,
      profilePic,
    });

    setStudentId('');
    setName('');
    setDisciplinaryIssues('');
    setExistingConditions('');
    setProfilePic(null);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        chooseImage();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const chooseImage = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        setProfilePic(source);
      }
    });
  };

  return (
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

          <Text style={styles.label}>Profile Picture:</Text>
          <Button
            title="Choose Profile Picture"
            onPress={requestCameraPermission}
          />
          {profilePic && <Image source={profilePic} style={styles.image} />}

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

          <Button title="Add Student" onPress={handleAddStudent} />
        </View>
      </View>
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
