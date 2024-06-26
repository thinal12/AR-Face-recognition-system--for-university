import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTabBar = () => {
  const navigation = useNavigation();
  const [home, setHome] = useState(require('../images/Home2.png'));
  const [search, setSearch] = useState(require('../images/Search2.png'));
  const [ar, setAR] = useState(require('../images/AR2.png'));

  const handleTabPress = async tabName => {
    const value = await AsyncStorage.getItem('activeTab');

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
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 75,
    width: '100%',
  },
  tabIcon: {
    width: 125,
    height: 75,
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
