import React, {useState,useEffect} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from './Context';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
export default function SplashScreen({navigation}) {
  const {setUserEmail,setUserName} = useUserContext();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const selectedRole = await AsyncStorage.getItem('role');
      const userEmail = await AsyncStorage.getItem('email');
      const userName = await AsyncStorage.getItem('name');
      if (token) {
        setUserEmail(userEmail);
        setUserName(userName);
        navigation.replace(
          selectedRole === 'Faculty' ? 'Faculty_Home' : 'Student_Home',
        );
      } else {
        navigation.replace('Start');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,      
      });
    } finally {
      setIsSessionChecked(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Digital Attendance</Text>
      <Image source={require('../assets/splash_black.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  text: {
    fontSize: 24,
    color : '#fff',
    fontFamily: 'Monoton-Regular',
  },
  logo: {
    width: 360,
    height: 240,
    marginBottom: 20,
  },
});
