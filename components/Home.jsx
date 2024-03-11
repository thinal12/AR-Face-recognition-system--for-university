// Home.js

import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-elements';

function Home({route}) {
  const navigation = useNavigation();

  const {lecturerId} = route.params;

  return <View style={styles.container}></View>;
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
