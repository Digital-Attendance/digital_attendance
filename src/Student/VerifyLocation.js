import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {Paragraph, ActivityIndicator, Snackbar} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../../url';

// const THRESHOLD_METERS = 500;

const VerifyLocation = ({route}) => {
  const watchId = useRef(null);
  const {subjectCode} = route.params;
  const [verifying, setVerifying] = useState(true);
  const [locationVerified, setLocationVerified] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  // const [facultyLoc, setFacultyLocation] = useState(null);

  const navigation = useNavigation();

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const fetchFacultyLocation = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/student/faculty-location/${subjectCode}`,
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        // setFacultyLocation(response.data.location);
        return response.data.location;
      } else if (!response.data.success) {
        setErrorMsg('Attendance not started yet');
        setVerifying(false);
        return null;
      }
    } catch (error) {
      setErrorMsg(error.message);
      setVerifying(false);
    }
  };

  const checkGPSStatus = async () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => {
          resolve(true);
        },
        error => {
          resolve(false);
        },
        {enableHighAccuracy: false, timeout: 5000},
      );
    });
  };

  const verifyLocation = async () => {
    const gpsStatus = await checkGPSStatus();
    if (!gpsStatus) {
      setErrorMsg("Please turn on your device's GPS");
      setVerifying(false);
      return;
    }
    const facultyLocation = await fetchFacultyLocation();
    if (!facultyLocation) {
      setErrorMsg('Faculty location not found, Retry !');
      setVerifying(false);
      return;
    }

    setVerifying(true);
    setErrorMsg('');
    setLocationVerified(null);
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
      setVerifying(false);
      return;
    }

    if (!hasPermission) {
      setErrorMsg('Location permission denied');
      setVerifying(false);
      return;
    }

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      
    }
    
    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});

        const distance = getDistanceFromLatLonInMeters(
          facultyLocation.latitude,
          facultyLocation.longitude,
          latitude,
          longitude,
        );

        const isVerified = distance < 16;

        // const isVerified =
        //   Math.abs(facultyLocation.latitude - latitude) < THRESHOLD_METERS &&
        //   Math.abs(facultyLocation.longitude - longitude) < THRESHOLD_METERS;
        console.log('Distance:', distance, 'meters. Location Verified:', isVerified);
        setLocationVerified(isVerified);
        setVerifying(false);

        if (isVerified) {
          setTimeout(() => {
            navigation.replace('LivenessDetection', {subjectCode});
          }, 2000);
        }
      },
      error => {
        setErrorMsg('Location Error: ' + error.message);
        setVerifying(false);
      },
      {enableHighAccuracy: false, distanceFilter: 1},
    );
  };

  useEffect(() => {
    verifyLocation();

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="map-marker" size={30} color="#007FFF" />
        <Text style={styles.title}>Location Verification</Text>
      </View>
      <Text style={styles.subtitle}>
        No worries! We will be checking your location to verify if you're within
        the required range.
      </Text>
      {verifying ? (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator animating={true} color="#005758" size="large" />
          <Text style={styles.statusText}>Verifying your location...</Text>
        </View>
      ) : errorMsg ? (
        <Text style={[styles.statusText, {color: '#F44336'}]}>{errorMsg}</Text>
      ) : locationVerified ? (
        <View style={styles.resultContainer}>
          <Icon name="check-circle-outline" size={50} color="#4CAF50" />
          <Paragraph style={[styles.statusText, {color: '#4CAF50'}]}>
            Location Verified
          </Paragraph>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Icon name="close-circle-outline" size={50} color="#F44336" />
          <Paragraph style={[styles.statusText, {color: '#F44336'}]}>
            You are not in the classroom
          </Paragraph>
        </View>
      )}
      {/* {currentLocation && (
        <View style={styles.locationContainer}>
          <Paragraph style={styles.locationText}>
            Your Location: {currentLocation.latitude.toFixed(6)},{' '}
            {currentLocation.longitude.toFixed(6)}
          </Paragraph>
          <Paragraph style={styles.locationText}>
            Faculty's Location: {facultyLocation.latitude.toFixed(4)},{' '}
            {facultyLocation.longitude.toFixed(6)}
          </Paragraph>
        </View>
      )} */}
      {!verifying && (
        <TouchableOpacity style={styles.recheck} onPress={verifyLocation}>
          <Text style={styles.recheckText}>Re-check Location</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerifyLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Italic',
    textAlign: 'center',
    color: '#ccc',
  },
  verifyingContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  resultContainer: {
    alignItems: 'center',
  },
  locationContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Raleway-SemiBold',
    textAlign: 'center',
  },
  recheck: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#2B8781',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  recheckText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Raleway-Bold',
  },
});
