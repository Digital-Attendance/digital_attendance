import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-gifted-charts';
const AttendanceGraph = ({barData}) => {
  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Attendance Graph</Text>
      <BarChart
        barWidth={10}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelTexts={['0', '25', '75', '100']}
        yAxisTextStyle={{fontSize: 8, color: 'gray'}}
        xAxisLabelStyle={{fontSize: 8, color: 'gray'}}
        xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
      />
    </View>
  );
};

export default AttendanceGraph;

const styles = StyleSheet.create({
  graphContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  graphTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
