import React, {useState,useEffect} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({navigation}) {

  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const selectedRole = await AsyncStorage.getItem('role');
      if (token) {
        navigation.replace(
          selectedRole === 'Faculty' ? 'Faculty_Home' : 'Student_Home',
        );
      } else {
        navigation.replace('Start');
      }
    } catch (error) {
      console.log('Error checking session:', error);
    } finally {
      setIsSessionChecked(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Digital Attendance</Text>
      <Image source={require('../assets/splash.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontFamily: 'Monoton-Regular',
  },
  logo: {
    width: 360,
    height: 240,
    marginBottom: 20,
  },
});
