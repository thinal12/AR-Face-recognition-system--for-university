import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';

const CameraComponent = () => {
  const [processedFrame, setProcessedFrame] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const getOrientation = () => {
      const {width, height} = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    Dimensions.addEventListener('change', getOrientation);
    return () => {
      Dimensions.removeEventListener('change', getOrientation);
    };
  }, []);

  const processFrame = async () => {
    if (cameraRef.current) {
      const options = {quality: 1, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      const base64Frame = data.base64;

      const maxWidth = data.width / 8;
      const maxHeight = data.width / 8;

      try {
        const response = await fetch(
          'http://192.168.76.30:3000/process-frame',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              base64Frame,
              width: maxWidth,
              height: maxHeight,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.names && result.boxes) {
          setProcessedFrame({
            uri: `data:image/jpeg;base64,${base64Frame}`,
            names: result.names,
            boxes: result.boxes,
            conditions: result.conditions,
          });
          console.log(result);
        } else {
          console.log(result.names);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    }
  };

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      processFrame();
    }, 1000);

    return () => clearInterval(frameCaptureInterval);
  }, []);

  const handleButtonPress = name => {
    navigation.navigate('ARCamera', {name: name});
  };

  const renderButtons = () => {
    if (!processedFrame) return null;

    return processedFrame.boxes.map((box, index) => {
      const buttonPosition = {
        top: box[0] * 1.2,
        left: (box[3] * 0.6 + box[1] * 0.6) / 2,
        height: 15,
        width: 30,
      };

      return (
        <TouchableOpacity
          key={index}
          style={[styles.button, buttonPosition]}
          onPress={() => handleButtonPress(processedFrame.names[index])}>
          <Text style={styles.buttonText}>{processedFrame.names[index]}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => {
          cameraRef.current = ref;
        }}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />

      {processedFrame && (
        <View style={styles.overlay}>
          {processedFrame.boxes.map((box, index) => (
            <View
              key={index}
              style={{
                top: orientation === 'landscape' ? box[0] * 0.8 : box[0] * 1.2,
                left:
                  orientation === 'landscape' ? box[3] * 1.55 : box[3] * 0.6,
                height: box[2] - box[0],
                width: box[1] - box[3],
                borderWidth: 5,
                borderColor:
                  processedFrame.conditions[index] === 'none' ? 'green' : 'red',
              }}>
              <Text
                style={{
                  color:
                    processedFrame.conditions[index] === 'none'
                      ? 'green'
                      : 'red',
                  fontSize: 16,
                }}>
                {processedFrame.names[index]}
              </Text>
            </View>
          ))}
          {renderButtons()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CameraComponent;
