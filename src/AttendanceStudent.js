import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  ActivityIndicator,
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { FontAwesome5 } from "react-native-vector-icons";
import { useUserContext } from "./Context";
import Camera from "./Camera";

const BASE_URL = process.env.BASE_URL;

const AttendanceStudent = ({ navigation }) => {
  const { userData } = useUserContext();
  const { username } = userData;

  const [location, setLocation] = useState({ lat: 0, long: 0 });
  const [serverLocation, setServerLocation] = useState({ lat: 0, long: 0, subject: null });
  const [valid, setValid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarked, setIsMarked] = useState(null);

  const locationRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    fetchLocationData();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startLocationTracking();
      } else {
        console.warn("Location permission denied");
        setValid(false);
      }
    } catch (err) {
      console.error("Permission error:", err);
    }
  };

  const startLocationTracking = () => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, long: longitude });
        validateLocation(latitude, longitude);
      },
      (error) => console.error("Location error:", error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );
  };

  const fetchLocationData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (data.latitude && data.longitude) {
        setServerLocation({ lat: data.latitude, long: data.longitude, subject: data.subject });
        setIsMarked(data);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setIsLoading(false);
    }
  };

  const validateLocation = (lat, long) => {
    if (
      Math.abs(lat - serverLocation.lat) <= 0.0005 &&
      Math.abs(long - serverLocation.long) <= 0.0005
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : valid ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>FACE RECOGNITION</Text>
          <Camera navigation={navigation} subject={serverLocation.subject} />
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-triangle" size={24} color="red" />
          {isMarked == null ? (
            <Text style={styles.errorText}>You have already marked your attendance</Text>
          ) : (
            <Text style={styles.errorText}>Try verifying in the proper location</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fbfbfe",
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  successContainer: {
    alignItems: "center",
  },
  successText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
});

export default AttendanceStudent;
