import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import BASE_URL from '../../../url';
import { useUserContext } from '../../Context';

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
      const response = await fetch(`${BASE_URL}/faculty/add-faculty`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          subjectID: subjectID,
          email: facultyEmail,
          requestedByEmail : userEmail
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: result.message || 'Faculty added successfully!',
        });
        setFacultyEmail('');
        toggleFacultyModal();
      } else {
        Toast.show({
          type: 'error',
          text1: result.error || 'Error adding faculty',
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
      <Text style={styles.title}>Enter Faculty Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Institute Email"
        value={facultyEmail}
        onChangeText={setFacultyEmail}
        keyboardType="email-address"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={toggleFacultyModal}
          style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddFaculty} style={styles.addButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddFaculty;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {color: '#000', fontFamily: 'Raleway-Bold'},
});
