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

const AttendanceRecord = () => {
  const [processedFrame, setProcessedFrame] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');
  const [recordedNames, setRecordedNames] = useState([]);

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
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    }
  };

  const handleRecordNames = () => {
    if (processedFrame && processedFrame.names) {
      const uniqueNames = new Set(recordedNames);
      processedFrame.names.forEach(name => uniqueNames.add(name));
      setRecordedNames(Array.from(uniqueNames));
      console.log(recordedNames);
    }
  };

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      processFrame();
    }, 1000);

    return () => clearInterval(frameCaptureInterval);
  }, []);

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
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRecordNames}>
        <Text style={styles.buttonText}>Record Names</Text>
      </TouchableOpacity>
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
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AttendanceRecord;
