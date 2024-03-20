import React, {useState} from 'react';
import {View, TextInput, FlatList, Text} from 'react-native';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      fetch('http://192.168.205.30:3000/search-students', {
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

  return (
    <View>
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
        renderItem={({item}) => (
          <View style={{margin: 10}}>
            <Text>Name: {item.name}</Text>
            <Text>Student ID: {item.student_id}</Text>
          </View>
        )}
        keyExtractor={item => item.student_id}
      />
    </View>
  );
};

export default StudentSearch;
