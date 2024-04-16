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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const CameraComponent = () => {
  const [processedFrame, setProcessedFrame] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [orientation, setOrientation] = useState('portrait');
  let processing = 'false';

  const handleBackPress = async () => {
    const value = await AsyncStorage.getItem('previousTab');
    await AsyncStorage.setItem('activeTab', value);
    navigation.goBack();
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

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
          console.log(result.names);
        } else {
          console.log(result.names);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    }
    processing = 'false';
  };

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      if (processing === 'false') {
        processFrame();
      }
    }, 1000);

    return () => clearInterval(frameCaptureInterval);
  }, []);

  const handleButtonPress = (name, conditions) => {
    navigation.navigate('ARCamera', {name, conditions});
  };
  const renderButtons = () => {
    if (!processedFrame) return null;

    return processedFrame.boxes.map((box, index) => {
      const buttonPosition = {
        position: 'absolute',
        top: box[0] * 1.2,
        left: (box[3] * 0.6 + box[0] * 0.6) / 2,
        height: 15,
        width: 30,
      };

      return (
        <TouchableOpacity
          key={index}
          style={[styles.button, buttonPosition]}
          onPress={() =>
            handleButtonPress(
              processedFrame.names[index],
              processedFrame.conditions[index],
            )
          }>
          <Text style={styles.buttonText}>{processedFrame.names[index]}</Text>
        </TouchableOpacity>
      );
    });
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
                  position: 'static',
                  top:
                    orientation === 'landscape' ? box[0] * 0.8 : box[0] * 1.2,
                  left:
                    orientation === 'landscape' ? box[3] * 1.55 : box[3] * 0.6,
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
            {renderButtons()}
          </View>
        )}
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
