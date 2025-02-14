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

const ForgotPassword = ({navigation}) => {
  const BASE_URL = process.env.BASE_URL;
  const [email, setEmail] = useState('');

  const handlePasswordResetRequest = async () => {
    if (!email) {
      Snackbar.show({
        text: 'Email cannot be empty!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

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
        Snackbar.show({
          text: 'OTP sent to your email!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
        setTimeout(() => {
          navigation.replace('OTPVerification', {email});
        }, 5000);
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
        />
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handlePasswordResetRequest}>
        <Text style={styles.resetButtonText}>Send OTP</Text>
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
    // fontWeight: '600',
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    color: '#384959',
  },
  label: {
    fontSize: 12,
    // fontWeight: '500',
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
    padding: 10,
    fontSize: 17,
    borderRadius: 10,
    borderColor: '#ccc',
    marginBottom: 5,
    color: '#384959',
  },
  resetButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#2B8781',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
    // fontWeight: '600',
    color: '#fff',
  },
});

export default ForgotPassword;
