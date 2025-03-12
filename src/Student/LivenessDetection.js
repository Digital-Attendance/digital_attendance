import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraFormat,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {useUserContext} from '../Context';
import BASE_URL from '../../url';

const LivenessDetection = ({route}) => {
  const {subjectID} = route.params;
  const {userEmail} = useUserContext();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [livenessStatus, setLivenessStatus] = useState(null);
  const [faceVerificationStatus, setFaceVerificationStatus] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

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
      setHasPermission(permission === 'granted');
    })();
  }, []);

  const markAttendance = async () => {
    setAttendanceStatus('loading');
    try {
      const response = await fetch(`${BASE_URL}/student/mark-attendance`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({studentEmail: userEmail, subjectID}),
      });
      const data = await response.json();
      setAttendanceStatus(response.status === 200 ? 'success' : 'failed');
      Toast.show({
        type: 'info',
        text1: response.status === 200 ? data.message : data.error,
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,      
      });
      if (response.status === 200) {
        setTimeout(() => {
          navigation.replace('Student_Home');
        }, 500);
      }
    } catch (error) {
      setAttendanceStatus('failed');
    }
  };

  const verifyFace = async base64Data => {
    setFaceVerificationStatus('loading');
    try {
      const response = await fetch(
        'https://zjaxli24s5wu5anukwvvodgtoy0vckbn.lambda-url.ap-south-1.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: userEmail,
            image: base64Data,
            registration: false,
          }),
        },
      );
      const resultJSON = await response.json();
      setFaceVerificationStatus(response.status === 200 ? 'success' : 'failed');
      if (response.status === 200) {
        await markAttendance();
      }
    } catch (error) {
      setFaceVerificationStatus('failed');
    }
  };

  const checkLiveness = async () => {
    if (!cameraRef.current || !hasPermission) return;
    setLivenessStatus('loading');
    setFaceVerificationStatus(null);
    setAttendanceStatus(null);
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePhoto({quality: 10});
      const base64Data = await RNFS.readFile(photo.path, 'base64');
      const response = await fetch(
        'https://zl77aqpwm5yvlrocwtw4c5nc7y0xxkco.lambda-url.ap-south-1.on.aws/',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({image: base64Data}),
        },
      );
      const responseData = await response.json();
      setLivenessStatus(
        responseData.label === 1 && responseData.confidence > 0.7
          ? 'success'
          : 'failed',
      );
      if (responseData.label === 1 && responseData.confidence > 0.7) {
        await verifyFace(base64Data);
      }
    } catch (error) {
      setLivenessStatus('failed');
    } finally {
      setIsProcessing(false);
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
          disabled={isProcessing}
          onPress={checkLiveness}>
          <Text style={styles.buttonText}>Mark</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statusContainer}>
        {livenessStatus === 'loading' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Checking Liveness...</Text>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        {livenessStatus === 'success' && (
          <Text style={styles.successText}>Liveness Confirmed ✅</Text>
        )}
        {livenessStatus === 'failed' && (
          <Text style={styles.failedText}>Liveness Check Failed ❌</Text>
        )}

        {faceVerificationStatus === 'loading' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Checking Face Verification...
            </Text>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        {faceVerificationStatus === 'success' && (
          <Text style={styles.successText}>Face Verified ✅</Text>
        )}
        {faceVerificationStatus === 'failed' && (
          <Text style={styles.failedText}>Face Verification Failed ❌</Text>
        )}

        {attendanceStatus === 'loading' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Marking Attendance...</Text>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        {attendanceStatus === 'success' && (
          <Text style={styles.successText}>Attendance Marked ✅</Text>
        )}
        {attendanceStatus === 'failed' && (
          <Text style={styles.failedText}>Attendance Failed ❌</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  statusContainer: {marginTop: 20},
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  successText: {color: '#5CB85C', fontSize: 16, marginTop: 5},
  failedText: {color: '#D9534F', fontSize: 16, marginTop: 5},
});

export default LivenessDetection;
