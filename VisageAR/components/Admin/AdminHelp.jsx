import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AdminHeader from './AdminHeader';

function AdminHelp() {
  const navigation = useNavigation();

  const handleBackPress = async () => {
    navigation.goBack();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  function renderInstructions() {
    return (
      <>
        <Text style={styles.heading}>Admin Functionalities:</Text>
        <Text style={styles.section}>1. Add a new student</Text>
        <Text style={styles.section}>2. Add a lecturer</Text>
        <Text style={styles.section}>3. Create modules</Text>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Help</Text>
          <Text style={styles.heading}>Admin Functionalities:</Text>
          <Text style={styles.section}>Add a new student</Text>
          <Text style={styles.section}>Add a lecturer</Text>
          <Text style={styles.section}>Create modules</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  heading: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
});

export default AdminHelp;
