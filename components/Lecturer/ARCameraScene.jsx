import React, {useState} from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroImage,
} from '@viro-community/react-viro';
import AsyncStorage from '@react-native-async-storage/async-storage';

ViroMaterials.createMaterials({
  profile: {
    diffuseColor: 'black',
  },
});

const ProfileAR = ({id, name, conditions, issues}) => {
  const [textPosition, setTextPosition] = useState([0, 0, -1]);
  const [boxPosition, setBoxPosition] = useState([0, 0, -1]);
  const [student, setStudent] = useState({
    id: id,
    name: name,
    existingConditions: conditions,
    disciplinaryIssues: issues,
  });

  const handleCameraTransformUpdate = transform => {
    const cameraPosition = transform.cameraTransform.position;

    setBoxPosition(cameraPosition);
    setTextPosition([
      cameraPosition[0],
      cameraPosition[1] + 0.25,
      cameraPosition[2] - 2,
    ]);
  };

  return (
    <ViroARScene>
      <ViroBox
        position={[0, -0.7, -1.5]}
        scale={[0.8, 0.7, 0.1]}
        materials={['profile']}
      />
      <ViroText
        text={`Student ID: ${student.id}\nName: ${student.name}\nExisting Conditions: ${student.existingConditions}\nDisciplinary Issues: ${student.disciplinaryIssues}`}
        scale={[0.4, 0.3, 0.5]}
        position={[0, -0.5, -1]}
      />
    </ViroARScene>
  );
};

const ARCameraScene = ({route}) => {
  const id = route.params.id;
  const name = route.params.name;
  const conditions = route.params.conditions;
  const issues = route.params.issues;
  const navigation = useNavigation();

  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('previousTab');
    await AsyncStorage.setItem('activeTab', value);
    navigation.navigate(value);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }, []),
  );

  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: () => (
          <ProfileAR
            id={id}
            name={name}
            conditions={conditions}
            issues={issues}
          />
        ),
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {},
});

export default ARCameraScene;
