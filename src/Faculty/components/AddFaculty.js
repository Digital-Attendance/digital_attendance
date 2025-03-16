import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import BASE_URL from '../../../url';
import {useUserContext} from '../../Context';

const AddFaculty = ({toggleFacultyModal, subjectID}) => {
  const {userEmail} = useUserContext();
  const [facultyEmail, setFacultyEmail] = useState('');

  const handleAddFaculty = async () => {
    if (!facultyEmail.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid email',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/add-faculty`,
        {
          subjectID: subjectID,
          email: facultyEmail,
          requestedByEmail: userEmail,
        },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Faculty added successfully',
        });
        setFacultyEmail('');
        toggleFacultyModal();
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.error || 'Error adding faculty',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network error, try again',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Faculty to Subject</Text>
      <Text style={styles.subtitle}>
        Enter the email of the faculty member you want to add.
      </Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={22} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Faculty's Institute Email"
          placeholderTextColor="#aaa"
          value={facultyEmail}
          onChangeText={setFacultyEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleFacultyModal}
          style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAddFaculty}
          style={[styles.button, styles.addButton]}>
          <Text style={styles.buttonText}>Add Faculty</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddFaculty;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#2B2B2B',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
  },
});
