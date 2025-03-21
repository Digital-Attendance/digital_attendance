import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import axios from 'axios';

import Toast from 'react-native-toast-message';
import Snackbar from 'react-native-snackbar';
import {CommonActions} from '@react-navigation/native';
import BASE_URL from '../url';
const EmailOTPVerification = ({navigation, route}) => {
  const {form} = route.params;
  const {
    firstname,
    lastname,
    email,
    password,
    selectedRole,
    registration_number,
  } = form;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    setIsResendDisabled(true);
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const focusNextInput = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value.length === 1 && index < 3) {
      inputs.current[index + 1]?.focus();
    } else if (value.length === 0 && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = useCallback(() => {
    // const otpCode = useMemo(() => otp.join(''), [otp]);
    const otpCode = otp.join('');

    if (otpCode.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid OTP',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
      return;
    }

    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/verify-otp`,
          {email, otp: otpCode},
          {validateStatus: status => status < 500},
        );

        if (response.data.success) {
          Toast.show({
            type: 'success',
            text1: 'OTP Verified',
            position: 'top',
            visibilityTime: 1000,
            autoHide: true,
            topOffset: 10,
          });
          if (selectedRole === 'Student') {
            setTimeout(() => {
              navigation.replace('FaceVerification', {
                form,
              });
            }, 500);
          } else if (selectedRole === 'Faculty') {
            await registerFaculty();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Invalid Role',
              position: 'top',
              visibilityTime: 1000,
              autoHide: true,
              topOffset: 10,
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: response.data.error || 'Invalid OTP',
            position: 'top',
            visibilityTime: 1000,
            autoHide: true,
            topOffset: 10,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'An error occurred while verifying the OTP',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    }, 500);
  }, [otp, email, navigation]);

  const registerFaculty = async () => {
    setIsRegistering(true);

    Toast.show({
      type: 'info',
      text1: 'Registering...',
      position: 'top',
      visibilityTime: 1000,
      autoHide: true,
      topOffset: 10,
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
        validateStatus: status => status < 500,
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          position: 'top',
          visibilityTime: 500,
          autoHide: true,
          topOffset: 10,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Start'}],
          }),
        );
      } else {
        const errorText = response.data.error ;
        Toast.show({
          type: 'error',
          text1: errorText || 'Registration failed!',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
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
      setIsRegistering(false);
    }
  };

  const handleResend = useCallback(() => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);

    Snackbar.show({
      text: 'Sending OTP...',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#17A2B8',
      textColor: '#fff',
    });

    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/send-otp-first-time`,
          {email},
          {validateStatus: status => status < 500},
        );

        if (response.data.success) {
          Snackbar.show({
            text: 'OTP sent to your email!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#5CB85C',
            textColor: '#fff',
          });
          setTimer(30);
        } else {
          Snackbar.show({
            text: response.data.error,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#D9534F',
            textColor: '#fff',
          });
        }
      } catch (error) {
        Snackbar.show({
          text: 'An error occurred while sending the OTP!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    }, 500);
  }, [email, isResendDisabled]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          Please Check Your Email To See The Verification Code
        </Text>
        <Text style={styles.label}>OTP Code</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={value => focusNextInput(index, value)}
              value={digit}
              ref={el => (inputs.current[index] = el)}
            />
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <View style={styles.resendButtonContainer}>
            <Text style={styles.resendTitle}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResendDisabled}
              style={[styles.resendButton]}>
              <Text style={[styles.resendText]}>Resend Code</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {timer > 0
                ? `Resend Code in 00:${timer.toString().padStart(2, '0')}`
                : ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    color: '#384959',
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Raleway-Medium',
    paddingTop: 100,
    paddingLeft: 30,
    alignSelf: 'flex-start',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderRadius: 14,
    borderWidth: 0.3,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    color: '#000',
  },
  buttonContainer: {
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  verifyButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
    width: '90%',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resendTitle: {
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    color: '#000',
  },
  resendButton: {
    paddingHorizontal: 10,
  },
  resendButtonDisabled: {},
  resendButtonDisabledText: {
    color: 'rgba(0, 0, 0, 0.24)',
  },
  resendText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'Raleway-Light',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  timerContainer: {
    marginTop: 5,
  },
  timerText: {
    fontSize: 12,
    fontFamily: 'Raleway-Regular',
    color: '#000',
  },
});

export default EmailOTPVerification;
