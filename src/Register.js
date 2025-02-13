import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
} from 'react-native';
// import {Dropdown} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Register = ({navigation}) => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    registration_number: '',
    selectedRole: null,
  });
  const [selectedRole, setSelectedRole] = useState('Student');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // const options = useMemo(
  //   () => [
  //     {label: 'Student', value: 'Student'},
  //     {label: 'Faculty', value: 'Faculty'},
  //   ],
  //   [],
  // );

  const handleChange = useCallback((field, value) => {
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
  }, []);

  const handleNext = useCallback(() => {
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
      return;
    }

    if (!email.endsWith('.nits.ac.in')) {
      Snackbar.show({
        text: 'Please enter an institute email ID',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    if (passwordError) {
      Snackbar.show({
        text: 'Password must be alphanumeric having atleast 1 character and at least 8 characters long!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    navigation.navigate('FaceVerification', {form});
  }, [form, navigation, passwordError]);

  const showPasswordInfo = () => {
    Snackbar.show({
      text: 'Password must be at least 8 characters long, include a letter, a number, and a special character (@#$%^&+=!)',
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: '#2B8781',
      textColor: '#fff',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
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
              style={[
                styles.roleButton,
                selectedRole === role && styles.selectedRole,
              ]}
              onPress={() => {
                setSelectedRole(role);
                handleChange('selectedRole', selectedRole);
              }}>
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
        <View style={styles.inputRow}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Piyush"
              placeholderTextColor={'#ccc'}
              value={form.firstname}
              onChangeText={text => handleChange('firstname', text)}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Kumar"
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
          placeholder="piyush@ei.nits.ac.in"
          placeholderTextColor={'#ccc'}
          value={form.email}
          onChangeText={text => handleChange('email', text)}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Password</Text>
          <TouchableOpacity onPress={showPasswordInfo}>
            <Icon name="information-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.passwordContainer,
            passwordError && styles.errorInput,
          ]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={form.password}
            onChangeText={text => handleChange('password', text)}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* <Dropdown
          style={styles.dropdown}
          data={options}
          labelField="label"
          valueField="value"
          placeholder="Select Account Type"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemTextStyle}
          value={form.selectedRole}
          onChange={item => handleChange('selectedRole', item.value)}
        /> */}
        {selectedRole === 'Faculty' ? (
          <Text style={styles.label}>Faculty ID</Text>
        ) : (
          <Text style={styles.label}>Registration Number</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={selectedRole === 'Faculty' ? 'FACXXXX' : '211XXXX'}
          placeholderTextColor={'#ccc'}
          value={form.registration_number}
          onChangeText={text => handleChange('registration_number', text)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  roleText: {
    fontSize: 17,
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
  selectedRole: {
    backgroundColor: '#2B8781',
  },
  selectedRoleText: {
    color: '#fff',
  },
  roleButtonText: {
    fontSize: 13,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
  },
  label: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#000',
  },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
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
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 10,
    marginVertical: 5,
  },
  nextButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Register;
