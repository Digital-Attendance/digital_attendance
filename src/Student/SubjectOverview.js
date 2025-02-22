import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  DataTable,
  ProgressBar,
  Subheading,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AttendanceButton from './components/AttendanceButton';

const SubjectOverview = () => {
  const subject = {
    name: 'Cloud Computing',
    faculty: 'Dr. Ripon Patgiri',
    credits: 3,
    type: 'Core',
    attendance: 68,
    totalClasses: 150,
    attended: 102,
    lastClass: '2 hrs ago',
  };

  const upcomingClasses = [
    {date: 'Mar 5, 2025', time: '10:00 AM', location: 'G-301'},
    {date: 'Mar 7, 2025', time: '2:00 PM', location: 'G-301'},
    {date: 'Mar 9, 2025', time: '11:00 AM', location: 'OldG-201'},
  ];

  const performanceTrend = [
    {label: '18/02/2025', attended: true},
    {label: '11/02/2025', attended: false},
    {label: '07/02/2025', attended: true},
    {label: '03/02/2025', attended: true},
    {label: '01/02/2025', attended: false},
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header Section with Gradient Background */}
      <LinearGradient colors={['#004d4d', '#1E1E1E']} style={styles.header}>
        <Title style={styles.subjectName}>{subject.name}</Title>
        <Paragraph style={styles.faculty}>Faculty: {subject.faculty}</Paragraph>
        <Paragraph style={styles.meta}>{subject.type}</Paragraph>
      </LinearGradient>

      {/* Attendance Summary Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Attendance Summary"
          left={props => (
            <Icon {...props} name="chart-bar" size={24} color="#007a7a" />
          )}
        />
        <Card.Content>
          <View style={styles.attendanceContainer}>
            <Subheading style={styles.attendanceLabel}>Attendance</Subheading>
            <Subheading style={styles.attendanceValue}>
              {subject.attendance}%
            </Subheading>
          </View>
          <ProgressBar
            progress={subject.attendance / 100}
            color={
              subject.attendance >= 75
                ? '#4CAF50'
                : subject.attendance >= 60
                ? '#FFC107'
                : '#F44336'
            }
            style={styles.progressBar}
          />
          <Paragraph style={styles.attendanceDetails}>
            Attended {subject.attended} out of {subject.totalClasses} classes
          </Paragraph>
          <Paragraph style={styles.attendanceDetails}>
            Last Class: {subject.lastClass}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Recent Class Performance Trend Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Recent Class Performance"
          left={props => (
            <Icon {...props} name="clock-outline" size={24} color="#005758" />
          )}
        />
        <Card.Content>
          {performanceTrend.map((item, index) => (
            <View key={index} style={styles.trendRow}>
              <Paragraph style={styles.trendLabel}>{item.label}</Paragraph>
              <Icon
                name={
                  item.attended
                    ? 'check-circle-outline'
                    : 'close-circle-outline'
                }
                size={20}
                color={item.attended ? '#4CAF50' : '#F44336'}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Upcoming Classes Schedule Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Upcoming Classes"
          left={props => (
            <Icon {...props} name="calendar-clock" size={24} color="#005758" />
          )}
        />
        <Card.Content>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Time</DataTable.Title>
              <DataTable.Title numeric>Classroom</DataTable.Title>
            </DataTable.Header>
            {upcomingClasses.map((cls, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{cls.date}</DataTable.Cell>
                <DataTable.Cell>{cls.time}</DataTable.Cell>
                <DataTable.Cell numeric>{cls.location}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
      <AttendanceButton />
    </ScrollView>
  );
};

export default SubjectOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  subjectName: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    marginBottom: 5,
  },
  faculty: {
    fontSize: 12,
    color: '#ddd',
    fontFamily: 'Raleway-Regular',
  },
  meta: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Raleway-Italic',
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Raleway-SemiBold',
  },
  attendanceValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  attendanceDetails: {
    fontSize: 14,
    color: '#eee',
    fontFamily: 'Raleway-Regular',
    marginBottom: 5,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  trendLabel: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Raleway-Regular',
  },
  tableHeader: {
    backgroundColor: '#005758',
  },
});
