import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '@env';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-toast-message';

const ResetPassword = ({navigation, route}) => {
  const {email} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePasswordReset = async () => {
    setIsVerifying(true);
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please enter all fields !',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
      setIsVerifying(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match !',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
      setIsVerifying(false);
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Resetting password...',
      position: 'top',
      visibilityTime: 1000,
      autoHide: true,
      topOffset: 10,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/resetPassword`,
        {email: email, newPassword: newPassword},
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password reset successful. Redirecting to login...',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,      
        });

        setInterval(() => {
          navigation.navigate('Login');
        }, 500);
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.message,
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
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Please enter and confirm your new password. You will need to login after
        you reset.
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor={'#ccc'}
          secureTextEntry
        />
      </View>
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={'#ccc'}
          secureTextEntry={false}
        />
      </View>
      <TouchableOpacity
        style={styles.resetButton}
        disabled={isVerifying}
        onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
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
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    color: '#384959',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
    marginTop: 25,
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
    color: '#fff',
  },
});

export default ResetPassword;
