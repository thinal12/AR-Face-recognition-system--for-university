import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {serverAddress} from '../other/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Lecturer/Header';

const CreateLecturer = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [lecturerId, setLecturerId] = useState(''); // New state for lecturer id
  const [errorMessage, setErrorMessage] = useState('');

  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('previousTab');
    await AsyncStorage.setItem('activeTab', value);
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

  const handleCreateLecturer = async () => {
    if (!name || !password || !lecturerId) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const lecturerDetails = {
      name: name,
      password: password,
      lecturerId: parseInt(lecturerId),
    };

    fetch(serverAddress + '/create-lecturer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lecturerDetails),
    })
      .then(response => {
        if (response.ok) {
          navigation.navigate('AdminHome');
        } else if (response.status === 400) {
          return response.json();
        } else {
          setErrorMessage('Lecturer ID already exists');
        }
      })
      .then(data => {
        if (data && data.error === 'Lecturer ID already exists') {
          setErrorMessage('Lecturer ID already exists');
        }
      })
      .catch(error => {
        console.error('Create lecturer error:', error);
      });
  };

  const handleLecturerIdChange = text => {
    if (/^\d+$/.test(text) || text === '') {
      setLecturerId(text);
    }
  };

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/Background3.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.pageContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Lecturer</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                onChangeText={text => setName(text)}
                value={name}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Lecturer ID:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Lecturer ID"
                onChangeText={handleLecturerIdChange}
                value={lecturerId}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateLecturer}>
              <Text style={styles.buttonText}>Create Lecturer</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '60%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D7D9CE',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    color: '#D7D9CE',
  },
  input: {
    width: '100%',
    maxWidth: 180,
    height: 40,
    borderColor: '#D7D9CE',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#D7D9CE',
  },
  button: {
    backgroundColor: '#119DA4',
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CreateLecturer;
