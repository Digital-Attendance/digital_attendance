import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const Start = ({ navigation }) => {
  const shineAnim = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 300,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskedContainer}
        maskElement={<Text style={styles.title}>Digital Attendance</Text>}
      >
        <Text style={[styles.title, { color: '#666' }]}>Digital Attendance</Text>
        <Animated.View
          style={[
            styles.animatedShine,
            { transform: [{ translateX: shineAnim }] },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shineGradient}
          />
        </Animated.View>
      </MaskedView>

      <Image
        source={require('../assets/startBackgroundImg_black.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
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
    backgroundColor: '#1E1E1E',
  },
  maskedContainer: {
    position: 'relative',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Monoton-Regular',
    color: '#fff', // Base color
  },
  animatedShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300, // Ensures full shine effect
    height: 40,
  },
  shineGradient: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
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
    shadowOffset: { width: 0, height: 2 },
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
