import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;

import {useUserContext} from './Context';
import BASE_URL from '../url';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logging, setLogging] = useState(false);

  const {setUserEmail, setUserName} = useUserContext();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Username and password cannot be empty!',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });

      return;
    }
    setLogging(true);

    Toast.show({
      type: 'info',
      text1: 'Logging in...',
      position: 'top',
      visibilityTime: 1000,
      autoHide: true,
      topOffset: 10,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email,
          password,
          role: selectedRole,
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.status === 200) {
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem(
          'refresh_token',
          response.data.refresh_token,
        );
        setUserEmail(email);
        setUserName(response.data.name);
        await AsyncStorage.setItem('name', response.data.name);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('role', selectedRole);

        Toast.show({
          type: 'success',
          text1: 'Login Successful!',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });

        setTimeout(() => {
          setEmail('');
          setPassword('');

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name:
                    selectedRole === 'Faculty'
                      ? 'GetStartedFaculty'
                      : 'GetStartedStudent',
                },
              ],
            }),
          );
        }, 500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Credentials',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
        setPassword('');
      }
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'Something went wrong!',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    } finally {
      setLogging(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container1}>
            <Image
              style={styles.image}
              source={require('../assets/login.gif')}
            />
          </View>

          <View style={styles.container2}>
            <View style={styles.headContainer}>
              <Text style={styles.loginText}>LOGIN</Text>
              <Text style={styles.headText}>Hello there!</Text>
              <Text style={styles.headText}>Welcome Back</Text>
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>Are You ?</Text>
              <View style={styles.roleButtons}>
                {['Faculty', 'Student'].map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      selectedRole === role && styles.selectedRole,
                    ]}
                    onPress={() => setSelectedRole(role)}>
                    <Text
                      style={[
                        styles.roleButtonText,
                        selectedRole === role && styles.selectedRoleText,
                      ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordinput}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  onPress={() => {
                    setPasswordVisible(!passwordVisible);
                  }}>
                  <Icon
                    name={passwordVisible ? 'eye-off' : 'eye'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={logging}
              style={styles.submitButton}
              onPress={handleLogin}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  container1: {
    height: windowHeight / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: windowHeight / 2,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  container2: {},
  loginText: {
    fontSize: 40,
    color: '#2B8781',
    fontFamily: 'Teko-Bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  headContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headText: {
    fontSize: 25,
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
    color: '#384959',
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  roleText: {
    fontSize: 17,
    fontFamily: 'Raleway-Medium',
    color: '#384959',
    marginBottom: 5,
  },
  roleButtons: {
    flexDirection: 'row',
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#2B8781',
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: '#2B8781',
  },
  selectedRoleText: {
    color: '#fff',
  },
  roleButtonText: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Raleway-Medium',
  },

  label: {
    fontSize: 10,
    fontFamily: 'Raleway-Medium',
    paddingVertical: 5,
    color: 'grey',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 45,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    borderWidth: 0.5,
    padding: 10,
    fontSize: 17,
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 5,
    color: '#384959',
  },
  passwordinput: {
    flex: 1,
    color: 'black',
  },
  forgotPassword: {
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
    color: '#2B8781',
    textAlign: 'right',
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: '#2B8781',
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    textAlign: 'center',
  },
});
