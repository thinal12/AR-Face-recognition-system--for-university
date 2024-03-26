import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function ModuleCard({module, onPress}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(module.module_code)}>
      <Text style={styles.cardText}>
        {module.module_code} - {module.module_name}
      </Text>
    </TouchableOpacity>
  );
}

function Home({route, navigation}) {
  const [modules, setModules] = useState([]);
  const {lecturerId} = route.params;

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      console.log('Lecturer ID:', lecturerId);
      const response = await fetch('http://192.168.205.30:3000/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({lecturerId}),
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data);
        console.log('Modules:', data);
      } else {
        console.error('Failed to fetch modules:', response.status);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleModulePress = modulecode => {
    navigation.navigate('Lectures', {module_code: modulecode});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Modules</Text>
      {modules.map((module, index) => (
        <ModuleCard key={index} module={module} onPress={handleModulePress} />
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

export default Home;
