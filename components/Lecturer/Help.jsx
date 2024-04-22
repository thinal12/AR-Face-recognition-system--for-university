import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

function Help() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Help</Text>
      <Text style={styles.section}>
        1. Recording Attendance using Face Recognition:
      </Text>
      <Text style={styles.description}>
        To record attendance using face recognition, navigate to the attendance
        section and follow the on-screen instructions for scanning student
        faces.
      </Text>
      <Text style={styles.section}>2. Viewing AR Profiles:</Text>
      <Text style={styles.description}>
        Access the AR profile feature to view augmented reality representations
        of student profiles. Simply navigate to the AR profile section and
        select a student.
      </Text>
      <Text style={styles.section}>3. Manually Recording Attendance:</Text>
      <Text style={styles.description}>
        If face recognition isn't available, you can manually record attendance
        by entering student IDs or names in the provided fields.
      </Text>
      <Text style={styles.section}>4. Searching for Student Profiles:</Text>
      <Text style={styles.description}>
        Utilize the search functionality to find specific student profiles.
        Enter the student's name or ID in the search bar to retrieve their
        information.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
});

export default Help;
