import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AdminHeader from './AdminHeader';

function AdminHelp() {
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

  function renderInstructions() {
    return (
      <>
        <Text style={styles.heading}>Admin Functionalities:</Text>
        <Text style={styles.section}>Add a new student</Text>
        <Text style={styles.description}>
          1. Enter the new students credientials. Ensure that it does not clash
          with any other student.
        </Text>
        <Text style={styles.description}>
          2. Take a profile picture of the student. By pressing the 'TAKE
          PROFILE PICTURE'. This takes it to the camera screen. Then press the
          'Capture' button to take the picture.
        </Text>
        <Text style={styles.description}>
          3. Then you must take the training pictures of the student. By
          pressing the 'TAKE TRAINING PICTURES'. This takes it to the camera
          screen. Then press the 'Capture' button to take the pictures. Take
          around 5 training pictures. Once you are done press 'COMPLETE'.
        </Text>
        <Text style={styles.description}>
          4. Click the add the 'ADD STUDENT'. You have to wait until its
          complete.
        </Text>
        <Text style={styles.section}>Add a lecturer</Text>
        <Text style={styles.description}>
          1. Enter the new students credientials. Ensure that it does not clash
          with any other lecturer.
        </Text>
        <Text style={styles.description}>
          2. Press the 'Create Lecturer' button.
        </Text>
        <Text style={styles.section}>Create modules</Text>
        <Text style={styles.description}>
          1. Enter the module code, module name, lecturer id and number of
          lectures. Ensure that it does not clash with any other Module.
        </Text>
        <Text style={styles.description}>
          2. Press the 'Create Module' button.
        </Text>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>{renderInstructions()}</View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  heading: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
});

export default AdminHelp;
