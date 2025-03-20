import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../url';

const Register = ({navigation}) => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    registration_number: '',
    selectedRole: 'Student',
  });
  const [Role, setRole] = useState('Student');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordInfoVisible, setPasswordInfoVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));

    if (field === 'password') {
      const isValid = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).{8,}$/.test(
        value,
      );
      setPasswordError(!isValid);
    }

    if (field === 'email') {
      setEmailError(!value.endsWith('.nits.ac.in'));
    }
    
  };

  const handleNext = useCallback(async () => {
    setIsRegistering(true);
    const {
      firstname,
      lastname,
      email,
      password,
      selectedRole,
      registration_number,
    } = form;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !selectedRole ||
      !registration_number
    ) {
      Snackbar.show({
        text: 'All fields are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      setIsRegistering(false);
      return;
    }

    if (!email.endsWith('.nits.ac.in')) {
      Snackbar.show({
        text: 'Please enter an institute email ID',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      setIsRegistering(false);
      return;
    }

    if (passwordError) {
      Snackbar.show({
        text: 'Password must be alphanumeric having atleast 1 character and at least 8 characters long!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      setIsRegistering(false);
      return;
    }
    Snackbar.show({
      text: 'Please wait while we are sending OTP to your email ID!',
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: '#2B8781',
      textColor: '#fff',
    });
    try {
      const response = await axios.post(
        `${BASE_URL}/send-otp-first-time`,
        {email},
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.data.success) {
        Snackbar.show({
          text: response.data.message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
        setTimeout(() => {
          navigation.replace('EmailVerification', {form});
        }, 500);
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
        text: 'Something went wrong!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }finally{
      setIsRegistering(false);
    }
  }, [form, navigation, passwordError]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image
            source={require('../assets/registration.gif')}
            style={styles.animation}
          />
          <Text style={styles.title}>Register</Text>

          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>Are You ?</Text>
            <View style={styles.roleButtons}>
              {['Faculty', 'Student'].map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleButton, Role === role && styles.Role]}
                  onPress={() => {
                    setRole(role);
                    setForm(prev => {
                      const updatedForm = {...prev, selectedRole: role};
                      return updatedForm;
                    });
                  }}>
                  <Text
                    style={[
                      styles.roleButtonText,
                      Role === role && styles.RoleText,
                    ]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  // placeholder="Piyush"
                  placeholderTextColor={'#ccc'}
                  value={form.firstname}
                  onChangeText={text => handleChange('firstname', text)}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  // placeholder="Kumar"
                  placeholderTextColor={'#ccc'}
                  value={form.lastname}
                  onChangeText={text => handleChange('lastname', text)}
                />
              </View>
            </View>
            <View style={styles.emailContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>Enter Institute Email ID</Text>
            </View>
            <TextInput
              style={[styles.input, emailError && styles.errorInput]}
              // placeholder="piyush@ei.nits.ac.in"
              placeholderTextColor={'#ccc'}
              autoCapitalize='none'
              value={form.email}
              onChangeText={text => handleChange('email', text)}
            />

            <View style={styles.labelContainer}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => setPasswordInfoVisible(true)}>
                <Icon name="information-outline" size={15} color="gray" />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.passwordContainer,
                passwordError && styles.errorInput,
              ]}>
              <TextInput
                style={styles.passwordInput}
                // placeholder="XYZ@1234"
                placeholderTextColor={'#ccc'}
                secureTextEntry={!passwordVisible}
                value={form.password}
                onChangeText={text => handleChange('password', text)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon
                  name={passwordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            
            <Modal
              transparent
              visible={passwordInfoVisible}
              animationType="fade"
              onRequestClose={() => setPasswordInfoVisible(false)}>
              <TouchableWithoutFeedback
                onPress={() => setPasswordInfoVisible(false)}>
                <View style={styles.overlay}>
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>
                      Password must be at least 8 characters long, include a
                      letter, a number, and a special character (@#$%^&+=!)
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {Role === 'Faculty' ? (
              <Text style={styles.label}>Faculty ID</Text>
            ) : (
              <Text style={styles.label}>Scholar ID</Text>
            )}
            <TextInput
              style={styles.input}
              // placeholder={Role === 'Faculty' ? 'FACXXXX' : '211XXXX'}
              placeholderTextColor={'#ccc'}
              value={form.registration_number}
              onChangeText={text => handleChange('registration_number', text)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.nextButton} disabled={isRegistering} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Raleway-Bold',
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
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#2B8781',
    marginHorizontal: 5,
  },
  Role: {
    backgroundColor: '#2B8781',
  },
  RoleText: {
    color: '#fff',
  },
  roleButtonText: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Raleway-Medium',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Raleway-Medium',
    paddingVertical: 5,
    color: '#000',
  },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    color: 'gray',
    textAlign: 'right',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'black',
  },
  errorInput: {
    borderColor: 'red',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    color: 'black',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    padding: 10,
    top: 130,
    left: 70,
    width: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    borderRadius: 5,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
  },
});

export default Register;
