import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Dimensions} from 'react-native';
import {Orientation} from 'react-native-camera';
import EditAttendance from './components/EditAttendance';
import CameraComponent from './components/CameraComponent';
import ARCameraScene from './components/ARCameraScene';
import Login from './components/Login';
import StudentSearch from './components/StudentSearch';
import Home from './components/Home';
import Lectures from './components/Lectures';
import AttendanceRecord from './components/AttendanceRecord';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentSearch">
        <Stack.Screen
          name="Camera"
          component={CameraComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ARCamera"
          component={ARCameraScene}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AttendanceRecord"
          component={AttendanceRecord}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Lectures"
          component={Lectures}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditAttendance"
          component={EditAttendance}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="StudentSearch"
          component={StudentSearch}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
