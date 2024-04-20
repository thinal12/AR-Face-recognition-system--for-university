import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
  ImageBackground,
} from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverAddress} from '../other/config';
import Header from './Header';
import Banner1 from '../images/Banner1.jpg';
import Banner2 from '../images/Banner2.jpg';
import Banner3 from '../images/Banner3.jpg';

function ModuleCard({module, onPress, bannerImage}) {
  return (
    <ImageBackground source={bannerImage} style={styles.bannerImage}>
      <TouchableOpacity
        style={[styles.card, styles.moduleContainer]}
        onPress={() => onPress(module.module_code)}>
        <Text style={styles.cardText}>
          {module.module_code} - {module.module_name}
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

function Home({navigation}) {
  const [modules, setModules] = useState([]);
  const [lecturerId, setLecturerId] = useState(null);
  const bannerImages = [Banner1, Banner2, Banner3];

  useEffect(() => {
    retrieveLecturerIdAndFetchModules();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, []);

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

  const handleModulePress = async modulecode => {
    await AsyncStorage.setItem('previousTab', 'Home');
    await AsyncStorage.setItem('activeTab', 'Lectures');
    await AsyncStorage.setItem('moduleCode', modulecode);
    navigation.navigate('Lectures');
  };

  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('activeTab');
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
      return BackHandler.remove();
    }
  };

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/Background3.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Modules</Text>
          </View>
          <View>
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                module={module}
                onPress={handleModulePress}
                bannerImage={bannerImages[index % bannerImages.length]}
              />
            ))}
          </View>
        </View>
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
  },

  headingContainer: {
    paddingTop: 38,
    alignItems: 'center',
    paddingBottom: 10,
  },
  moduleContainer: {
    padding: 20,
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
