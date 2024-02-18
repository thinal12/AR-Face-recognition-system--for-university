import React, {useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Dimensions} from 'react-native';
import {Orientation} from 'react-native-camera';
import CameraComponent from './components/CameraComponent';
import ARCameraScene from './components/ARCameraScene';
import Login from './components/Login';
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
} from '@viro-community/react-viro';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
