import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Dimensions} from 'react-native';
import {Orientation} from 'react-native-camera';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AdminHome from './components/AdminHome';
import CreateModule from './components/CreateModule';
import EditAttendance from './components/EditAttendance';
import CameraComponent from './components/CameraComponent';
import ARCameraScene from './components/ARCameraScene';
import Login from './components/Login';
import StudentSearch from './components/StudentSearch';
import StudentProfile from './components/StudentProfile';
import Home from './components/Home';
import Lectures from './components/Lectures';
import AttendanceRecord from './components/AttendanceRecord';
import AddStudent from './components/AddStudent';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
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
        <Stack.Screen
          name="StudentProfile"
          component={StudentProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateModule"
          component={CreateModule}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddStudent"
          component={AddStudent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
