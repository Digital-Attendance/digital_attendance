import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

const AddSubject = ({ navigation }) => {
  const [form, setForm] = useState({
    subjectCode: '',
    subjectName: '',
    credits: '',
    semester: '',
    faculty: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { subjectCode, subjectName, credits, semester, faculty } = form;

    if (!subjectCode || !subjectName || !credits || !semester || !faculty) {
      Snackbar.show({
        text: 'All fields are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    Snackbar.show({
      text: 'Subject added successfully!',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#5CB85C',
      textColor: '#fff',
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Add Subject</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject Code</Text>
            <TextInput
              style={styles.input}
              value={form.subjectCode}
              onChangeText={text => handleChange('subjectCode', text)}
            />

            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={form.subjectName}
              onChangeText={text => handleChange('subjectName', text)}
            />

            <Text style={styles.label}>Credits</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.credits}
              onChangeText={text => handleChange('credits', text)}
            />

            <Text style={styles.label}>Semester</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.semester}
              onChangeText={text => handleChange('semester', text)}
            />

            <Text style={styles.label}>Faculty Name</Text>
            <TextInput
              style={styles.input}
              value={form.faculty}
              onChangeText={text => handleChange('faculty', text)}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Raleway-Bold',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
    paddingVertical: 5,
    color: '#000',
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
  submitButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 50,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },
});

export default AddSubject;
