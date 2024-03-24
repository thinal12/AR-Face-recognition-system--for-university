import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CameraComponent from './CameraComponent';
import Home from './Home';
import StudentSearch from './StudentSearch';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Camera" component={CameraComponent} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="StudentSearch" component={StudentSearch} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
