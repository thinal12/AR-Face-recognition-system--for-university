import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function ModuleCard({module}) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>
        {module.module_id} - {module.module_name}
      </Text>
    </TouchableOpacity>
  );
}

function Lectures({route}) {
  const [lectures, setLectures] = useState([]);
  const {module_id} = route.params;

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      console.log('Lecturer ID:', lecturerId);
      const response = await fetch('http://192.168.205.30:3000/lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({module_id}),
      });
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
        console.log('Modules:', data);
      } else {
        console.error('Failed to fetch lectures:', response.status);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Modules</Text>
      {lectures.map((module, index) => (
        <ModuleCard key={index} module={module} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    width: 300,
    padding: 20,
    marginBottom: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
  },
});

export default Lectures;
