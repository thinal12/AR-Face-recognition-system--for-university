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
import Orientation from 'react-native-orientation-locker';
import {serverAddress} from '../other/config';

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

  const backHandlerSubscription = useRef(null);
  const dimensionsSubscription = useRef(null);

  const handleBackPress = async () => {
    Orientation.lockToPortrait();
    dimensionsSubscription.current && dimensionsSubscription.current.remove();
    const value = await AsyncStorage.getItem('previousTab');
    await AsyncStorage.setItem('activeTab', value);
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

  const processFrame = async () => {
    if (processing === 'false' && cameraRef.current) {
      processing = 'true';
      console.log(processing);
      const options = {quality: 1, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      const base64Frame = data.base64;

      const maxWidth = data.width / 8;
      const maxHeight = data.height / 8;

      const serverAddress = await AsyncStorage.getItem('serverAddress');

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
            ids: result.ids,
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
    console.log(processing);
  };

  useEffect(() => {
    const frameCaptureInterval = setInterval(() => {
      if (processing === 'false') {
        processFrame();
      }
    }, 1000);

    return () => clearInterval(frameCaptureInterval);
  }, []);

  const handleButtonPress = (id, name, conditions, issues) => {
    navigation.navigate('ARCamera', {id, name, conditions, issues});
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
          <>
            {processedFrame.boxes.map((box, index) => (
              <>
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    flex: 1,
                    flexDirection: 'column',
                    position: 'absolute',
                    height: box[2] - box[0] + 40,
                    width: box[1] - box[3],
                  }}>
                  <Text
                    style={{
                      color:
                        processedFrame.conditions[index] === 'none'
                          ? 'green'
                          : 'red',
                      fontSize: 16,
                      top:
                        orientation === 'landscape'
                          ? box[0] * 0.9
                          : box[0] * 1.2,
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
                        orientation === 'landscape'
                          ? box[0] * 0.9
                          : box[0] * 1.2,

                      left:
                        orientation === 'landscape'
                          ? box[3] * 1.55
                          : box[3] * 0.7,

                      borderWidth: 5,
                      borderColor:
                        processedFrame.conditions[index] === 'none'
                          ? 'green'
                          : 'red',
                      height: box[2] - box[0],
                      width: box[1] - box[3],
                    }}></View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: 'blue',
                      borderRadius: 5,
                      justifyContent: 'center',

                      top:
                        orientation === 'landscape'
                          ? box[0] * 0.9
                          : box[0] * 1.2,
                      left:
                        orientation === 'landscape'
                          ? box[3] * 1.55
                          : box[3] * 0.7,
                    }}
                    onPress={() =>
                      handleButtonPress(
                        processedFrame.ids[index],
                        processedFrame.names[index],
                        processedFrame.conditions[index],
                        processedFrame.issues[index],
                      )
                    }>
                    <Text style={styles.buttonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </>
            ))}
          </>
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
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CameraComponent;
