import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from './Header';
import BottomTabBar from './BottomTabNavigator';

function Help() {
  const [lectureId, setLectureId] = useState();
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
            1. To record attendance using face recognition, you must select any
            module that you teach.
          </Text>
          <Text style={styles.description}>
            2. Afterwards you would need click the 'Record Attendance' button.
            This will then open your camera.
          </Text>

          <Text style={styles.description}>
            3. The camera can then be used to scan the faces of the students in
            the lecture hall. Once the student is recognized you can then click
            on the 'Record Names' button which will then record the names of the
            students into a list. The number students that have been recognized
            will be displayed at the top of the screen.
          </Text>
          <Text style={styles.description}>
            4. Once all the students have been recognized you can then click on
            the 'Submit Attendance' button to submit the attendance.
          </Text>
          <Text style={styles.description}>
            5. Finally you can press the 'Confirm Attendance' button to record
            the attendance of the student
          </Text>
          <Text style={styles.section}>
            Instructions for Viewing AR Profiles:
          </Text>
          <Text style={styles.description}>
            1. Access the AR profile feature you must first click 'AR Profile'
            button on the bottom navigation bar which will open your camera.
          </Text>
          <Text style={styles.description}>
            2. When a person recognized a box will appear around their face
            along with a button that called 'View Profile'. Click the button
            view the profile of the student.
          </Text>
          <Text style={styles.description}>
            This will take you to the AR scene that will display the student's
            profile.
          </Text>
          <Text style={styles.description}>
            *Note: Only one student profile can be viewed at a time. If you want
            to view another student's profile, you must first press the back
            space which will take you back to the home page and start the
            process again.
          </Text>
          <Text style={styles.section}>
            Instructions for Manually Recording Attendance:
          </Text>
          <Text style={styles.description}>
            1. If necessary, you can manually record. First you have to navigate
            to the specific lecture you want to record attendance for. you can
            do this by selecting the module that the lecture belongs to from the
            home page.
          </Text>
          <Text style={styles.description}>
            2. If the lectue card contains the button 'Edit Attendance' you must
            click it to navigate to the edit attendance page.
          </Text>
          <Text style={styles.description}>
            3. In the edit attendance page you can enter the students id then
            click the 'Confirm' button to record the attendance of that student.
          </Text>
          <Text style={styles.section}>
            Instructions for Searching for Student Profiles:
          </Text>
          <Text style={styles.description}>
            1. Utilize the search functionality to find specific student
            profiles. You must first click the student search button on the
            bottom navigation bar.
          </Text>
          <Text style={styles.description}>
            2.Enter the student's name or ID in the search bar and click the
            card.
          </Text>
          <Text style={styles.description}>
            Once this is done you will be taken to the student's profile page.
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