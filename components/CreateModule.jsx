import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CreateModule = ({navigation}) => {
  const [moduleCode, setModuleCode] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [numberOfLectures, setNumberOfLectures] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateModule = () => {
    if (!moduleCode || !moduleName || !lecturerId || !numberOfLectures) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    const moduleDetails = {
      module_code: moduleCode,
      module_name: moduleName,
      lecturer_id: lecturerId,
      number_of_lectures: numberOfLectures,
    };

    // Assuming you have a server endpoint for creating a module
    fetch('http://192.168.205.30:3000/create-module', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleDetails),
    })
      .then(response => {
        if (response.ok) {
        } else {
          throw new Error('Failed to create module');
        }
      })
      .catch(error => {
        console.error('Create module error:', error);
      });
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Module</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Module Code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Module Code"
            onChangeText={text => setModuleCode(text)}
            value={moduleCode}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Module Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Module Name"
            onChangeText={text => setModuleName(text)}
            value={moduleName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Lecturer ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Lecturer ID"
            onChangeText={text => setLecturerId(text)}
            value={lecturerId}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Lectures:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Number of Lectures"
            onChangeText={text => setNumberOfLectures(text)}
            value={numberOfLectures}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateModule}>
          <Text style={styles.buttonText}>Create Module</Text>
        </TouchableOpacity>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#040404',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#13505B',
    padding: 20,
    borderRadius: 10,
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

export default CreateModule;
