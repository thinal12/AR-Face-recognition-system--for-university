import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  const handleHelpPress = () => {
    navigation.navigate('Help');
  };

  const handleLogoutPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>VisageAR</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleHelpPress}>
          <Text style={{color: 'white'}}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogoutPress}>
          <Text style={{color: 'white', marginLeft: 10}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#14151a',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
});

export default Header;
