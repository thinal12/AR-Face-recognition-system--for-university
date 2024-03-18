import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const EditAttendance = () => {
  const [attendance, setAttendance] = useState('');
  const route = useRoute();

  const handleConfirm = () => {
    // Save the attendance
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Attendance</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Enter student name or ID:</Text>
        <TextInput
          style={styles.input}
          value={attendance}
          onChangeText={setAttendance}
          placeholder="Enter attendance"
        />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Background color for the container
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'white', // Background color for the form container
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
    color: 'black', // Color for the label
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditAttendance;
