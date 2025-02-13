import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import RNFS from "react-native-fs";
import axios from "axios";
import { useUserContext } from "./Context";

const BASE_URL = process.env.BASE_URL;

export default function CameraComponent({ navigation, subject }) {
  const [photoUri, setPhotoUri] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [result, setResult] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");
  const cameraRef = useRef(null);
  const { userData } = useUserContext();
  const devices = useCameraDevices();
  const device = devices.front;
  
  useEffect(() => {
    (async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission !== 'granted') {
        Alert.alert("Camera permission is required to use this feature.");
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto({ quality: 80 });
      const filePath = `${RNFS.DocumentDirectoryPath}/photo.jpg`;
      await RNFS.moveFile(photo.path, filePath);
      setPhotoUri(`file://${filePath}`);
      setIsCameraActive(false);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setIsCameraActive(true);
  };

  const getPrediction = async () => {
    if (!photoUri) return;
    try {
      const data = new FormData();
      data.append("image", {
        uri: photoUri,
        name: "image.jpg",
        type: "image/jpg",
      });

      const response = await axios.post(`${BASE_URL}/detect_faces`, data);
      setResult(response.data.regno);
    } catch (error) {
      console.error("Face detection error:", error);
    }
  };

  const postAttendance = async () => {
    if (!result) return;
    try {
      const postData = {
        subject_name: subject,
        scholarId: result,
        username: userData.username,
        dateTime: new Date().toISOString(),
      };

      const response = await axios.post(`${BASE_URL}/post_attendance`, postData);
      setResponseMsg(response.data.message);
      Alert.alert("Success", response.data.message);
      navigation.navigate("Student");
    } catch (error) {
      console.error("Attendance posting error:", error);
    }
  };

  if (!device) return <Text>Loading camera...</Text>;

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <Camera
          style={styles.camera}
          ref={cameraRef}
          device={device}
          isActive={isCameraActive}
          photo
        />
      ) : (
        <Text style={styles.infoText}>Photo Captured</Text>
      )}

      <View style={styles.buttonContainer}>
        {isCameraActive ? (
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={retakePhoto}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        )}

        {photoUri && (
          <TouchableOpacity style={styles.button} onPress={getPrediction}>
            <Text style={styles.buttonText}>Get ID</Text>
          </TouchableOpacity>
        )}

        {result && (
          <TouchableOpacity style={styles.button} onPress={postAttendance}>
            <Text style={styles.buttonText}>Post Attendance</Text>
          </TouchableOpacity>
        )}
      </View>

      {result && <Text style={styles.resultText}>ID: {result}</Text>}
      {responseMsg && <Text style={styles.responseText}>{responseMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4681f4",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  resultText: {
    fontSize: 18,
    marginTop: 10,
  },
  responseText: {
    fontSize: 16,
    marginTop: 10,
    color: "green",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
