import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolateColor, interpolate } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 100;
const BUTTON_HEIGHT = 45;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const SwipeButton = () => {
  const translateX = useSharedValue(0);
  const [isStarted, setIsStarted] = useState(false);

  const onGestureEvent = (event) => {
    const newTranslateX = Math.min(Math.max(event.nativeEvent.translationX + (isStarted ? SWIPE_RANGE : 0), 0), SWIPE_RANGE);
    translateX.value = newTranslateX;
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === 5) { // State.END
      if (translateX.value > SWIPE_RANGE / 2) {
        translateX.value = withTiming(SWIPE_RANGE, {}, () => runOnJS(setIsStarted)(true));
      } else {
        translateX.value = withTiming(0, {}, () => runOnJS(setIsStarted)(false));
      }
    }
  };

  // Background color transition
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      translateX.value,
      [0, SWIPE_RANGE], 
      ['#4CAF50', '#FF3B30'] // Green to Red transition
    ),
  }));

  // Move button slider smoothly
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Rotate arrow gradually as button moves
  const arrowRotation = useAnimatedStyle(() => ({
    transform: [{ 
      rotate: `${interpolate(translateX.value, [0, SWIPE_RANGE], [0, 180])}deg` 
    }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.button, backgroundStyle]}>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View style={[styles.slider, animatedStyle]}>
            <Animated.View style={arrowRotation}>
              <Icon name="chevron-forward" size={24} color="#fff" />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <Text style={styles.text}>{isStarted ? 'Stop Attendance' : 'Start Attendance'}</Text>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -60,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  slider: {
    width: BUTTON_HEIGHT,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: '#147df5',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SwipeButton;
