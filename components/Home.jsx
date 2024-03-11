import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Home({route}) {
  const [modules, setModules] = useState([]);
  const {lecturerId} = route.params;

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      console.log('Lecturer ID:', lecturerId);
      const response = await fetch('http://192.168.81.30:3000/modules', {
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Modules</Text>
      {modules.map(module => (
        <View key={module.module_id}>
          <Text>
            {module.module_id} - {module.module_name}
          </Text>
        </View>
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
});

export default Home;
