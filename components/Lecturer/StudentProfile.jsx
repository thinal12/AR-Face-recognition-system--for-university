import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, BackHandler} from 'react-native';
import {serverAddress} from '../config';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from './Header';

const StudentProfile = ({route}) => {
  const {student} = route.params;
  const [moduleData, setModuleData] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

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
        const {modules, module_attendance, profile_pic_base64} =
          await response.json();

        const moduleData = modules.map((module, index) => ({
          ...module,
          attendance_percentage: module_attendance[index],
        }));
        setModuleData(moduleData);

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
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {profilePic && (
            <Image source={{uri: profilePic}} style={styles.profilePic} />
          )}
          <View style={styles.profileDetails}>
            <Text style={styles.profileText}>Name: {student.name}</Text>
            <Text style={styles.profileText}>
              Student ID: {student.student_id}
            </Text>
          </View>
        </View>
        {moduleData.map((module, index) => (
          <View key={module.module_code}>
            <Text style={styles.profileText}>Module: {module.module_name}</Text>
            <Text style={styles.profileText}>
              Attendance Percentage: {module.attendance_percentage.toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a3abff',
    padding: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StudentProfile;
