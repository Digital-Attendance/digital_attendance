import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import BASE_URL from '../url';
const Registration_FaceVerification = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [base64Data, setBase64Data] = useState(null);

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const cameraDevice = useMemo(
    () => devices.find(device => device.position === 'front'),
    [devices],
  );

  const format = useCameraFormat(cameraDevice, [
    {photoResolution: {width: 640, height: 480}},
  ]);

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
  }, []);

  const takephoto = async () => {
    if (cameraRef.current && hasPermission) {
      setIsCapturing(true);
      setBase64Data(null);
      setPhotoDataUri(null);

      try {
        const photo = await cameraRef.current.takePhoto({quality: 10});
        const timestamp = new Date().getTime();
        const newPath = `${RNFS.DocumentDirectoryPath}/photo_${timestamp}.jpg`;
        await RNFS.moveFile(photo.path, newPath);
        setPhotoDataUri(`file://${newPath}`);
        const base64String = await RNFS.readFile(newPath, 'base64');
        setBase64Data(base64String);
      } catch (error) {
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const saveEmbedding = async () => {
    
    if (!base64Data) {
      Snackbar.show({
        text: 'Please capture a photo first.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }
    
    try {
      const res = await axios.post(
        'https://zjaxli24s5wu5anukwvvodgtoy0vckbn.lambda-url.ap-south-1.on.aws/',
        {
          email: email,
          image: base64Data,
          registration: true,
        },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );


      if (res.status !== 200) {
        Snackbar.show({
          text: res.data.error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
        return;
      }

      Snackbar.show({
        text: res.data.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#5CB85C',
        textColor: '#fff',
      });
      navigation.dispatch(
        CommonActions.reset({index: 0, routes: [{name: 'Start'}]}),
      );
    } catch (error) {
      Snackbar.show({
        text: 'An error occurred while saving the embedding!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
  };

  const studentRegister = async () => {
    if (!base64Data) {
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
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: '#17A2B8',
      textColor: '#fff',
    });

    const requestBody = {
      name: `${firstname} ${lastname}`,
      email: email,
      password: password,
      registration_number: registration_number,
      selected_role: selectedRole,
    };

    try {
      const response = await axios.post(`${BASE_URL}/register`, requestBody, {
        validateStatus: function (status) {
          return status < 500;
        },
      });

      if (response.status !== 201) {
        const errorText = response.data.error;
        Snackbar.show({
          text: errorText,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
        return;
      }
      
      await saveEmbedding();
    } catch (error) {
      Snackbar.show({
        text: 'An error occurred while registering!',
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
      <Text style={styles.header}>Face Registration</Text>
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
          <Image
            key={photoDataUri}
            source={{uri: photoDataUri}}
            style={styles.photoPreview}
          />
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
          onPress={studentRegister}>
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
