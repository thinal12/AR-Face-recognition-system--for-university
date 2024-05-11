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
import {serverAddress} from '../other/config';
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
      try {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
      } catch (error) {
        console.error('Error adding or removing event listener:', error);
      }
    }, []),
  );

  const handleConfirm = async () => {
    try {
      const response = await fetch(serverAddress + '/edit_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({student, lecture_id}),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Attendance already recorded') {
          alert('❗Attendance already recorded');
        } else if (data.message === 'Attendance edited successfully') {
          alert('✅ Attendance edited successfully');
        } else {
          throw new Error('Unexpected response from server');
        }
      } else {
        throw new Error('❗Edit Attendance failed');
      }
    } catch (error) {
      alert('An error occurred while editing attendance');
    }
  };

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/Background10.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Attendance</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Enter student name or ID:</Text>
            <TextInput
              style={styles.input}
              value={student}
              onChangeText={setStudent}
            />
            <Button title="Confirm" onPress={handleConfirm} />
          </View>
        </View>
      </ImageBackground>
    </>
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
    maxWidth: 250,
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
