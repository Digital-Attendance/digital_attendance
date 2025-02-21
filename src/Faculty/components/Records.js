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
import attendanceData from '../../DummyDatas/attendanceData';
import {parse, format} from 'date-fns';

const Records = ({selectedDate}) => {
  const formattedDate = format(
    parse(selectedDate, 'dd MMM yyyy', new Date()),
    'yyyy-MM-dd',
  );
  const students = attendanceData[formattedDate] || [];
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAttendance, setUpdatedAttendance] = useState([...students]);

  useEffect(() => {
    console.log('Formatted Date:', formattedDate);
    setUpdatedAttendance([...students]);
  }, [formattedDate]);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const toggleAttendance = index => {
    setUpdatedAttendance(prevState => {
      return prevState.map((student, i) =>
        i === index ? {...student, present: !student.present} : student,
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordHeader}>
        <Text style={styles.title}>Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleEditing}>
          <MaterialCommunityIcons
            name={isEditing ? 'close' : 'pencil'}
            size={20}
            color="#004d4d"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.studentList}>
          {updatedAttendance.length === 0 ? (
            <Text style={styles.noRecords}>No records available</Text>
          ) : (
            updatedAttendance.map((student, index) => (
              
              <View key={index} style={styles.studentListCard}>
                <Text style={styles.scholarId}>{student.scholarID}</Text>
                <Text style={styles.name}>{student.name}</Text>
                {isEditing ? (
                  <TouchableOpacity onPress={() => toggleAttendance(index)}>
                    <CheckBox
                      value={student.present}
                      disabled={true}
                      tintColors={{true: '#3FFF00', false: '#E25822'}}
                    />
                  </TouchableOpacity>
                ) : (
                  <View
                    style={[
                      styles.statusIndicator,
                      {backgroundColor: student.present ? '#3FFF00' : 'red'},
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
    marginBottom: 10,
  },
  title: {
    width: '90%',
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
    width: 2,
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
