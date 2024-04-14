import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
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
  const handleCreateLecturer = () => {
    navigation.navigate('CreateLecturer');
  };

  const handleCreateModule = () => {
    navigation.navigate('CreateModule');
  };
  const handleAddStudent = () => {
    navigation.navigate('AddStudent');
  };

  return (
    <>
      <Header />
      <View style={styles.pageContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateLecturer}>
            <Text style={styles.buttonText}>Create Lecturer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCreateModule}>
            <Text style={styles.buttonText}>Create Module</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddStudent}>
            <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#040404',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#119DA4',
    width: 150,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHome;
