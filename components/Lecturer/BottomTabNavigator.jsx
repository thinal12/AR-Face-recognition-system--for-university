import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTabBar = () => {
  const navigation = useNavigation();
  const [home, setHome] = useState(require('../images/Home.png'));
  const [search, setSearch] = useState(require('../images/Search.png'));
  const [ar, setAR] = useState(require('../images/AR.png'));

  const handleTabPress = async tabName => {
    const value = await AsyncStorage.getItem('activeTab');

    console.log('Active tab:', value);
    if (value === tabName) {
      return;
    } else {
      console.log('Active tab:', tabName);
      await AsyncStorage.setItem('previousTab', value);
      await AsyncStorage.setItem('activeTab', tabName);
      navigation.navigate(tabName);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('Home')}>
        <Image source={home} style={styles.tabIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('StudentSearch')}>
        <Image source={search} style={styles.tabIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton]}
        onPress={() => handleTabPress('Camera')}>
        <Image source={ar} style={styles.tabIcon} />
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
    backgroundColor: '#14151a',
    height: 85,
  },
  tabIcon: {
    width: 125,
    height: 80,
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
