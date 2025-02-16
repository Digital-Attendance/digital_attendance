import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SubjectItem from './SubjectItem';

const Subjects = () => {
  const subjects = [
    {name: 'CS101', lastClass: '12/02/25', progress: 40},
    {name: 'EI101', lastClass: '15/02/25', progress: 30},
    {name: 'ME101', lastClass: '12/02/25', progress: 70},
    {name: 'CE101', lastClass: '8/02/25', progress: 50},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectHeaderTitle}>Subjects</Text>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="shape-square-plus"
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.subjectItemCard}>
        {subjects.map((subject, index) => (
          <SubjectItem
            key={index}
            subjectName={subject.name}
            lastClass={subject.lastClass}
            progress={subject.progress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  subjectHeaderTitle: {
    color: '#1E1E1E',
    fontSize: 15,
    fontFamily: 'Raleway-Bold',
  },
  subjectItemCard: {
    // padding: 10,
    // borderWidth: 1,
  },
});

export default Subjects;
