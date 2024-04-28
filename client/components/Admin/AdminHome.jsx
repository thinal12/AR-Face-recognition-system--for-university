import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Lecturer/Header';
import React, {useEffect} from 'react';

const AdminHome = ({navigation}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove();
  }, []);
  const handleBackPress = () => {
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
  };
  const handleCreateLecturer = async () => {
    await AsyncStorage.setItem('activeTab', 'CreateLecturer');
    navigation.navigate('CreateLecturer');
  };

  const handleCreateModule = async () => {
    await AsyncStorage.setItem('activeTab', 'CreateModule');
    navigation.navigate('CreateModule');
  };
  const handleAddStudent = async () => {
    await AsyncStorage.setItem('activeTab', 'AddStudent');
    navigation.navigate('AddStudent');
  };

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/Background.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.pageContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateLecturer}>
              <Text style={styles.buttonText}>Create Lecturer</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateModule}>
              <Text style={styles.buttonText}>Create Module</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
              <Text style={styles.buttonText}>Add Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#119DA4',
    width: 150,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHome;
