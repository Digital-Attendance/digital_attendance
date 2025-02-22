import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-gifted-charts';

const AttendanceGraph = () => {
  const barData = [
    {value: 75, label: 'Math'},
    {value: 85, label: 'Physics'},
    {value: 90, label: 'CS'},
    {value: 70, label: 'Chemistry'},
  ];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Attendance %</Text>
      <BarChart
        barWidth={25}
        spacing={50}
        noOfSections={5}
        maxValue={100}
        barBorderRadius={4}
        height={220}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{fontSize: 10, color: 'gray'}}
        xAxisLabelTextStyle={{fontSize: 10, color: 'gray'}}
        showGradient
        gradientColor="#147df5"
        showValuesAsTopLabel
        topLabelTextStyle={{fontSize: 10, color: 'gray'}}
        rulesColor={'#3F3F3F'}
      />
    </View>
  );
};

export default AttendanceGraph;

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  graphTitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Teko-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
