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
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.classAttended}>Classes Attended : {attended}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Raleway-Bold',
    marginBottom: 10,
  },

  studentList: {
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 0.1,
    borderBottomWidth: 2,
    borderBottomColor: 'skyblue',
    padding: 10,
    // height: 150,
    // marginTop: 10,
  },
  studentListCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    // borderWidth: 1,
  },
  studentDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
  },
  classAttended: {
    color: '#ccc',
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    marginTop: 4,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    color: '#000',
  },
});

export default Leaderboard;
