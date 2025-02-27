import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-gifted-charts';

const AttendanceGraph = () => {
  const attendanceData = [
    {value: 100, label: '1 Mar'},
    {value: 75, label: '2 Mar'},
    {value: 50, label: '3 Mar'},
    {value: 75, label: '5 Mar'},
    {value: 30, label: '7 Mar'},
    {value: 25, label: '11 Mar'},
    {value: 46, label: '13 Mar'},
    {value: 90, label: '16 Mar'},
    {value: 67, label: '21 Mar'},
    {value: 14, label: '24 Mar'},
  ];

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Cumulative Attendance %</Text>
      <View style={{width: '100%'}}>
        <LineChart
          data={attendanceData}
          height={220}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={4}
          
          spacing={50}
          color="rgba(255,255,255,0)" 
          areaChart
          curved
          startFillColor="rgba(51, 105, 255, 0.81)"
          endFillColor="rgba(0, 0, 0, 0.1)"
          startOpacity={0.2}
          endOpacity={0.1}
          hideDataPoints
          showDataPoints
          dataPointsColor="#147df5"
          dataPointsRadius={3}
          showVerticalLines
          verticalLinesThickness={10}
          verticalLinesColor="#147df5"          
          verticalLinesUptoDataPoint
          hideRules
          xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
          yAxisLabelTexts={["0", "25", "50", "75", "100"]}
          yAxisTextStyle={{fontSize: 10, color: 'gray'}}
          verticalLinesStrokeLinecap='butt'
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
