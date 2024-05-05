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
import AdminHeader from './AdminHeader';
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
      <AdminHeader />
      <ImageBackground
        source={require('../images/Background3.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.pageContainer}>
          <View
            styles={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>Admin Home</Text>
          </View>
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
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    paddingBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    alignItems: 'center',
  },
  buttonContainer: {
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
