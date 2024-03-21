import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const StudentProfile = ({route}) => {
  const {student} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Name: {student.name}</Text>
      <Text style={styles.profileText}>Student ID: {student.student_id}</Text>
      <Text style={styles.profileText}>
        Existing Conditions {student.existing_conditions}
      </Text>
      <Text style={styles.profileText}>
        Disciplinary Issues: {student.disciplinary_issues}
      </Text>
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
