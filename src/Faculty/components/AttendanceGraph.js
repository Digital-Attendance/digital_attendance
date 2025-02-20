import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-gifted-charts';

const AttendanceGraph = ({barData}) => {
  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Attendance Graph</Text>
      <BarChart
        barWidth={12}
        spacing={25}
        noOfSections={3}
        barBorderRadius={4}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelTexts={['0', '25', '75', '100']}
        yAxisTextStyle={{fontSize: 8, color: 'gray'}}
        xAxisLabelStyle={{fontSize: 8, color: 'gray'}}
        xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
        showGradient
        gradientColor="#147df5"
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
    paddingBottom: 100,
  },
  graphTitle: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'Raleway-Bold',
    marginBottom: 10,
  },
});
