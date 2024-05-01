import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  BackHandler,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {serverAddress} from '../other/config';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from './Header';
import BottomTabNavigator from './BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressBar = ({percentage}) => {
  const barWidth = Dimensions.get('window').width - 50;
  const progressWidth = (percentage * barWidth) / 100;
  let color = 'green';

  if (percentage < 70 && percentage >= 50) {
    color = 'yellow';
  } else if (percentage < 50) {
    color = 'red';
  }

  return (
    <View style={styles.progressBar}>
      <View
        style={{
          ...styles.progress,
          width: progressWidth,
          backgroundColor: color,
        }}
      />
      <Text style={{...styles.percentageText, color: color}}>
        {percentage}%
      </Text>
    </View>
  );
};

const StudentProfile = ({route}) => {
  const {student} = route.params;
  const [moduleData, setModuleData] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [disciplinaryIssues, setDisciplinaryIssues] = useState(null);
  const [existingConditions, setExistingConditions] = useState(null);
  const [gpa, setGpa] = useState(null);
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
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(serverAddress + '/get-studentattendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({student_id: student.student_id}),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const {
          modules,
          module_attendance,
          disciplinary_issues,
          existing_conditions,
          gpa,
          profile_pic_base64,
        } = await response.json();

        const moduleData = modules.map((module, index) => ({
          ...module,
          attendance_percentage: module_attendance[index],
        }));
        setModuleData(moduleData);
        setDisciplinaryIssues(disciplinary_issues);
        setExistingConditions(existing_conditions);
        setGpa(gpa);
        setProfilePic(`data:image/jpeg;base64, ${profile_pic_base64}`);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [student]);

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/profileBackground2.jpg')}
        style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <View style={styles.profileDetails}>
                {profilePic && (
                  <View style={styles.profilePicContainer}>
                    <Image
                      source={{uri: profilePic}}
                      style={styles.profilePic}
                    />
                  </View>
                )}
                <View style={styles.profileNameContainer}>
                  <Text style={styles.profileName}>{student.name}</Text>
                </View>
                <Text style={styles.profileText}>
                  Student ID: {student.student_id}
                </Text>
                <Text style={styles.profileText}>
                  Disciplinary Issues: {disciplinaryIssues}
                </Text>
                <Text style={styles.profileText}>
                  Existing Conditions: {existingConditions}
                </Text>
                <Text style={styles.profileText}>GPA: {gpa}</Text>
              </View>
            </View>
            <Text style={styles.profileText}>Module Attendance:</Text>
            <View key={module.module_code} style={styles.moduleContainer}>
              {moduleData.map((module, index) => (
                <View key={module.module_code}>
                  <Text style={styles.profileText}>{module.module_name}</Text>
                  <ProgressBar percentage={module.attendance_percentage} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <BottomTabNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  profileContainer: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  profilePicContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileName: {
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileNameContainer: {
    alignItems: 'center',
    fontSize: 18,
    marginBottom: 5,
    padding: 10,
  },
  moduleContainer: {
    backgroundColor: 'black',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  progressBar: {
    backgroundColor: '#ddd',
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  progress: {
    backgroundColor: 'green',
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  percentageText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
  },
});

export default StudentProfile;
