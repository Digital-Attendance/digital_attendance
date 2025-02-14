import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

const Start = ({navigation}) => {
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const selectedRole = await AsyncStorage.getItem('role');
    if (token) {
      navigation.navigate(selectedRole === 'Faculty' ? 'Faculty' : 'Student');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digital Attendance</Text>
      <Image
        source={require('../assets/startBackgroundImg.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Start;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
  },
  title: {
    padding: 10,
    paddingBottom: 40,
    fontSize: 25,
    textAlign: 'center',
    // fontWeight: "bold",
    fontFamily: 'Monoton-Regular',
    color: '#333',
  },
  logo: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    // flexDirection: "column",
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2B8781',
    paddingVertical: 12,
    margin: 10,
    borderRadius: 100,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 0.05,
  },
  registerText: {
    color: '#384959',
  },
});
