import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevices, useCameraFormat} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';

const Registration_FaceVerification = ({navigation, route}) => {
  const BASE_URL = process.env.BASE_URL;
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const cameraDevice = useMemo(
    () => devices.find(device => device.position === 'front'),
    [devices],
  );

  const format = useCameraFormat(cameraDevice, [
    { photoResolution: { width: 4320, height: 5760 } }
  ])
  

  const {form} = route.params;
  const {
    firstname,
    lastname,
    email,
    password,
    selectedRole,
    registration_number,
  } = form;

  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') await Linking.openSettings();
      setHasPermission(permission === 'granted');
    })();
    console.log('Hi');
  }, []);

  const takephoto = async () => {
    if (cameraRef.current && hasPermission) {
      setIsCapturing(true);
      setPhotoDataUri(null);
  
      try {
        const photo = await cameraRef.current.takePhoto({quality: 85});
        const timestamp = new Date().getTime();
        const newPath = `${RNFS.DocumentDirectoryPath}/photo_${timestamp}.jpg`;
        
        await RNFS.moveFile(photo.path, newPath);
        setPhotoDataUri(`file://${newPath}`);
        console.log('Photo captured', newPath);
      } catch (error) {
        Snackbar.show({
          text: 'Error capturing photo.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      } finally {
        setIsCapturing(false);
      }
    }
  };
  

  const handleRegister = async () => {
    if (!photoDataUri) {
      Snackbar.show({
        text: 'Please capture a photo first.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    setIsRegistering(true);
    Snackbar.show({
      text: 'Registering...',
      duration: Snackbar.LENGTH_INDEFINITE,
      backgroundColor: '#17A2B8',
      textColor: '#fff',
    });

    const file = {uri: photoDataUri, type: 'image/jpeg', name: 'photo.jpg'};
    const formData = new FormData();
    formData.append('name', `${firstname} ${lastname}`);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('registration_number', registration_number);
    formData.append('image', file);
    formData.append('role', selectedRole);


    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        body: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      });

      if (response.ok) {
        Snackbar.show({
          text: 'Registration successful!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 5000);
      } else {
        Snackbar.show({
          text: response.statusText,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: error.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Face Verification</Text>
      <View style={styles.cameraContainer}>
        {hasPermission && cameraDevice && !photoDataUri ? (
          <Camera
            style={styles.camera}
            device={cameraDevice}
            ref={cameraRef}
            format={format}
            isActive={true}
            photo={true}
          />
        ) : photoDataUri ? (
          <Image key={photoDataUri} source={{uri: photoDataUri}} style={styles.photoPreview} />
        ) : (
          <ActivityIndicator size="large" color="#007BFF" />
        )}
      </View>
      <View style={styles.buttonContainer}>
        {!photoDataUri ? (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takephoto}
            disabled={isCapturing}>
            <Text style={styles.buttonText}>
              {isCapturing ? 'Capturing...' : 'Capture'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.recaptureButton}
            onPress={() => setPhotoDataUri(null)}>
            <Text style={styles.buttonText}>Recapture</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333'},
  cameraContainer: {
    width: '90%',
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9ECEF',
  },
  camera: {width: '100%', height: '100%'},
  photoPreview: {width: '100%', height: '100%', borderRadius: 10},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  captureButton: {
    backgroundColor: '#3C9AFB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  recaptureButton: {
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: 'bold'},
});

export default Registration_FaceVerification;
