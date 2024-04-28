import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import {serverAddress} from '../other/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

function LecturesCard({lecture, onPress}) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{lecture.title}</Text>
      <TouchableOpacity
        style={[
          styles.markAttendanceButton,
          lecture.attendance_status === 'Confirmed'
            ? styles.editAttendanceButton
            : styles.markAttendanceButton,
        ]}>
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

function Lectures() {
  const [lectures, setLectures] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    callFetchModules();
  }, [navigation]);

  const callFetchModules = async () => {
    const module = await AsyncStorage.getItem('moduleCode');
    console.log('Module:', module);
    fetchModules(module);
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = async () => {
        await AsyncStorage.setItem('activeTab', 'Home');
        await AsyncStorage.removeItem('moduleCode');
        navigation.navigate('Home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  const fetchModules = async module => {
    try {
      const response = await fetch(serverAddress + '/lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({module}),
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
      await AsyncStorage.setItem('activeTab', 'EditAttendance');
      navigation.navigate('EditAttendance', {lecture_id: lectureId});
    } else {
      navigation.navigate('AttendanceRecord', {lecture_id: lectureId});
    }
  };

  return (
    <>
      <Header />

      <ImageBackground
        source={require('../images/Background10.jpg')}
        style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Lectures</Text>
              </View>
              {lectures.map((lecture, index) => (
                <LecturesCard
                  key={index}
                  lecture={lecture}
                  onPress={handleModulePress}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      <BottomTabNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 70,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  heading: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headingContainer: {
    paddingTop: 38,
    alignItems: 'center',
    paddingBottom: 10,
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
  markAttendanceButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editAttendanceButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  markAttendanceText: {
    color: 'white',
    fontSize: 14,
  },
  lectureContainer: {},
});

export default Lectures;
