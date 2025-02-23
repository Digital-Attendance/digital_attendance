import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
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
      <Card style={styles.card}>
        <Card.Title
          title="Location Verification"
          left={props => (
            <Icon {...props} name="map-marker" size={24} color="#fff" />
          )}
        />
        <Card.Content style={styles.content}>
          {verifying ? (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator animating={true} color="#fff" size="large" />
              <Paragraph style={styles.statusText}>
                Verifying your location...
              </Paragraph>
            </View>
          ) : errorMsg ? (
            <Paragraph style={[styles.statusText, {color: '#F44336'}]}>
              {errorMsg}
            </Paragraph>
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

          {/* Display current location */}
          {currentLocation && (
            <View style={styles.locationContainer}>
              <Paragraph style={styles.locationText}>
                Your Location: {currentLocation.latitude.toFixed(6)},{' '}
                {currentLocation.longitude.toFixed(6)}
              </Paragraph>
            </View>
          )}
        </Card.Content>
        {!verifying && (
          <Card.Actions style={styles.actions}>
            <Button mode="contained" onPress={verifyLocation}>
              Re-check Location
            </Button>
          </Card.Actions>
        )}
      </Card>
    </View>
  );
};

export default VerifyLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  verifyingContainer: {
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
    textAlign: 'center',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'center',
  },
});
