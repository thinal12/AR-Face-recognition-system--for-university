import React from 'react';
import {View, Button, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-elements';

function Home() {
  const navigation = useNavigation();

  const handleButtonClick1 = () => {
    navigation.navigate('Camera');
  };

  const handleButtonClick2 = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleButtonClick1}>
          <Text>Mark attendance</Text>
        </TouchableOpacity>
        <View style={{width: 10}} />
        <TouchableOpacity onPress={handleButtonClick2}>
          <Text>AR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default Home;
