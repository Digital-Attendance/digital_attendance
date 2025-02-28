import {useNavigation} from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Vibration,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const BUTTON_WIDTH = width - 10;
const BUTTON_HEIGHT = 60;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const AttendanceButton = ({subjectCode}) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(0)).current;
  const [isMarking, setIsMarking] = useState(false);

  const startAttendance = () => {
    setIsMarking(true);
    Vibration.vibrate(100);
    setIsMarking(false);
    resetButton();
    navigation.navigate('LivenessDetection', {subjectCode});
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
            startAttendance();
          });
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const arrowRotation = translateX.interpolate({
    inputRange: [0, SWIPE_RANGE],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#004d4d', '#007a7a']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.track}>
        <Animated.View
          style={[styles.button, {transform: [{translateX}]}]}
          {...panResponder.panHandlers}>
          <Animated.View style={{transform: [{rotate: arrowRotation}]}}>
            <Icon name="chevron-forward" size={24} color="#fff" />
          </Animated.View>
        </Animated.View>
        <Text style={styles.text}>
          {isMarking ? 'Marking Attendance' : 'Mark Attendance'}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT *0.4 ,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: BUTTON_HEIGHT,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.26)',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily : 'Raleway-Bold',
    position: 'absolute',
  },
});

export default AttendanceButton;
