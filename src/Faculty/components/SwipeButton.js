import React, {useRef, useState} from 'react';
import {Vibration, Text, StyleSheet, Dimensions, Platform} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import BASE_URL from '../../../url';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Snackbar from 'react-native-snackbar';

const {width} = Dimensions.get('window');
const BUTTON_WIDTH = width - 10;
const BUTTON_HEIGHT = 60;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const SwipeButton = ({setIsSwipeActive, subjectCode, userEmail}) => {
  const translateX = useSharedValue(0);
  const [isStarted, setIsStarted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const watchId = useRef(null);

  const checkGPSStatus = async () => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        () => {
          resolve(true);
        },
        error => {
          Snackbar.show({
            text: "Please turn on your device's GPS",
            duration: Snackbar.LENGTH_SHORT,
            textColor: '#fff',
          })
          resolve(false);
        },
        {enableHighAccuracy: false},
      );
    });
  };

  const fetchLocation = async () => {
    setCurrentLocation(null);
    let hasPermission = false;

    try {
      if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result !== RESULTS.GRANTED) {
          const reqResult = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );
          hasPermission = reqResult === RESULTS.GRANTED;
        } else {
          hasPermission = true;
        }
      } else {
        const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result !== RESULTS.GRANTED) {
          const reqResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          hasPermission = reqResult === RESULTS.GRANTED;
        } else {
          hasPermission = true;
        }
      }
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#f00',
      })
      return null;
    }

    if (!hasPermission) {
      Snackbar.show({
        text: 'Location permission denied',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
      })
      return null;
    }

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }

    return new Promise((resolve, reject) => {
      watchId.current = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({latitude, longitude});

          if (watchId.current !== null) {
            Geolocation.clearWatch(watchId.current);
            watchId.current = null;
          }

          resolve({latitude, longitude});
        },
        error => {
          Snackbar.show({
            text: error,
            duration: Snackbar.LENGTH_SHORT,
            textColor: '#fff',
          })
          reject(error);
        },
        {enableHighAccuracy: false, distanceFilter: 1},
      );
    });
  };

  const startAttendance = async () => {
    try {
      const gpsStatus = await checkGPSStatus();
      if (!gpsStatus) {
        translateX.value = withTiming(0);
        runOnJS(setIsStarted)(false);
        runOnJS(setIsSwipeActive)(false);
        return;
      }
      const location = await fetchLocation();
      if (!location) {
        translateX.value = withTiming(0);
        runOnJS(setIsStarted)(false);
        runOnJS(setIsSwipeActive)(false);
        return;
      }

      Snackbar.show({
        text: 'Starting attendance...',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#2B8781',
        textColor: '#fff',
      });

      const response = await axios.post(
        `${BASE_URL}/faculty/start-attendance`,
        {email: userEmail, subjectCode, location: location},
        {validateStatus: status => status < 500},
      );

      if (response.data.success) {
        Snackbar.show({
          text: 'Attendance started successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
      } else {
        Snackbar.show({
          text: response.data.error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
        translateX.value = withTiming(0);
        runOnJS(setIsStarted)(false);
        runOnJS(setIsSwipeActive)(false);
      }
    } catch (error) {
      Snackbar.show({
        text: 'An error occurred while starting attendance!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
  };

  const stopAttendance = async () => {
    setCurrentLocation(null);
    setErrorMsg('');

    Snackbar.show({
      text: 'Stopping attendance...',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#2B8781',
      textColor: '#fff',
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/stop-attendance`,
        {email: userEmail, subjectCode},
        {validateStatus: status => status < 500},
      );

      if (response.data.success) {
        Snackbar.show({
          text: 'Attendance stopped successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
      } else {
        Snackbar.show({
          text: response.data.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: 'An error occurred while stopping attendance!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = Math.min(
        Math.max(event.translationX + (isStarted ? SWIPE_RANGE : 0), 0),
        SWIPE_RANGE,
      );
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_RANGE / 2) {
        translateX.value = withTiming(SWIPE_RANGE, {}, () => {
          runOnJS(setIsStarted)(true);
          runOnJS(setIsSwipeActive)(true);
          runOnJS(startAttendance)();
          runOnJS(Vibration.vibrate)(100);
        });
      } else {
        translateX.value = withTiming(0, {}, () => {
          runOnJS(setIsStarted)(false);
          runOnJS(setIsSwipeActive)(false);
          runOnJS(stopAttendance)();
          runOnJS(Vibration.vibrate)(100);
        });
      }
    });

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_RANGE], [0, 1]),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const arrowRotation = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(
          translateX.value,
          [0, SWIPE_RANGE],
          [0, 180],
        )}deg`,
      },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={['#004d4d', '#007a7a']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.button}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <LinearGradient
            colors={['#C6011F', '#E25822']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={styles.button}
          />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.slider, animatedStyle]}>
            <Animated.View style={arrowRotation}>
              <Icon name="chevron-forward" size={24} color="#fff" />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <Text style={styles.text}>
          {isStarted ? 'Stop Attendance' : 'Start Attendance'}
        </Text>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BUTTON_HEIGHT / 2,
  },
  slider: {
    position: 'absolute',
    left: 0,
    width: BUTTON_HEIGHT,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.26)',
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },
});

export default SwipeButton;
