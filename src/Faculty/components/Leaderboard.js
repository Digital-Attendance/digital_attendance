import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {AnimatedCircularProgress} from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from '../../../url';
import Toast from 'react-native-toast-message';

const StudentList = ({name, scholarID, attended, progress, onRemove}) => {
  return (
    <View style={styles.studentListCard}>
      <View style={styles.studentDetails}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.scholarID}>Scholar ID : {scholarID}</Text>
      </View>
      <View style={styles.classAttendedContainer}>
        <Text style={styles.classAttendedText}>{attended}</Text>
        <Text style={styles.classAttended}>Classes</Text>
      </View>

      <View style={styles.progressSection}>
        <AnimatedCircularProgress
          size={30}
          width={2}
          fill={progress}
          tintColor="orange"
          backgroundColor="skyblue"
        />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemove(scholarID)}>
        <MaterialCommunityIcons name="delete" size={20} color="#900" />
      </TouchableOpacity>
    </View>
  );
};

const Leaderboard = ({subjectRecord, onStudentRemoved}) => {

  const studentAttendanceMap = new Map();

  subjectRecord.attendanceRecords.forEach(record => {
    record.Students.forEach(student => {
      const {scholarID, name, present} = student;

      if (!studentAttendanceMap.has(scholarID)) {
        studentAttendanceMap.set(scholarID, {
          name,
          scholarID,
          totalPresent: 0,
          totalClasses: 0,
        });
      }

      const studentData = studentAttendanceMap.get(scholarID);
      studentData.totalPresent += present ? 1 : 0;
      studentData.totalClasses += 1;
      studentAttendanceMap.set(scholarID, studentData);
    });
  });

  subjectRecord.students.forEach(student => {
    if (!studentAttendanceMap.has(student.scholarID)) {
      studentAttendanceMap.set(student.scholarID, {
        name: student.name,
        scholarID: student.scholarID,
        totalPresent: 0,
        totalClasses: 0,
      });
    }
  });

  const studentList = Array.from(studentAttendanceMap.values())
    .map(student => ({
      ...student,
      attendancePercentage:
        subjectRecord.numberOfClassesTaken > 0
          ? (student.totalPresent / subjectRecord.numberOfClassesTaken) * 100
          : 0,
    }))
    .sort((a, b) => b.attendancePercentage - a.attendancePercentage);

  const handleRemoveStudent = async scholarID => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this student from the subject?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/faculty/remove-student`,
                {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    subjectCode: subjectRecord.subjectCode,
                    scholarID,
                  }),
                },
              );

              const result = await response.json();
              if (response.ok) {
                Toast.show({
                  type: 'success',
                  text1: 'Student removed successfully!',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
                onStudentRemoved(scholarID);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Failed to remove student!',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.studentList}>
          {studentList.length > 0 ? (
            studentList.map((student, index) => (
              <StudentList
                key={index}
                name={student.name}
                scholarID={student.scholarID}
                attended={student.totalPresent}
                progress={student.attendancePercentage}
                onRemove={handleRemoveStudent}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No students enrolled yet.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Teko-Bold',
    marginBottom: 10,
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#333',
  },
  studentDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRightWidth: 1,
    width: '40%',
  },
  name: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Raleway-SemiBold',
  },
  scholarID: {
    color: '#ccc',
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    marginTop: 4,
  },
  classAttendedText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Raleway-Bold',
  },
  classAttended: {
    color: '#ccc',
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    marginTop: 4,
  },
  classAttendedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    color: '#fff',
  },
  deleteButton: {
    padding: 5,
    borderWidth: 1,
  },
  noDataText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Leaderboard;
