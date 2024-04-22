import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from './Header';
import BottomTabBar from './BottomTabNavigator';

function Help() {
  const [lectureId, setLectureId] = useState(0);
  const navigation = useNavigation();

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

  useEffect(() => {
    async function fetchLectureId() {
      try {
        const storedLectureId = await AsyncStorage.getItem('lectureId');
        if (storedLectureId !== null) {
          setLectureId(parseInt(storedLectureId));
        }
      } catch (error) {
        console.error('Error retrieving lectureId:', error);
      }
    }

    fetchLectureId();
  }, []);

  function renderInstructions() {
    if (lectureId === 0) {
      return (
        <>
          <Text style={styles.heading}>Admin Functionalities:</Text>
          <Text style={styles.section}>1. Add a new student</Text>
          <Text style={styles.section}>2. Add a lecturer</Text>
          <Text style={styles.section}>3. Create modules</Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.section}>
            Instructions for Recording Attendance using Face Recognition:
          </Text>
          <Text style={styles.description}>
            To record attendance using face recognition, navigate to the
            attendance section and follow the on-screen instructions for
            scanning student faces.
          </Text>
          <Text style={styles.section}>
            Instructions for Viewing AR Profiles:
          </Text>
          <Text style={styles.description}>
            Access the AR profile feature to view augmented reality
            representations of student profiles. Simply navigate to the AR
            profile section and select a student.
          </Text>
          <Text style={styles.section}>
            Instructions for Manually Recording Attendance:
          </Text>
          <Text style={styles.description}>
            If face recognition isn't available, you can manually record
            attendance by entering student IDs or names in the provided fields.
          </Text>
          <Text style={styles.section}>
            Instructions for Searching for Student Profiles:
          </Text>
          <Text style={styles.description}>
            Utilize the search functionality to find specific student profiles.
            Enter the student's name or ID in the search bar to retrieve their
            information.
          </Text>
        </>
      );
    }
  }

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Help</Text>
          {renderInstructions()}
        </View>
      </ScrollView>
      {lectureId !== 0 && <BottomTabBar />}
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

export default Help;
