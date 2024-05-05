import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Dimensions} from 'react-native';
import {Orientation} from 'react-native-camera';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AdminHome from './components/Admin/AdminHome';
import CreateModule from './components/Admin/CreateModule';
import CreateLecturer from './components/Admin/CreateLecturer';
import EditAttendance from './components/Lecturer/EditAttendance';
import CameraComponent from './components/Lecturer/CameraComponent';
import ARCameraScene from './components/Lecturer/ARCameraScene';
import Login from './components/other/Login';
import StudentSearch from './components/Lecturer/StudentSearch';
import StudentProfile from './components/Lecturer/StudentProfile';
import Home from './components/Lecturer/Home';
import Lectures from './components/Lecturer/Lectures';
import AttendanceRecord from './components/Lecturer/AttendanceRecord';
import AddStudent from './components/Admin/AddStudent';
import Help from './components/Lecturer/Help';
import ServerAddressInput from './components/other/SeverAddressInput';
import AdminHelp from './components/Admin/AdminHelp';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="ServerAddressInput"
          component={ServerAddressInput}
          options={{headerShown: false}}
        />
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
          name="CreateLecturer"
          component={CreateLecturer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddStudent"
          component={AddStudent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Help"
          component={Help}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminHelp"
          component={AdminHelp}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
