import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useNavigation, useRoute} from '@react-navigation/native';
import {serverAddress} from '../config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text style={styles.errorText}>
          Something went wrong. Please try again.
        </Text>
      );
    }

    return this.props.children;
  }
}

const AttendanceRecord = () => {
  const route = useRoute();
  const [processedFrame, setProcessedFrame] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');
  const [recordedNames, setRecordedNames] = useState([]);

  let processing = 'false';
  const {lecture_id} = route.params;

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
    if (processing === 'false' && cameraRef.current) {
      processing = 'true';
      const options = {quality: 1, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      const base64Frame = data.base64;

      const maxWidth = data.width / 8;
      const maxHeight = data.height / 8;

      try {
        const response = await fetch(serverAddress + '/process-frame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base64Frame,
            width: maxWidth,
            height: maxHeight,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.names && result.boxes) {
          setProcessedFrame({
            names: result.names,
            boxes: result.boxes,
            conditions: result.conditions,
            issues: result.issues,
          });
        } else {
          console.log(result.names);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
      processing = 'false';
    }
  };

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      if (processing === 'false') {
        processFrame();
      }
    }, 1000);

    return () => clearInterval(frameCaptureInterval);
  }, []);

  const handleRecordNames = () => {
    if (processedFrame && processedFrame.names) {
      const uniqueNames = new Set(recordedNames);
      processedFrame.names.forEach(name => uniqueNames.add(name));
      setRecordedNames(Array.from(uniqueNames));
      console.log(lecture_id);
      console.log(recordedNames);
    }
  };

  const handleConfirmAttendance = async () => {
    try {
      const response = await fetch(serverAddress + '/confirm-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lecture_id,
          recorded_names: recordedNames,
        }),
      });

      if (response.ok) {
        console.log('Attendance confirmed successfully');
      } else {
        console.error('Failed to confirm attendance:', response.status);
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
    }
  };

  return (
    <ErrorBoundary>
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
                  position: 'relative ',
                  top: orientation === 'landscape' ? box[0] : box[0],
                  left: orientation === 'landscape' ? box[3] : box[3],
                  right: orientation === 'landscape' ? box[3] : box[3],
                  bottom: orientation === 'landscape' ? box[3] : box[3],
                  height: box[2] - box[0],
                  width: box[1] - box[3],
                  borderWidth: 5,
                  borderColor:
                    processedFrame.conditions[index] === 'none'
                      ? 'green'
                      : 'red',
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
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecordNames}>
          <Text style={styles.buttonText}>Record Names</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmAttendance}>
          <Text style={styles.buttonText}>Confirm Attendance</Text>
        </TouchableOpacity>
      </View>
    </ErrorBoundary>
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
  recordButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AttendanceRecord;