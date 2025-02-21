// import React, { useState } from 'react';
// import { Vibration, Text, StyleSheet, Dimensions } from 'react-native';
// import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, interpolate } from 'react-native-reanimated';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');
// const BUTTON_WIDTH = width - 40;
// const BUTTON_HEIGHT = 50;
// const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

// const DownloadButton = ({ text1, text2 }) => {
//   const translateX = useSharedValue(0);
//   const [isStarted, setIsStarted] = useState(false);

//   const panGesture = Gesture.Pan()
//     .onUpdate((event) => {
//       translateX.value = Math.min(Math.max(event.translationX + (isStarted ? SWIPE_RANGE : 0), 0), SWIPE_RANGE);
//     })
//     .onEnd(() => {
//       if (translateX.value > SWIPE_RANGE / 2) {
//         translateX.value = withTiming(SWIPE_RANGE, {}, () => {
//           runOnJS(setIsStarted)(true);
//           runOnJS(Vibration.vibrate)(100);
//         });
//       } else {
//         translateX.value = withTiming(0, {}, () => {
//           runOnJS(setIsStarted)(false);
//           runOnJS(Vibration.vibrate)(100);
//         });
//       }
//     });

//   // Dynamic gradient overlay (Green to Red)
//   const animatedOverlayStyle = useAnimatedStyle(() => ({
//     opacity: interpolate(translateX.value, [0, SWIPE_RANGE], [0, 1]), // Fade-in effect
//   }));

//   // Move button slider smoothly
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateX: translateX.value }],
//   }));

//   // Rotate arrow gradually as button moves
//   const arrowRotation = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${interpolate(translateX.value, [0, SWIPE_RANGE], [0, 180])}deg` }],
//   }));

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <LinearGradient
//         colors={['#007FFF', '#6CB4EE']}
//         start={{ x: 0, y: 0.5 }}
//         end={{ x: 1, y: 0.5 }}
//         style={styles.button}
//       >

//         <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
//           <LinearGradient
//             colors={['#C6011F', '#E25822']}
//             start={{ x: 0, y: 0.5 }}
//             end={{ x: 1, y: 0.5 }}
//             style={styles.button}
//           />
//         </Animated.View>

//         <GestureDetector gesture={panGesture}>
//           <Animated.View style={[styles.slider, animatedStyle]}>
//             <Animated.View style={arrowRotation}>
//               <Icon name="chevron-forward" size={24} color="#fff" />
//             </Animated.View>
//           </Animated.View>
//         </GestureDetector>
//         <Text style={styles.text}>{isStarted ? text1 : text2}</Text>
//       </LinearGradient>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 2,
//     width: '100%',
//     alignItems: 'center',
//   },
//   button: {
//     width: BUTTON_WIDTH,
//     height: BUTTON_HEIGHT,
//     borderRadius: BUTTON_HEIGHT * 0.5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject, // Covers full button
//     borderRadius: BUTTON_HEIGHT / 2,
//   },
//   slider: {
//     width: BUTTON_HEIGHT,
//     height: BUTTON_HEIGHT,
//     borderRadius: BUTTON_HEIGHT * 0.5,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     position: 'absolute',
//     left: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.26)',
//   },
//   text: {
//     color: 'white',
//     fontSize: 14,
//     fontFamily: 'Raleway-Bold',
//   },
// });

// export default DownloadButton;
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Vibration,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 40;
const BUTTON_HEIGHT = 50;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const DownloadButton = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDownloading, setIsDownloading] = useState(false);

  const startDownload = () => {
    setIsDownloading(true);
    Vibration.vibrate(100);
    setTimeout(() => {
      setIsDownloading(false);
      resetButton();
    }, 3000);
  };

  const resetButton = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= SWIPE_RANGE) {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_RANGE / 2) {
          Animated.timing(translateX, {
            toValue: SWIPE_RANGE,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            startDownload();
          });
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const arrowRotation = translateX.interpolate({
    inputRange: [0, SWIPE_RANGE],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#007FFF", "#6CB4EE"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.track}
      >
        <Animated.View
          style={[styles.button, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
            <Icon name="chevron-forward" size={24} color="#fff" />
          </Animated.View>
        </Animated.View>
        <Text style={styles.text}>{isDownloading ? "Downloading" : "Download Attendance"}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute", 
    bottom: 4,
  },
  track: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  button: {
    width: BUTTON_HEIGHT,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
  },
});

export default DownloadButton;

