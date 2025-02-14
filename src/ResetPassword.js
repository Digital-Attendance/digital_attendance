import React, { useState,useEffect } from 'react';
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


const ResetPassword = ({ navigation,route }) => {
  const BASE_URL = process.env.BASE_URL;
  
  const {email} = route.params;
  console.log('email:',email)
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
    console.log(newPassword)

    try {
      const response = await axios.post(`${BASE_URL}/resetPassword`, { email:email, newPassword:newPassword },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Password Reset', 'Your password has been reset successfully.');
        
        setInterval(()=>{
          navigation.navigate('Login');
        
        },3000)
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
      <Text style={styles.label}>New Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
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
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: 'black',
  },
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ResetPassword;
