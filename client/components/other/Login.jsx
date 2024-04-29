import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverAddress} from './config';
import Orientation from 'react-native-orientation-locker';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const handleLogin = async () => {
    // Input validation
    if (!username || !password) {
      if (!username) {
        setUsernameError('*Please enter your username');
      } else {
        setUsernameError('');
      }
      if (!password) {
        setPasswordError('*Please enter your password');
      } else {
        setPasswordError('');
      }
      return;
    }

    try {
      const response = await fetch(serverAddress + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });
      if (response.ok) {
        const data = await response.json();
        if (username === 'Admin') {
          await AsyncStorage.setItem('lecturerId', data.lecturer_id.toString());
          navigation.navigate('AdminHome');
        } else {
          await AsyncStorage.setItem('lecturerId', data.lecturer_id.toString());
          await AsyncStorage.setItem('activeTab', 'Home');
          await AsyncStorage.setItem('previousTab', 'Home');

          navigation.navigate('Home');
        }
      } else {
        const errorData = await response.json();
        if (errorData && errorData.error === 'IncorrectPassword') {
          setPasswordError('Incorrect password or username');
        } else {
          setPasswordError('*Incorrect password or username');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/LoginBackground.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.pageContainer}>
        <Text style={styles.title}>VisageAR</Text>
        <View style={styles.loginContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              onChangeText={text => {
                setUsername(text);
                setUsernameError('');
              }}
              value={username}
            />
            <Text style={styles.errorText}>{usernameError}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              onChangeText={text => {
                setPassword(text);
                setPasswordError('');
              }}
              value={password}
              secureTextEntry={true}
            />
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
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
  loginContainer: {
    backgroundColor: '#14151a',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D7D9CE',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    color: '#D7D9CE',
  },
  input: {
    width: '100%',
    maxWidth: 165,
    height: 40,
    borderColor: '#D7D9CE',
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#D7D9CE',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#119DA4',
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    padding: 5,
    color: '#D7D9CE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',

    fontSize: 10,
  },
});

export default Login;
