import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import axios from 'axios';

const ResetPassword = ({navigation, route}) => {
  const BASE_URL = process.env.BASE_URL;

  const {email} = route.params;
  console.log('email:', email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Please fill all the fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    console.log(newPassword);

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
        Alert.alert(
          'Password Reset',
          'Your password has been reset successfully.',
        );

        setInterval(() => {
          navigation.navigate('Login');
        }, 3000);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while resetting the password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Please enter and confirm your new password. You will need to login after you reset.
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
          secureTextEntry
        />
      </View>
      <TouchableOpacity
        style={styles.resetButton}
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
    fontFamily: 'Raleway-Bold',
    marginTop: 25,
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    // backgroundColor: '#ffffff',
    // borderRadius: 14,
    // paddingHorizontal: 14,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  input: {
    borderWidth: 0.5,
    paddingHorizontal: 5,
    height: 45,
    fontSize: 12,
    borderRadius: 10,
    borderColor: '#ccc',
    // marginBottom: 5,
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

export default ResetPassword;
