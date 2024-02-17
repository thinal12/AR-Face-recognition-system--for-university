import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
  ViroBox,
  ViroARCamera,
} from '@viro-community/react-viro';

const ProfileAR = ({name}) => {
  const [textPosition, setTextPosition] = useState([0, 0, -1]);
  const [boxPosition, setBoxPosition] = useState([0, 0, -1]);
  const [student, setStudent] = useState({
    name: name,
    existingConditions: 'none',
    disciplinaryIssues: 'yes',
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
  console.log(name);
  return (
    <ViroARScene>
      <ViroText
        text={`Name: ${student.name}\nExisting Conditions: ${student.existingConditions}\nDisciplinary Issues: ${student.disciplinaryIssues}`}
        scale={[0.5, 0.5, 0.5]}
        position={[0, -0.5, -1]}
      />
    </ViroARScene>
  );
};

const ARCameraScene = ({route}) => {
  const name = route.params.name;

  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: () => <ProfileAR name={name} />,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default ARCameraScene;
