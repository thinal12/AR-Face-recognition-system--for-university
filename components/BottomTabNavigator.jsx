import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTabBar = () => {
  const navigation = useNavigation();

  const handleTabPress = async tabName => {
    const value = await AsyncStorage.getItem('activeTab');
    console.log('Active tab:', value);
    if (value === tabName) {
      return;
    } else if (tabName === 'Camera') {
      navigation.navigate(tabName);
    } else {
      console.log('Active tab:', tabName);
      await AsyncStorage.setItem('activeTab', tabName);
      navigation.navigate(tabName);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('Home')}>
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('StudentSearch')}>
        <Text>Student Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('Camera')}>
        <Text>AR Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 50,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'gray',
  },
});
