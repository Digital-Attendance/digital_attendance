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
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';
import {BASE_URL} from '@env';
const LivenessDetection = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [responseText, setResponseText] = useState(null);
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
      setPhotoDataUri(null);

      try {
        const photo = await cameraRef.current.takePhoto({quality: 10});
        const timestamp = new Date().getTime();
        const newPath = `${RNFS.DocumentDirectoryPath}/photo_${timestamp}.jpg`;

        await RNFS.moveFile(photo.path, newPath);
        setPhotoDataUri(`file://${newPath}`);
        console.log('Photo', photo);
        console.log('Photo captured', newPath);
        const base64String = await RNFS.readFile(newPath, 'base64');
        setBase64Data(base64String);
        setTimeout(()=>{
          Snackbar.show({
            text: 'Photo captured successfully!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#5CB85C',
            textColor: '#fff',
          });
        }, 5000);
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

  const handleVerification = async () => {
    if (!photoDataUri) {
      Snackbar.show({
        text: 'Please capture a photo first.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    setIsVerifying(true);
    Snackbar.show({
      text: 'Verifying...',
      duration: Snackbar.LENGTH_INDEFINITE,
      backgroundColor: '#17A2B8',
      textColor: '#fff',
    });

    try {
      const response = await fetch(
        'https://zl77aqpwm5yvlrocwtw4c5nc7y0xxkco.lambda-url.ap-south-1.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({image: base64Data}),
        },
      );

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }

      console.log('API Response:', responseData);

      let message = 'Invalid response';
      if (
        responseData.label !== undefined &&
        responseData.confidence !== undefined
      ) {
        message = `Liveness: ${
          responseData.label
        }, Confidence: ${responseData.confidence.toFixed(2)}`;
      } else if (responseData.Message) {
        message = responseData.Message;
      }

      setResponseText(message);

      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#5CB85C',
        textColor: '#fff',
      });
    } catch (error) {
      console.error('Error sending Base64 image:', error);
      const errorMessage = error.message || 'Error processing request';
      setResponseText(errorMessage);

      Snackbar.show({
        text: errorMessage,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liveness Detection</Text>
      <Text style={styles.subtitle}>"Time for a quick identity check—let’s make sure it’s really you!"</Text>
      <View style={styles.cameraContainer}>
        {hasPermission && cameraDevice ? (
          <Camera
            style={styles.camera}
            device={cameraDevice}
            ref={cameraRef}
            format={format}
            isActive={true}
            photo={true}
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
          disabled={isVerifying}
          onPress={handleVerification}>
          <Text style={styles.buttonText}>Check Liveness</Text>
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
  title: {
    fontSize: 28,
    fontFamily: 'Raleway-Bold',
    marginVertical: 5,
  },
  subtitle: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 12,
    fontFamily: 'Raleway-Italic',
    textAlign: 'center',
    color: '#384959',
  },
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

export default LivenessDetection;
