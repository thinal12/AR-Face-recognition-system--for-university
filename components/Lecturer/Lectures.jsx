import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import {serverAddress} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

function LecturesCard({lecture, onPress}) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{lecture.title}</Text>
      <TouchableOpacity style={styles.markAttendanceButton}>
        <Text
          style={styles.markAttendanceText}
          onPress={() =>
            onPress(lecture.lecture_id, lecture.attendance_status)
          }>
          {lecture.attendance_status === 'Confirmed'
            ? 'Edit Attendance'
            : 'Mark Attendance'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function Lectures({route}) {
  const [lectures, setLectures] = useState([]);
  const {module_code} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    fetchModules();
  }, []);

  const handleBackPress = () => {
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

  const fetchModules = async () => {
    try {
      const response = await fetch(serverAddress + '/lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({module_code}),
      });
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
        console.log('Modules:', data);
      } else {
        console.error('Failed to fetch lectures:', response.status);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };
  const handleModulePress = async (lectureId, attendance_status) => {
    if (attendance_status === 'Confirmed') {
      await AsyncStorage.setItem('activeTab', 'EditAttendanc');
      navigation.navigate('EditAttendance', {lecture_id: lectureId});
    } else {
      navigation.navigate('AttendanceRecord', {lecture_id: lectureId});
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.heading}>Lectures</Text>
        {lectures.map((lecture, index) => (
          <LecturesCard
            key={index}
            lecture={lecture}
            onPress={handleModulePress}
          />
        ))}
      </View>
      <BottomTabNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: 300,
    padding: 20,
    marginBottom: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
  },
  markAttendanceButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  markAttendanceText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Lectures;