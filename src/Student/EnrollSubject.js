import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';
import { useUserContext } from '../Context';
import BASE_URL from '../../url';
const EnrollSubject = ({navigation, route}) => {
  const {userEmail} = useUserContext();

  const [subjectData, setSubjectData] = useState({});
  const [course, setCourse] = useState(null);
  const [department, setDepartment] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enroll, setEnroll] = useState(false);

  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/student/subjects`);
        const data = await response.json();
        setSubjectData(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        Snackbar.show({
          text: error,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
      setLoading(false);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    if (!course || !department || !semester || !subject) {
      Snackbar.show({
        text: 'All fields are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }
    setEnroll(true);
    try {
      const response = await fetch(`${BASE_URL}/student/enroll`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          studentEmail:userEmail,
          subjectCode: subject,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Snackbar.show({
          text: data.message || 'Subject enrolled successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#5CB85C',
          textColor: '#fff',
        });
        navigation.goBack();
      } else {
        Snackbar.show({
          text: data.error || 'Enrollment failed!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#D9534F',
          textColor: '#fff',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
    }
    setEnroll(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2B8781" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enroll in a Subject</Text>

      
      <Text style={styles.label}>Select Course</Text>
      <Dropdown
        data={Object.keys(subjectData).map(item => ({
          label: item,
          value: item,
        }))}
        labelField="label"
        valueField="value"
        value={course}
        onChange={item => {
          setCourse(item.value);
          setDepartment(null);
          setSemester(null);
          setSubject(null);
        }}
        style={styles.dropdown}
      />

      {/* Department Dropdown */}
      {course && (
        <>
          <Text style={styles.label}>Select Department</Text>
          <Dropdown
            data={Object.keys(subjectData[course]).map(item => ({
              label: item,
              value: item,
            }))}
            labelField="label"
            valueField="value"
            value={department}
            onChange={item => {
              setDepartment(item.value);
              setSemester(null);
              setSubject(null);
            }}
            style={styles.dropdown}
          />
        </>
      )}

      {/* Semester Dropdown */}
      {department && (
        <>
          <Text style={styles.label}>Select Semester</Text>
          <Dropdown
            data={Object.keys(subjectData[course][department]).map(item => ({
              label: `Semester ${item}`,
              value: item,
            }))}
            labelField="label"
            valueField="value"
            value={semester}
            onChange={item => {
              setSemester(item.value);
              setSubject(null);
            }}
            style={styles.dropdown}
          />
        </>
      )}

      {/* Subject Code Dropdown */}
      {semester && (
        <>
          <Text style={styles.label}>Select Subject Code</Text>
          <Dropdown
            data={subjectData[course][department][semester].map(item => ({
              label: item,
              value: item,
            }))}
            labelField="label"
            valueField="value"
            value={subject}
            onChange={item => setSubject(item.value)}
            style={styles.dropdown}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        disabled={enroll}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enroll</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Raleway-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#2B8781',
    padding: 12,
    borderRadius: 50,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
  },
});

export default EnrollSubject;
