import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const StudentProfile = ({route}) => {
  const {student} = route.params;
  const [moduleData, setModuleData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          'http://192.168.205.30:3000/get-studentattendance',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({student_id: student.student_id}),
          },
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const {modules, module_attendance} = await response.json();

        const moduleData = modules.map((module, index) => ({
          ...module,
          attendance_percentage: module_attendance[index],
        }));
        setModuleData(moduleData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [student]);

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Name: {student.name}</Text>
      <Text style={styles.profileText}>Student ID: {student.student_id}</Text>

      {moduleData.map((module, index) => (
        <View key={module.module_code}>
          <Text style={styles.profileText}>Module: {module.module_name}</Text>
          <Text style={styles.profileText}>
            Attendance Percentage: {module.attendance_percentage.toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StudentProfile;
