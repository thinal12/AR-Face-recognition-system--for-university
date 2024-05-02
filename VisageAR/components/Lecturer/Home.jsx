import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {serverAddress} from '../other/config';
import Header from './Header';
import Orientation from 'react-native-orientation-locker';

function ModuleCard({module}) {
  const navigation = useNavigation();

  const handleModulePress = async modulecode => {
    await AsyncStorage.setItem('previousTab', 'Home');
    await AsyncStorage.setItem('activeTab', 'Lectures');
    await AsyncStorage.setItem('moduleCode', modulecode);
    navigation.navigate('Lectures');
  };

  return (
    <TouchableOpacity
      style={[styles.card, styles.moduleContainer]}
      onPress={() => handleModulePress(module.module_code)}>
      <Text style={styles.cardText}>
        {module.module_code} - {module.module_name}
      </Text>
    </TouchableOpacity>
  );
}

function Home() {
  const [modules, setModules] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);

  useEffect(() => {
    retrieveLecturerIdAndFetchModules();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = async () => {
        Orientation.lockToPortrait();
        const value = await AsyncStorage.getItem('activeTab');
        console.log('Active tab now:', value);
        if (value === 'Home') {
          Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'OK', onPress: () => BackHandler.exitApp()},
            ],
            {cancelable: false},
          );
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  const retrieveLecturerIdAndFetchModules = async () => {
    try {
      const storedLecturerId = await AsyncStorage.getItem('lecturerId');
      setLecturerId(storedLecturerId);
      fetchModules(storedLecturerId);
    } catch (error) {
      console.error('Error retrieving lecturerId:', error);
    }
  };

  const fetchModules = async lecturerId => {
    const serverAddress = await AsyncStorage.getItem('serverAddress');
    try {
      const response = await fetch(serverAddress + '/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({lecturerId}),
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
        console.log('Modules:', data);
      } else {
        console.error('Failed to fetch modules:', response.status);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
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
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>Modules</Text>
            </View>
            <View style={styles.module}>
              {modules.map((module, index) => (
                <ModuleCard key={index} module={module} />
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 70,
  },

  headingContainer: {
    paddingTop: 38,
    alignItems: 'center',
    paddingBottom: 10,
  },
  bannerImage: {
    resizeMode: 'cover',
    paddingBottom: 10,

    width: 300,
  },

  moduleContainer: {
    borderRadius: 10,
  },
  heading: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: 300,
    padding: 20,
    backgroundColor: '#14151a',
    marginBottom: 10,
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
});

export default Home;
