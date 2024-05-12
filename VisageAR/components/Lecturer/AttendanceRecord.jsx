import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {serverAddress} from '../other/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

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

let recordedNames = [];

const AttendanceRecord = () => {
  const route = useRoute();
  const [processedFrame, setProcessedFrame] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');

  let processing = 'false';
  const {lecture_id} = route.params;

  const backHandlerSubscription = useRef(null);
  const dimensionsSubscription = useRef(null);

  const handleBackPress = async () => {
    Orientation.lockToPortrait();
    recordedNames = [];
    dimensionsSubscription.current && dimensionsSubscription.current.remove();
    navigation.goBack();
    return true;
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

  useEffect(() => {
    let isMounted = true;

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
            if (isMounted) {
              setProcessedFrame({
                names: result.names,
                boxes: result.boxes,
                conditions: result.conditions,
                issues: result.issues,
              });
            }
          } else {
            console.log(result.names);
          }
        } catch (error) {
          console.error('Fetch error:', error.message);
        }
        processing = 'false';
      }
    };

    const frameCaptureInterval = setInterval(() => {
      if (processing === 'false') {
        processFrame();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(frameCaptureInterval);
    };
  }, []);

  const handleRecordNames = () => {
    if (processedFrame && processedFrame.names) {
      processedFrame.names.forEach(name => {
        if (!recordedNames.includes(name)) {
          recordedNames.push(name);
        }
      });
    }
    console.log(recordedNames);
  };

  const handleConfirmAttendance = async () => {
    if (recordedNames.length === 0) {
      alert('❗No recorded names to confirm attendance.');
      console.log('No recorded names to confirm attendance.');
      return;
    }

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
      recordedNames = [];
      await AsyncStorage.setItem('activeTab', 'Lectures');
      dimensionsSubscription.current && dimensionsSubscription.current.remove();
      navigation.navigate('Lectures');
      if (response.ok) {
        console.log('Attendance confirmed successfully');
        alert('✅ Attendance edited successfully');
      } else {
        console.error('Failed to confirm attendance:', response.status);
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
    }
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
        <>
          {processedFrame.boxes.map((box, index) => {
            let boxColor = 'green';
            if (
              processedFrame.issues[index] !== 'none' &&
              processedFrame.conditions[index] !== 'none'
            ) {
              boxColor = 'blue';
            } else if (
              processedFrame.issues[index] !== 'none' &&
              processedFrame.conditions[index] === 'none'
            ) {
              boxColor = 'red';
            } else if (
              processedFrame.issues[index] === 'none' &&
              processedFrame.conditions[index] !== 'none'
            ) {
              boxColor = 'yellow';
            }

            return (
              <View key={index} style={{...StyleSheet.absoluteFillObject}}>
                <Text
                  style={{
                    color: boxColor,
                    fontSize: 16,
                    top:
                      orientation === 'landscape' ? box[0] * 0.9 : box[0] * 1.2,
                    left:
                      orientation === 'landscape'
                        ? box[3] * 1.55
                        : box[3] * 0.7,
                  }}>
                  {processedFrame.names[index]}
                </Text>
                <View
                  style={{
                    top:
                      orientation === 'landscape' ? box[0] * 0.9 : box[0] * 1.2,
                    left:
                      orientation === 'landscape'
                        ? box[3] * 1.55
                        : box[3] * 0.7,
                    borderWidth: 5,
                    borderColor: boxColor,
                    height: box[2] - box[0],
                    width: box[1] - box[3],
                  }}
                />
              </View>
            );
          })}
        </>
      )}

      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          Students Recorded: {recordedNames.length}
        </Text>
      </View>

      <TouchableOpacity style={styles.recordButton} onPress={handleRecordNames}>
        <Text style={styles.buttonText}>Record Names</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmAttendance}>
        <Text style={styles.buttonText}>Confirm Attendance</Text>
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
  countContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  countText: {
    color: 'white',
    fontSize: 14,
  },
});

export default AttendanceRecord;
