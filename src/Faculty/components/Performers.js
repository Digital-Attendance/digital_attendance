import {StyleSheet, View, Text} from 'react-native';
import React from 'react';

const Performers = ({subjectRecord}) => {
  if (!subjectRecord || !subjectRecord.attendanceRecords) return null;

  const studentsAttendance = {};
  subjectRecord.attendanceRecords.forEach(record => {
    record.Students.forEach(student => {
      if (!studentsAttendance[student.scholarID]) {
        studentsAttendance[student.scholarID] = {
          name: student.name,
          scholarID: student.scholarID,
          presentCount: 0,
          totalClasses: 0,
        };
      }
      studentsAttendance[student.scholarID].totalClasses++;
      if (student.present) {
        studentsAttendance[student.scholarID].presentCount++;
      }
    });
  });

  const studentsWithAttendance = Object.values(studentsAttendance).map(
    student => ({
      ...student,
      attendancePercentage: (student.presentCount / student.totalClasses) * 100,
    }),
  );

  studentsWithAttendance.sort(
    (a, b) => b.attendancePercentage - a.attendancePercentage,
  );

  const topPerformers = studentsWithAttendance.slice(0, 3);
  const colorShades = ['#0057b3', '#3385ff', '#99c2ff'];
  return (
    <View style={styles.performersContainer}>
      {topPerformers.map((performer, index) => (
        <View
          key={performer.scholarID}
          style={[styles.profilePicContainer, {left: index * 25}]}>
          <View
            style={[styles.profilePic, {backgroundColor: colorShades[index]}]}>
            <Text style={styles.profileText}>
              {performer.scholarID.slice(-3)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
export default Performers;

const styles = StyleSheet.create({
  performersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicContainer: {
    position: 'absolute',
    top: 6,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#147df5',
  },
  profileText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
});
