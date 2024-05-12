import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from './Header';
import BottomTabBar from './BottomTabNavigator';

function Help() {
  const [lectureId, setLectureId] = useState();
  const [expandedSections, setExpandedSections] = useState({});

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

  function toggleSection(section) {
    setExpandedSections(prevExpandedSections => ({
      ...prevExpandedSections,
      [section]: !prevExpandedSections[section],
    }));
  }

  function renderInstructions() {
    return (
      <>
        <TouchableOpacity onPress={() => toggleSection('recordingAttendance')}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Instructions for Recording Attendance using Face Recognition:
            </Text>
            <Text style={styles.sectionIcon}>
              {expandedSections['recordingAttendance'] ? '🔼' : '🔽'}
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSections['recordingAttendance'] && (
          <>
            <Text style={styles.description}>
              1. To record attendance using face recognition, you must select
              any module that you teach.
            </Text>
            <Text style={styles.description}>
              2. Afterwards you would need click the 'Record Attendance' button.
              This will then open your camera.
            </Text>
            <Text style={styles.description}>
              3. The camera can then be used to scan the faces of the students
              in the lecture hall. Once the student is recognized you can then
              click on the 'Record Names' button which will then record the
              names of the students into a list. The number students that have
              been recognized will be displayed at the top of the screen.
            </Text>
            <Text style={styles.description}>
              4. Finally you can press the 'Confirm Attendance' button to record
              the attendance of the student.
            </Text>
          </>
        )}

        <TouchableOpacity onPress={() => toggleSection('viewingARProfiles')}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Instructions for Viewing AR Profiles:
            </Text>
            <Text style={{fontSize: 20, paddingLeft: 21}}>
              {expandedSections['viewingARProfiles'] ? '🔼' : '🔽'}
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSections['viewingARProfiles'] && (
          <>
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
              *Note: Only one student profile can be viewed at a time. If you
              want to view another student's profile, you must first press the
              back space which will take you back to the home page and start the
              process again.
            </Text>
          </>
        )}

        <TouchableOpacity onPress={() => toggleSection('manualAttendance')}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Instructions for Manually Recording Attendance:
            </Text>
            <Text style={{fontSize: 20, paddingLeft: 20}}>
              {expandedSections['manualAttendance'] ? '🔼' : '🔽'}
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSections['manualAttendance'] && (
          <>
            <Text style={styles.description}>
              1. If necessary, you can manually record. First you have to
              navigate to the specific lecture you want to record attendance
              for. you can do this by selecting the module that the lecture
              belongs to from the home page.
            </Text>
            <Text style={styles.description}>
              2. If the lectue card contains the button 'Edit Attendance' you
              must click it to navigate to the edit attendance page.
            </Text>
            <Text style={styles.description}>
              3. In the edit attendance page you can enter the students id then
              click the 'Confirm' button to record the attendance of that
              student.
            </Text>
            <Text style={styles.description}>
              * You can only manually record attendance once you intially
              recorded attendance using face recognition method.
            </Text>
          </>
        )}

        <TouchableOpacity
          onPress={() => toggleSection('searchingStudentProfiles')}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Instructions for Searching for Student Profiles:
            </Text>
            <Text style={{fontSize: 20, paddingLeft: 3}}>
              {expandedSections['searchingStudentProfiles'] ? '🔼' : '🔽'}
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSections['searchingStudentProfiles'] && (
          <>
            <Text style={styles.description}>
              1. Utilize the search functionality to find specific student
              profiles. You must first click the student search button on the
              bottom navigation bar.
            </Text>
            <Text style={styles.description}>
              2. Enter the student's name or ID in the search bar and click the
              card.
            </Text>
            <Text style={styles.description}>
              Once this is done you will be taken to the student's profile page.
            </Text>
          </>
        )}
        <TouchableOpacity onPress={() => toggleSection('BoxColors')}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Box Colors:</Text>
            <Text style={{fontSize: 20, paddingLeft: 15}}>
              {expandedSections['BoxColors'] ? '🔼' : '🔽'}
            </Text>
          </View>
        </TouchableOpacity>
        {expandedSections['BoxColors'] && (
          <>
            <Text style={styles.description}>
              Green box: Is the default box color that appears when a face is
              recognized.
            </Text>
            <Text style={styles.description}>
              Red box: Appears if the student has disciplinary issues.
            </Text>
            <Text style={styles.description}>
              Yellow box: Appears if the student has a medical condition or any
              other existing condition.
            </Text>
            <Text style={styles.description}>
              Blue box: Appears if the student has any other existing condition
              or has disciplinary issues.
            </Text>
          </>
        )}
      </>
    );
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
      <BottomTabBar />
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
    paddingBottom: 100,
  },
  heading: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionIcon: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
});

export default Help;
