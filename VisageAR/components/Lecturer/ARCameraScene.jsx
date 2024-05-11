import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, BackHandler, Dimensions} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroImage,
  ViroButton,
} from '@viro-community/react-viro';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Orientation from 'react-native-orientation-locker';

ViroMaterials.createMaterials({
  profile: {
    diffuseColor: 'black',
  },
  buttonBackground: {
    diffuseColor: 'gray',
  },
  buttonText: {
    diffuseColor: 'white',
  },
});

const ARCameraScene = ({route}) => {
  const id = route.params.id;
  const name = route.params.name;
  const conditions = route.params.conditions;
  const issues = route.params.issues;
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');

  const backHandlerSubscription = useRef(null);
  const dimensionsSubscription = useRef(null);

  const handleBackPress = async () => {
    try {
      dimensionsSubscription.current && dimensionsSubscription.current.remove();
      const value = await AsyncStorage.getItem('previousTab');
      await AsyncStorage.setItem('activeTab', 'Home');
      Orientation.lockToPortrait();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error handling back press:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      backHandlerSubscription.current = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandlerSubscription.current &&
          backHandlerSubscription.current.remove();
      };
    }, []),
  );

  useEffect(() => {
    Orientation.unlockAllOrientations();
    const getOrientation = () => {
      const {width, height} = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    dimensionsSubscription.current = Dimensions.addEventListener(
      'change',
      getOrientation,
    );
    return () => {
      dimensionsSubscription.current && dimensionsSubscription.current.remove();
    };
  }, []);
  const ProfileAR = ({id, name, conditions, issues}) => {
    const [textPosition, setTextPosition] = useState([0, 0, -1]);
    const [boxPosition, setBoxPosition] = useState([0, 0, -1]);
    const navigation = useNavigation();
    const [student, setStudent] = useState({
      student_id: id,
      name: name,
      existingConditions: conditions,
      disciplinaryIssues: issues,
    });

    const handleCameraTransformUpdate = transform => {
      const cameraPosition = transform.cameraTransform.position;

      setBoxPosition(cameraPosition);
      setTextPosition([
        cameraPosition[0],
        cameraPosition[1] + 0.55,
        cameraPosition[2] - 2,
      ]);
    };

    return (
      <ViroARScene style={{alignItems: 'center'}}>
        <ViroBox
          position={[0, -0.7, -1.5]}
          scale={[0.8, 0.7, 0.1]}
          materials={['profile']}
        />
        <ViroText
          text={`Student ID: ${student.student_id} \n\nName: ${student.name}\n\nConditions: ${student.existingConditions}\n\nDisciplinary Issues: ${student.disciplinaryIssues}`}
          scale={[0.5, 0.3, 1]}
          position={[0, -0.55, -1]}
          style={{
            fontSize: 9,
            color: '#ffffff',
            height: 2,
            width: 1,
            fontStyle: 'italic',
          }}
        />
        <ViroButton
          position={[0, -0.65, -1]}
          scale={[0.2, 0.2, 0.2]}
          onClick={async () => {
            Orientation.lockToPortrait();
            dimensionsSubscription.current &&
              dimensionsSubscription.current.remove();
            await AsyncStorage.setItem('activeTab', 'StudentProfile');
            navigation.navigate('StudentProfile', {student: student});
          }}
          height={0.4}
          materials={['buttonBackground']}
        />
        <ViroText
          text="More...."
          position={[0, -0.6, -0.9]}
          scale={[0.1, 0.1, 0.1]}
          style={styles.buttonText}
        />
      </ViroARScene>
    );
  };
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: () => (
          <>
            <ProfileAR
              id={id}
              name={name}
              conditions={conditions}
              issues={issues}
            />
          </>
        ),
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {},
  buttonText: {
    fontSize: 40,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ARCameraScene;
