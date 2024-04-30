import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Dimensions,
  ImageBackground,
  Button,
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
        source={require('../images/Background10.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.pageContainer}>
          <Text style={styles.title}>Admin Home</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              <Button
                title="Create Lecturer"
                onPress={handleCreateLecturer}
                style={styles.button}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Create Module"
                onPress={handleCreateModule}
                style={styles.button}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Add Student"
                onPress={handleAddStudent}
                style={styles.button}
              />
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginBottom: 20,
    width: 150,
    height: 50,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 5,
  },
  buttonText: {
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHome;
