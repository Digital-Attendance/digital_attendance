import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';
import BASE_URL from '../url';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePasswordResetRequest = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email Cannot Be Empty',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,      
      });
      return;
    }
    
    setIsVerifying(true);
    Toast.show({
      type: 'error',
      text1: 'Sending OTP...',
      position: 'top',
      visibilityTime: 1000,
      autoHide: true,
      topOffset: 10,      
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/send-otp`,
        {email},
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent Successfully',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,      
        });
        setTimeout(() => {
          navigation.replace('OTPVerification', {email});
        }, 500);
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.error,
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,      
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An error occurred while sending OTP!',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,      
      });
    }
    setIsVerifying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        No worries! Enter your email address below and we will send you an OTP
        to reset password.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor={'#ccc'}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        style={styles.sendOtpButton}
        disabled={isVerifying}
        onPress={handlePasswordResetRequest}>
        <Text style={styles.sendOtpButtonText}>Send OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Italic',
    textAlign: 'center',
    color: '#384959',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: 'black',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 0.5,
    paddingHorizontal: 5,
    height: 45,
    fontSize: 12,
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 5,
    color: '#384959',
  },
  sendOtpButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#2B8781',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  sendOtpButtonText: {
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },
});

export default ForgotPassword;
