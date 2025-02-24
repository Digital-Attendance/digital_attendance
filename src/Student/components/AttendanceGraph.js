import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-gifted-charts';

const AttendanceGraph = () => {
  const attendanceData = [
    {value: 75, label: '1/02/2025'},
    {value: 78, label: '2/02/2025'},
    {value: 80, label: '3/02/2025'},
    {value: 83, label: '4/02/2025'},
    {value: 85, label: '5/02/2025'},
    {value: 75, label: '6/02/2025'},
    {value: 78, label: '7/02/2025'},
    {value: 80, label: '8/02/2025'},
    {value: 83, label: '9/02/2025'},
    {value: 85, label: '1/02/20250'},
  ];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Cumulative Attendance %</Text>
      <View style={{width: '100%'}}>
        <LineChart
          data={attendanceData}
          // width={300}
          height={220}
          yAxisThickness={0}
          xAxisThickness={0}
          spacing={50}
          color="#147df5"
          isBezier
          areaChart
          curved
          startFillColor="rgba(51, 105, 255, 0.3)"
          endFillColor="rgba(255, 255, 255, 0.1)"
          startOpacity={0.8}
          endOpacity={0.1}
          showDataPoints
          dataPointsColor="#147df5"
          dataPointsRadius={3}
          showVerticalLines
          verticalLinesThickness={8}
          verticalLinesColor="rgba(255, 255, 255, 0.1)"
          verticalLinesUptoDataPoint
          hideRules
          xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
          yAxisTextStyle={{fontSize: 10, color: 'gray'}}
        />
      </View>
    </View>
  );
};

export default AttendanceGraph;

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: 'center',
    padding: 10,
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
