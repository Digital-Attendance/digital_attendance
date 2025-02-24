import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Snackbar from 'react-native-snackbar';

const departments = {
  CSE: {
    1: ['CS101', 'CS102'],
    2: ['CS201', 'CS202'],
    3: ['CS301', 'CS302'],
    4: ['CS401', 'CS402'],
    5: ['CS501', 'CS502'],
    6: ['CS601', 'CS602'],
    7: ['CS701', 'CS702'],
    8: ['CS801', 'CS802'],
  },
  ECE: {
    1: ['EC101', 'EC102'],
    2: ['EC201', 'EC202'],
    3: ['EC301', 'EC302'],
    4: ['EC401', 'EC402'],
    5: ['EC501', 'EC502'],
    6: ['EC601', 'EC602'],
    7: ['EC701', 'EC702'],
    8: ['EC801', 'EC802'],
  },
  // Add more departments as needed
};

const EnrollSubject = ({ navigation }) => {
  const [semester, setSemester] = useState(null);
  const [department, setDepartment] = useState(null);
  const [subject, setSubject] = useState(null);
  const [enroll, setEnroll] = useState(false);

  const handleSubmit = () => {
    if (!semester || !department || !subject) {
      Snackbar.show({
        text: 'All fields are required!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#D9534F',
        textColor: '#fff',
      });
      return;
    }
    setEnroll(true);
    Snackbar.show({
      text: 'Subject enrolled successfully!',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#5CB85C',
      textColor: '#fff',
    });
    setEnroll(false);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enroll in a Subject</Text>
      
      <Text style={styles.label}>Select Semester</Text>
      <Dropdown
        data={[...Array(8).keys()].map(i => ({ label: `Semester ${i + 1}`, value: i + 1 }))}
        labelField="label"
        valueField="value"
        value={semester}
        onChange={item => {
          setSemester(item.value);
          setDepartment(null);
          setSubject(null);
        }}
        style={styles.dropdown}
      />

      {semester && (
        <>
          <Text style={styles.label}>Select Department</Text>
          <Dropdown
            data={Object.keys(departments).map(dep => ({ label: dep, value: dep }))}
            labelField="label"
            valueField="value"
            value={department}
            onChange={item => {
              setDepartment(item.value);
              setSubject(null);
            }}
            style={styles.dropdown}
          />
        </>
      )}

      {department && semester && (
        <>
          <Text style={styles.label}>Select Subject</Text>
          <Dropdown
            data={departments[department]?.[semester]?.map(sub => ({ label: sub, value: sub }))}
            labelField="label"
            valueField="value"
            value={subject}
            onChange={item => setSubject(item.value)}
            style={styles.dropdown}
          />
        </>
      )}

      <TouchableOpacity style={styles.submitButton} disabled={enroll} onPress={handleSubmit}>
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
