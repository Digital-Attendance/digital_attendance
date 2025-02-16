import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

const SummaryCard = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundCard1} />
      <View style={styles.backgroundCard2} />
      <View style={styles.mainCard}>
        <View style={styles.subjectNameContainer}>
          <Text style={styles.subjectName}>Digital Circuit</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.subjectData}>Total Students: 50</Text>
          <Text style={styles.subjectData}>Total Class Held: 40</Text>
          <Text style={styles.subjectData}>Average Attendance: 80%</Text>
          <Text style={styles.subjectData}>Last Class : Feb 12, 2025</Text>
        </View>
      </View>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 20,
    // paddingHorizontal: 20,
  },

  // backgroundCard1: {
  //   position: 'absolute',
  //   top: -5,
  //   width: '100%',
  //   height: 200,
  //   backgroundColor: '#F5EEC7',
  //   opacity: 0.75,
  //   borderRadius: 30,
  //   zIndex: 0,
  // },

  // backgroundCard2: {
  //   position: 'absolute',
  //   // top: -10,
  //   width: '100%',
  //   height: 158,
  //   backgroundColor: '#F5EEE7',
  //   opacity: 0.75,
  //   borderRadius: 30,
  //   zIndex: 1,
  // },
  mainCard: {
    backgroundColor: '#005758',
    borderRadius: 30,
    height: 200,
    alignItems: 'center',
    width: 320,
  },

  subjectNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    marginLeft: 25,
  },
  subjectName: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  statsContainer: {
    width: '320',
    marginLeft: 25,
  },
  subjectData: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'Raleway-Regular',
  },
});
