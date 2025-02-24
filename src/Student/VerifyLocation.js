import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';

const FIXED_LOCATION = {
  latitude: 24.7565,
  longitude: 92.7804,
};

const THRESHOLD_METERS = 0.01;

const VerifyLocation = () => {
  const watchId = useRef(null);
  const [verifying, setVerifying] = useState(true);
  const [locationVerified, setLocationVerified] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const navigation = useNavigation();

  const verifyLocation = async () => {
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

        const isVerified =
          Math.abs(FIXED_LOCATION.latitude - latitude) < THRESHOLD_METERS &&
          Math.abs(FIXED_LOCATION.longitude - longitude) < THRESHOLD_METERS;
        setLocationVerified(isVerified);
        console.log('Location Verified:', isVerified);
        setVerifying(false);
        
        if(isVerified) {
          setTimeout(() => {
            navigation.replace('LivenessDetection');
          }, 2000);
        }

      },
      error => {
        console.log('Location Error:', error.message);
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
        console.log('Clearing location watch on unmount...');
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
          <Text style={styles.statusText}>
            Verifying your location...
          </Text>
        </View>
      ) : errorMsg ? (
        <Text style={[styles.statusText, {color: '#F44336'}]}>
          {errorMsg}
        </Text>
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
      {currentLocation && (
        <View style={styles.locationContainer}>
          <Paragraph style={styles.locationText}>
            Your Location: {currentLocation.latitude.toFixed(6)},{' '}
            {currentLocation.longitude.toFixed(6)}
          </Paragraph>
        </View>
      )}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Italic',
    textAlign: 'center',
    color: '#384959',
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
