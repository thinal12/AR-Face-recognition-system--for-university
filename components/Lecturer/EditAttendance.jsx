import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {serverAddress} from '../config';
import Header from './Header';

const EditAttendance = () => {
  const [student, setStudent] = useState('');
  const route = useRoute();
  const {lecture_id} = route.params;
  const navigation = useNavigation();

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

  const handleConfirm = () => {
    fetch(serverAddress + '/edit_attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({student, lecture_id}),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Edit Attendance failed');
        }
      })
      .then(data => {
        console.log('Editted Attendance');
      })
      .catch(error => {
        console.error('Edit Attendance error:', error);
      });
  };

  return (
    <ImageBackground
      source={require('../images/Background2.jpg')}
      style={styles.backgroundImage}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Edit Attendance</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter student name or ID:</Text>
          <TextInput
            style={styles.input}
            value={student}
            onChangeText={setStudent}
            placeholder="Enter attendance"
          />
          <Button title="Confirm" onPress={handleConfirm} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#14151a',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
    paddingBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    color: 'white',
  },
});

export default EditAttendance;
