import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const SubjectItem = ({subjectName, lastClass, progress}) => {
  return (
    <View style={styles.subjectItem}>
      <View>
        <Text style={styles.subjectName}>{subjectName}</Text>
        <Text style={styles.subjectLastClass}>Last Class: {lastClass}</Text>
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

const styles = StyleSheet.create({
  subjectItem: {
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingVertical: 20,

    marginVertical: 4,
    borderWidth: 0.1,
    borderBottomWidth: 2,
    borderBottomColor: 'skyblue',
  },
  subjectName: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Raleway-Medium',
  },
  subjectLastClass: {
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

export default SubjectItem;
