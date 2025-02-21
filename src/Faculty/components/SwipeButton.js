import React, {useState} from 'react';
import {Vibration, Text, StyleSheet, Dimensions} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
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

const {width} = Dimensions.get('window');
const BUTTON_WIDTH = width - 10;
const BUTTON_HEIGHT = 60;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const SwipeButton = ({ setIsSwipeActive }) => {
  const translateX = useSharedValue(0);
  const [isStarted, setIsStarted] = useState(false);

  const onGestureEvent = event => {
    const newTranslateX = Math.min(
      Math.max(
        event.nativeEvent.translationX + (isStarted ? SWIPE_RANGE : 0),
        0,
      ),
      SWIPE_RANGE,
    );
    translateX.value = newTranslateX;
  };

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === 5) {
      if (translateX.value > SWIPE_RANGE / 2) {
        translateX.value = withTiming(SWIPE_RANGE, {}, () => {
          runOnJS(setIsStarted)(true);
          runOnJS(setIsSwipeActive)(true);
          runOnJS(Vibration.vibrate)(100);
        });
      } else {
        translateX.value = withTiming(0, {}, () => {
          runOnJS(setIsStarted)(false);
          runOnJS(setIsSwipeActive)(false);
          runOnJS(Vibration.vibrate)(100);
        });
      }
    }
  };

  // Dynamic gradient overlay (Green to Red)
  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_RANGE], [0, 1]), // Fade-in effect
  }));

  // Move button slider smoothly
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  // Rotate arrow gradually as button moves
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

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={[styles.slider, animatedStyle]}>
            <Animated.View style={arrowRotation}>
              <Icon name="chevron-forward" size={24} color="#fff" />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <Text style={styles.text}>{isStarted ? "Stop Attendance" : "Start Attendance"}</Text>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 2,
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
    // borderTopRightRadius: BUTTON_HEIGHT * 0.5,
    // borderBottomRightRadius: BUTTON_HEIGHT * 0.5,
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
    // zIndex: 1, // Keeps text visible above the overlay
  },
});

export default SwipeButton;
