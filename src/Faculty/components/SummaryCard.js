import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import MultiAreaChart from './MultiAreaChart';

const screenWidth = Dimensions.get('window').width;

const SummaryCard = () => {
  // const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundCard1} />
      <View style={styles.backgroundCard2} />
      <View style={styles.mainCard}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Total Subjects</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Classes This Week</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>HS 401</Text>
            <Text style={styles.statLabel}>Recent Class</Text>
          </View>
        </View>
        <MultiAreaChart/>

      </View>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  backgroundCard1: {
    position: 'absolute',
    top: -5,
    width: '95%',
    height: 180,
    backgroundColor: '#F5EEC7',
    opacity: 0.5,
    borderRadius: 30,
    zIndex: 0,
  },

  backgroundCard2: {
    position: 'absolute',
    top: -10,
    width: '90%',
    height: 200,
    backgroundColor: '#F5EEE7',
    opacity: 0.25,
    borderRadius: 30,
    zIndex: 1,
  },

  mainCard: {
    width: '100%',
    backgroundColor: '#F5EEC7',
    borderRadius: 30,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#F5EEC7',
    alignItems: 'center',
    zIndex: 2,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },

  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Raleway-Bold',
  },

  statLabel: {
    fontSize: 8,
    fontFamily: 'Raleway-Regular',
    color: '#666',
  },
});
