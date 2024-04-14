import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverAddress} from '../config';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleBackPress = async () => {
    await AsyncStorage.setItem('activeTab', ' ');
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

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      fetch(serverAddress + '/search-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({searchQuery: query}),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setSearchResults(data);
        })
        .catch(error => {
          console.error('Error searching for students:', error);
        });
    } else {
      setSearchResults([]);
    }
  };

  const renderStudentCard = ({item}) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Name: {item.name}</Text>
        <Text style={styles.cardText}>Student ID: {item.student_id}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleCardPress = student => {
    navigation.navigate('StudentProfile', {student: student});
  };

  return (
    <>
      <View style={styles.container}>
        <View styles>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              margin: 10,
              padding: 5,
            }}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search for students..."
          />
          <FlatList
            data={searchResults}
            renderItem={renderStudentCard}
            keyExtractor={item => item.student_id}
          />
        </View>
      </View>
      <BottomTabNavigator styles={{bottom: 0}} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StudentSearch;