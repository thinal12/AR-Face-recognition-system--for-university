import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const AdminHome = ({navigation}) => {
  const handleCreateLecturer = () => {
    navigation.navigate('CreateLecturer');
  };

  const handleCreateModule = () => {
    navigation.navigate('CreateModule');
  };
  const handleAddStudent = () => {
    navigation.navigate('AddStudent');
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateLecturer}>
          <Text style={styles.buttonText}>Create Lecturer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateModule}>
          <Text style={styles.buttonText}>Create Module</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#119DA4',
    width: 150,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHome;
