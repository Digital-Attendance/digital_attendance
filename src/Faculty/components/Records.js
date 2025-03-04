import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import BASE_URL from '../../../url';
import Snackbar from 'react-native-snackbar';

const convertUTCtoIST = utcDate => {
  const istDate = new Date(utcDate);
  istDate.setHours(istDate.getHours() + 5, istDate.getMinutes() + 30);
  return format(istDate, 'yyyy-MM-dd');
};

const Records = ({selectedDate, attendanceRecords, subjectCode}) => {
  const recordForDate = attendanceRecords.find(record => {
    return convertUTCtoIST(record.date) === selectedDate;
  });

  const students = recordForDate ? recordForDate.Students : [];
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAttendance, setUpdatedAttendance] = useState([...students]);

  useEffect(() => {
    setUpdatedAttendance([...students]);
  }, [selectedDate]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const toggleAttendance = index => {
    setUpdatedAttendance(prevState =>
      prevState.map((student, i) =>
        i === index ? {...student, present: !student.present} : student,
      ),
    );
  };

  const saveChanges = async () => {
    try {
      if (!recordForDate || !recordForDate.date) {
        Snackbar.show({
          text: 'No attendance record found for this date',
          duration: Snackbar.LENGTH_SHORT,
        });
        return;
      }

      const response = await fetch(`${BASE_URL}/faculty/update-attendance`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          subjectCode,
          date: recordForDate.date,
          updatedAttendance: updatedAttendance.map(({_id, present}) => ({
            _id,
            present,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Snackbar.show({
          text: 'Attendance updated successfully',
          duration: Snackbar.LENGTH_SHORT,
        });
        setIsEditing(false);
      } else {
        Snackbar.show({
          text: data.error || 'An error occurred while updating attendance',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      Snackbar.show({
        text: 'Network error. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordHeader}>
        <Text style={styles.title}>Records</Text>
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <MaterialCommunityIcons name="check" size={20} color="green" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.addButton, isEditing && {backgroundColor: 'red'}]}
          onPress={toggleEditing}>
          <MaterialCommunityIcons
            name={isEditing ? 'close' : 'pencil'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.studentList}>
          {updatedAttendance.length === 0 ? (
            <Text style={styles.noRecords}>No records available</Text>
          ) : (
            updatedAttendance.map((entry, index) => (
              <View key={index} style={styles.studentListCard}>
                <Text style={styles.scholarId}>{entry.scholarID}</Text>
                <Text style={styles.name}>{entry.name}</Text>
                {isEditing ? (
                  <TouchableOpacity onPress={() => toggleAttendance(index)}>
                    <CheckBox
                      value={entry.present}
                      disabled={true}
                      tintColors={{true: '#3FFF00', false: '#E25822'}}
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      styles.statusIndicator,
                      {backgroundColor: entry.present ? '#3FFF00' : 'red'},
                    ]}
                  />
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    width: '80%',
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Teko-Bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 30,
    width: 30,
  },
  saveButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    height: 30,
    width: 30,
    marginRight: 10,
  },
  scrollContainer: {
    height: 450,
    backgroundColor: '#000',
    borderRadius: 14,
    borderWidth: 0.2,
    borderBottomWidth: 2,
    borderBottomColor: 'skyblue',
    overflow: 'hidden',
  },
  studentList: {
    flexGrow: 1,
    padding: 10,
  },
  studentListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderBottomColor: '#333',
    justifyContent: 'space-between',
  },
  scholarId: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    width: '30%',
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    width: '40%',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  noRecords: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Records;
