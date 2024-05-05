import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {serverAddress} from '../other/config';
import Header from '../Lecturer/Header';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsBottomNavVisible(false);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsBottomNavVisible(true);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('previousTab');
    if (value === 'StudentSearch') {
      await AsyncStorage.setItem('activeTab', 'Home');
      navigation.navigate('Home');
      return true;
    } else {
      await AsyncStorage.setItem('activeTab', value);
      navigation.navigate(value);
      return true;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  const handleSearch = async query => {
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

  const handleCardPress = async student => {
    await AsyncStorage.setItem('activeTab', 'StudentProfile');
    navigation.navigate('StudentProfile', {student: student});
  };

  return (
    <>
      <Header />
      <ImageBackground
        source={require('../images/Background10.jpg')}
        style={styles.backgroundImage}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View styles>
            <TextInput
              style={{
                backgroundColor: 'black',
                height: 40,
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
        </KeyboardAvoidingView>
      </ImageBackground>
      {isBottomNavVisible && <BottomTabNavigator styles={styles.bottomNav} />}
    </>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
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
