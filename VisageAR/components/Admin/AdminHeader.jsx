import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminHeader = () => {
  const navigation = useNavigation();

  const handleHelpPress = async () => {
    await AsyncStorage.setItem('activeTab', 'AdminHelp');
    navigation.navigate('AdminHelp');
  };

  const handleLogoutPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/logo8.jpg')}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.headerText}>VisageAR</Text>
      </View>
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
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'black',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
});

export default AdminHeader;
