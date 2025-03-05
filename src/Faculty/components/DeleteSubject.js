import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import BASE_URL from '../../../url';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';

const DeleteSubject = ({toggleMenu, subjectCode}) => {
  const [typedCode, setTypedCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const handleDelete = async () => {
    if (typedCode !== subjectCode) {
      setError("Subject code does not match.");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/faculty/delete-subject/${subjectCode}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Snackbar.show({
          text: data.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        toggleMenu();
        navigation.navigate('Faculty_Home');
        
      } else {
        setError(data.message || "Failed to delete subject");
      }
    } catch (error) {
      setError("Error deleting subject. Please try again.");
      
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Subject</Text>
      <Text style={styles.warning}>
        This action is irreversible. Please type "{subjectCode}" to confirm
        deletion.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter subject code"
        value={typedCode}
        onChangeText={setTypedCode}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={toggleMenu}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            typedCode === subjectCode ? {} : styles.disabled,
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  warning: {
    textAlign: 'center',
    marginBottom: 15,
    color: 'red',
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
  error: {
    color: 'red',
    marginBottom: 10,
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
  cancelText: {
    color: 'black',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: 'gray',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DeleteSubject;
