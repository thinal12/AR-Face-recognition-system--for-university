import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import {serverAddress} from '../other/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

function LecturesCard({lecture, onPress}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{lecture.title}</Text>
      <TouchableOpacity
        style={[
          styles.markAttendanceButton,
          lecture.attendance_status === 'Confirmed'
            ? styles.editAttendanceButton
            : styles.markAttendanceButton,
        ]}
        onPress={() => onPress(lecture.lecture_id, lecture.attendance_status)}>
        <Text style={styles.markAttendanceText}>
          {lecture.attendance_status === 'Confirmed'
            ? 'Edit Attendance'
            : 'Mark Attendance'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function Lectures() {
  const [lectures, setLectures] = useState([]);
  const navigation = useNavigation();
  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('previousTab');
    if (value === 'StudentSearch') {
      await AsyncStorage.setItem('activeTab', 'Home');
      navigation.navigate('Home');
      return true;
    } else {
      await AsyncStorage.setItem('activeTab', value);
      navigation.navigate(value);
      return true;
    }
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
    const fetchModules = async () => {
      try {
        const module = await AsyncStorage.getItem('moduleCode');
        console.log('Module:', module);
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
          Alert.alert('❗Failed to fetch lectures');
        }
      } catch (error) {
        Alert.alert('❗Error fetching lectures');
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchModules);

    return unsubscribe;
  }, [navigation]);

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
    color: 'black',
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
