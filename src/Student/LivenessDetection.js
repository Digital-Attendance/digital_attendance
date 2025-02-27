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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BASE_URL} from '@env';

const LivenessDetection = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
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

  // const markAttendance = async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/attendance/mark`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({email}),
  //     });
  //   }catch(error){
  //     console.error(error);
  //   }

  const checkEmbedding = async () => {
    if (!base64Data) {
      Snackbar.show({
        text: 'Please capture a photo first.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }
    console.log('Checking embedding...');
    try {
      const res = await fetch(
        'https://zjaxli24s5wu5anukwvvodgtoy0vckbn.lambda-url.ap-south-1.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: 'piyush21_ug@ei.nits.ac.in',
            image: base64Data,
            registration: false,
          }),
        },
      );

      console.log(res);
      const resultJSON = await res.json();
      console.log(resultJSON);

      if (res.status !== 200) {
        Snackbar.show({
          text: resultJSON.error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
        return;
      }

      Snackbar.show({
        text: resultJSON.message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#5CB85C',
        textColor: '#fff',
      });
      // await markAttendance();
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
  };

  const checkLiveness = async () => {
    setIsVerifying(true);
    let base64Data = '';
    if (cameraRef.current && hasPermission) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePhoto({quality: 10});
        const timestamp = new Date().getTime();
        const newPath = `${RNFS.DocumentDirectoryPath}/photo_${timestamp}.jpg`;
        await RNFS.moveFile(photo.path, newPath);
        const base64String = await RNFS.readFile(newPath, 'base64');
        base64Data = base64String;
        setBase64Data(base64String);
      } catch (error) {
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
        setIsVerifying(false);
      } finally {
        setIsCapturing(false);
      }
    }
    Snackbar.show({
      text: 'Verifying...',
      duration: Snackbar.LENGTH_LONG,
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
        console.log(jsonError);
      }
      let message = "";
      if (
        responseData.label !== undefined &&
        responseData.confidence !== undefined
      ) {
        if (responseData.label === 1 && responseData.confidence > 0.7) {
          Snackbar.show({
            text: `Liveness: ${
              responseData.label
            }, Confidence: ${responseData.confidence.toFixed(2)}`,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: '#5CB85C',
            textColor: '#fff',
          });
          await checkEmbedding();
        }
      } else if (responseData.Message) {
        message = responseData.Message;
      }

      setResponseText(message);

      Snackbar.show({
        text: responseText,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#5CB85C',
        textColor: '#fff',
      });
    } catch (error) {
      console.error('Error sending Base64 image:', error);
      const errorMessage = error;
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
      <View style={styles.header}>
        <Icon name="webcam" size={30} color="#2B8781" />
        <Text style={styles.title}>Mark Attendance</Text>
      </View>
      <Text style={styles.subtitle}>
        "Time for a quick identity check—let’s make sure it’s really you!"
      </Text>
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
        <TouchableOpacity
          style={styles.liveButton}
          disabled={isVerifying}
          onPress={checkLiveness}>
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
    // justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    marginVertical: 5,
  },
  subtitle: {
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 12,
    fontFamily: 'Raleway-Italic',
    textAlign: 'center',
    color: '#ccc',
  },
  cameraContainer: {
    width: '80%',
    height: 350,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },

  camera: {width: '100%', height: '100%'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  liveButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: 'bold'},
});

export default LivenessDetection;
