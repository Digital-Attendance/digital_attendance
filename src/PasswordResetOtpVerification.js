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
import BASE_URL from '../url';
import Snackbar from 'react-native-snackbar';

const PasswordResetOTPVerification = ({navigation, route}) => {
  const {email} = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
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
    const otpCode = otp.join('');

    if (otpCode.length < 4) {
      Snackbar.show({
        text: 'Please enter a valid OTP code!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
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
          Snackbar.show({
            text: 'OTP verified successfully!',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#5CB85C',
            textColor: '#fff',
          });
          setTimeout(() => {
            navigation.replace('ResetPassword', {email});
          }, 1000);
        } else {
          Snackbar.show({
            text: response.data.message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: '#D9534F',
            textColor: '#fff',
          });
        }
      } catch (error) {
        Snackbar.show({
          text: 'An error occurred while verifying the OTP!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    }, 500);
  }, [otp, email, navigation]);

  const handleResend = useCallback(() => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);

    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/send-otp`,
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
            text: response.data.message,
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
    // <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={Keyboard.dismiss} style={styles.container}>
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
              <Text
                style={[
                  styles.resendText,
                  isResendDisabled && styles.resendButtonDisabledText,
                ]}>
                Resend Code
              </Text>
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
    </TouchableOpacity>
    // </SafeAreaView>
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
    fontSize: 34,
    fontWeight: '800',
    fontFamily: 'Raleway',
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Raleway',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 10,
    color: '#000',
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
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
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 10,
    width: '90%',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
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

export default PasswordResetOTPVerification;
