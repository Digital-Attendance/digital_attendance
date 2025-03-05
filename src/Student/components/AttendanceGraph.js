import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {LineChart} from 'react-native-gifted-charts';

const AttendanceGraph = ({cumulativeAttendance}) => {
  console.log('Student BarData:', cumulativeAttendance);
  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Attendance %</Text>
      {cumulativeAttendance.length > 0 ? (
        <View style={{width: '100%'}}>
          <LineChart
            data={cumulativeAttendance}
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
            // showDataPoints
            // dataPointsColor="#147df5"
            // dataPointsRadius={3}
            showVerticalLines
            verticalLinesThickness={10}
            verticalLinesColor="#147df5"
            verticalLinesUptoDataPoint
            hideRules
            xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
            yAxisLabelTexts={['0', '25', '50', '75', '100']}
            yAxisTextStyle={{fontSize: 10, color: 'gray'}}
            verticalLinesStrokeLinecap="butt"
            
          />
        </View>
      ) : (
        <View
          style={{alignItems: 'center', height: 260, justifyContent: 'center'}}>
          <Text style={{color: 'gray', marginTop: 10}}>
            No attendance data available.
          </Text>
        </View>
      )}
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
