import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

const Buttons = ({ fadeAnim }) => {
  const [expanded, setExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(65)).current;

  const toggleButtons = () => {
    if (expanded) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: 65,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(heightAnim, {
            toValue: 200,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      });
    }
  };
  return (
    <Animated.View style={[styles.container,{ opacity: fadeAnim }]}>
      <Animated.View style={[styles.expandableBackground, { height: heightAnim }]} />
      <Animated.View style={[styles.expandButton]}>
        <LottieView
          source={require('../../../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.actionButtonGradientBorder}
        />
        <TouchableOpacity style={styles.actionButton} onPress={toggleButtons}>
          <MaterialCommunityIcons name="note-plus" size={30} color="#fff" />
        </TouchableOpacity>
        {expanded && (
          <>
            <Animated.View
              style={[
                styles.animatedButton,
                {
                  opacity: opacityAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 70],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity style={styles.smallButton}>
                <MaterialCommunityIcons name="shape-square-plus" size={30} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.animatedButton,
                {
                  opacity: opacityAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 140],
                      }),
                    },
                  ],
                },
              ]}>
              <TouchableOpacity style={styles.smallButton}>
                <MaterialCommunityIcons name="delete" size={30} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 3,
  },
  expandButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  expandableBackground: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    width: 65,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  actionButtonGradientBorder: {
    width: 100,
    height: 100,
  },
  actionButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#005758',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedButton: {
    position: 'absolute',
    top: 0,
  },
  smallButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#2f9576',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Buttons;
