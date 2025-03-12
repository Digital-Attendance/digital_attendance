import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {format} from 'date-fns';

const AttendanceStats = ({subjectRecord, userEmail}) => {
  const attendanceDetails = subjectRecord.attendanceRecords.map(record => {
    const userEntry = record.Students.find(
      student => student.email === userEmail,
    );
    return {
      date: record.date,
      present: userEntry ? userEntry.present : false,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.attendanceList}>
          {attendanceDetails.length > 0 ? (
            attendanceDetails.map((stat, index) => (
              <View key={index} style={styles.attendanceCard}>
                <Text style={styles.dateText}>
                  {format(new Date(stat.date).getDay(), 'EEE')}
                </Text>
                <Text style={styles.dateText}>
                  {format(new Date(stat.date), 'dd MMMM yyyy')}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    stat.present ? styles.present : styles.absent,
                  ]}>
                  {stat.present ? 'Present' : 'Absent'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>
              No attendance records available.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default AttendanceStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    marginBottom: 10,
  },
  scrollContainer: {
    height: '90%',
    backgroundColor: '#000',
    borderRadius: 14,
    borderWidth: 0.2,
    borderBottomWidth: 2,
    borderBottomColor: 'skyblue',
    overflow: 'hidden',
  },
  attendanceList: {
    flexGrow: 1,
    padding: 10,
  },
  attendanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 5,
    borderRadius: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Raleway-SemiBold',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Raleway-Medium',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  present: {
    backgroundColor: 'green',
    color: '#fff',
  },
  absent: {
    backgroundColor: 'red',
    color: '#fff',
  },
  noDataText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});
