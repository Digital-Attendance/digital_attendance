import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useUserContext} from '../../Context';
import axios from 'axios';
import BASE_URL from '../../../url';

const Records = ({selectedDate, subjectID, onAttendanceDeleted}) => {
  const {isSwipeActive} = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [latestAttendance, setLatestAttendance] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState([]);

  const toggleEditing = () => {
    if (isEditing) {
      setUpdatedAttendance(latestAttendance);
    }
    setIsEditing(!isEditing);
  };

  const toggleAttendance = index => {
    setUpdatedAttendance(prevState =>
      prevState.map((student, i) =>
        i === index ? {...student, present: !student.present} : student,
      ),
    );
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/faculty/get-attendance/${subjectID}/${selectedDate}`,
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );
      if (response.status === 200) {
        setLatestAttendance(response.data.Students || []);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error fetching attendance data',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    let interval;
    if (isSwipeActive) {
      fetchAttendanceData();
      interval = setInterval(() => {
        fetchAttendanceData();
      }, 5000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSwipeActive]);

  useEffect(() => {
    setUpdatedAttendance(latestAttendance);
  }, [latestAttendance]);

  const handleDeleteAttendanceRecord = async () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${BASE_URL}/faculty/delete-attendance`,
                {
                  data: {
                    subjectID,
                    date: selectedDate,
                  },
                  validateStatus: function (status) {
                    return status < 500;
                  },
                },
              );

              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Record deleted successfully',
                  position: 'top',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
                onAttendanceDeleted(selectedDate);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error deleting record',
                  position: 'top',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Network error',
                position: 'top',
                visibilityTime: 1000,
                autoHide: true,
                topOffset: 10,
              });
            }
          },
        },
      ],
    );
  };

  const saveChanges = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/update-attendance`,
        {
          subjectID,
          date: selectedDate,
          updatedAttendance: updatedAttendance.map(({_id, present}) => ({
            _id,
            present,
          })),
        },
        {
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      const data = await response.data;

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Attendance updated successfully',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
        setIsEditing(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error updating attendance',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Network error',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordHeader}>
        <TouchableOpacity
          style={styles.dropAttendance}
          onPress={handleDeleteAttendanceRecord}>
          <MaterialCommunityIcons name="delete" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Records</Text>
        <View style={styles.buttonContainer}>
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
    // width: '80%',
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Teko-Bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
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
