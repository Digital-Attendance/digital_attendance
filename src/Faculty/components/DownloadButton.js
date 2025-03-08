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
import BASE_URL from "../../../url";
import Snackbar from "react-native-snackbar";
import axios from "axios";
import { useUserContext } from "../../Context";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width - 40;
const BUTTON_HEIGHT = 50;
const SWIPE_RANGE = BUTTON_WIDTH - BUTTON_HEIGHT;

const DownloadButton = ({subjectID}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isDownloading, setIsDownloading] = useState(false);
  const {userEmail} = useUserContext();
  
  const handleEmailAttendance = async () => {    
    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/email-attendance`,{
          subjectID,
          email: userEmail,
        },{
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      
      if (response.status === 200) {
        Snackbar.show({
          text: "Attendance report sent successfully",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error) {
      Snackbar.show({
        text: "Failed to send attendance report",
        duration: Snackbar.LENGTH_SHORT
      });
    }
    resetButton();
  };

  const startDownload = () => {
    setIsDownloading(true);
    Vibration.vibrate(100);
    handleEmailAttendance();
    setIsDownloading(false);
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
        <Text style={styles.text}>{isDownloading ? "Emailing" : "Email Attendance"}</Text>
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

