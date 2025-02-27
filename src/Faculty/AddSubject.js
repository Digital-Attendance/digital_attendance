import React, {useState} from 'react';
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
import {useUserContext} from '../Context';
import {Dropdown} from 'react-native-element-dropdown';
import BASE_URL from '../../url';

const courses = [
  {label: 'BTech', value: 'BTech'},
  {label: 'MTech', value: 'MTech'},
  {label: 'MBA', value: 'MBA'},
  {label: 'MSc', value: 'MSc'},
  {label: 'PhD', value: 'PhD'},
];

const semesterOptions = {
  BTech: 8,
  MTech: 4,
  MBA: 4,
  MSc: 4,
  PhD: 6,
};

const AddSubject = ({navigation}) => {
  const {userEmail} = useUserContext();
  console.log(userEmail);

  const [form, setForm] = useState({
    subjectCode: '',
    subjectName: '',
    course: null,
    semester: null,
  });

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    const {subjectCode, subjectName, course, semester} = form;

    if (!subjectCode || !subjectName || !course || !semester) {
      Snackbar.show({
        text: 'All fields are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/add-subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectCode,
          subjectName,
          course,
          semester,
          facultyEmail: userEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Snackbar.show({
          text: 'Subject added successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });

        navigation.goBack();
      } else {
        Snackbar.show({
          text: data.error || 'Failed to add subject',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      Snackbar.show({
        text: 'Network error. Please try again!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
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

            <Text style={styles.label}>Choose Course</Text>
            <Dropdown
              style={styles.dropdown}
              data={courses}
              labelField="label"
              valueField="value"
              placeholder="Select Course"
              value={form.course}
              onChange={item => handleChange('course', item.value)}
            />

            <Text style={styles.label}>Semester</Text>
            <Dropdown
              style={styles.dropdown}
              data={
                form.course
                  ? Array.from(
                      {length: semesterOptions[form.course]},
                      (_, i) => ({
                        label: `${i + 1} Semester`,
                        value: `${i + 1}`,
                      }),
                    )
                  : []
              }
              labelField="label"
              valueField="value"
              placeholder="Select Semester"
              value={form.semester}
              onChange={item => handleChange('semester', item.value)}
              disable={!form.course}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
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
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
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
