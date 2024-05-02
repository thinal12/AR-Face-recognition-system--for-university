import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const ServerAddressInput = () => {
  const [serverAddress, setServerAddress] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    if (serverAddress.trim() === '') {
      Alert.alert('Error', 'Please enter a valid server address.');
      return;
    }
    try {
      await AsyncStorage.setItem(
        'serverAddress',
        'http://' + serverAddress + ':3000',
      );
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to save server address.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Server Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter server address"
        onChangeText={text => setServerAddress(text)}
        value={serverAddress}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
});

export default ServerAddressInput;
