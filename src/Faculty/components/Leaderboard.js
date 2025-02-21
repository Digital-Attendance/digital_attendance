import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {AnimatedCircularProgress} from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StudentList = ({name, attended, progress}) => {
  return (
    <View style={styles.studentListCard}>
      <View style={styles.studentDetails}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <Text style={styles.scholarID}>Scholar ID : 2115085</Text>
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
    </View>
  );
};

const Leaderboard = ({students}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.studentList}>
          {students.map((student, index) => (
            <StudentList
              key={index}
              name={student.name}
              attended={student.attended}
              progress={student.progress}
            />
          ))}
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
    // borderTopWidth: 2,
    // borderTopColor: 'skyblue',
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
    // borderRightWidth: 1,
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
});

export default Leaderboard;
