import React, {useState, useRef} from 'react';
import {Vibration, Text, StyleSheet, Dimensions} from 'react-native';
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
  interpolateColor,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import BASE_URL from '../../../url';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Snackbar} from 'react-native-paper';

const {width} = Dimensions.get('window');
const BUTTON_WIDTH = width - 10;
const BUTTON_HEIGHT = 60;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const SwipeButton = ({setIsSwipeActive}) => {
  const translateX = useSharedValue(0);
  const [isStarted, setIsStarted] = useState(false);
  const watchId = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchLocation = async () => {
    setErrorMsg('');
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
      setErrorMsg('Permission error: ' + error.message);
      return;
    }

    if (!hasPermission) {
      setErrorMsg('Location permission denied');
      return;
    }

    console.log('Requesting location update...');
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      console.log('Clearing previous location watch...');
    }

    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        console.log('Current Location:', latitude, longitude);
      },
      error => {
        console.log('Location Error:', error.message);
        setErrorMsg('Location Error: ' + error.message);
      },
      {enableHighAccuracy: false, distanceFilter: 1},
    );
  };

  const startAttendance = async () => {
    await fetchLocation();

    Snackbar.show({
      text: 'Starting attendance...',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#2B8781',
      textColor: '#fff',
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/start-attendance`,
        {email, location: currentLocation},
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
          text: response.data.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
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
    Geolocation.clearWatch(watchId.current);
    watchId.current = null;

    Snackbar.show({
      text: 'Stopping attendance...',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#2B8781',
      textColor: '#fff',
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/stop-attendance`,
        {email},
        {validateStatus: status => status < 500},
      );
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
          // runOnJS(startAttendance)();
          runOnJS(Vibration.vibrate)(100);
        });
      } else {
        translateX.value = withTiming(0, {}, () => {
          runOnJS(setIsStarted)(false);
          runOnJS(setIsSwipeActive)(false);
          // runOnJS(stopAttendance)();
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
