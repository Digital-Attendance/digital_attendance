import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-gifted-charts';

const AttendanceGraph = ({students,barData}) => {
  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Head-Count</Text>
      {barData.length > 0 ? (
        <BarChart
          barWidth={20}
          spacing={50}
          noOfSections={4}
          barBorderRadius={4}
          height={220}
          data={barData.map(item => ({
            value: item.studentsPresent,
            label: item.date,
          }))}
          maxValue={students}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{fontSize: 8, color: 'gray'}}
          xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
          showGradient
          gradientColor="#147df5"
          showValuesAsTopLabel
          hideRules
          topLabelTextStyle={{fontSize: 8, color: 'gray'}}
                
        />
      ) : (
        <View
          style={{alignItems: 'center', height: 240, justifyContent: 'center'}}>
          <Text style={styles.noData}>No attendance data available</Text>
        </View>
      )}
    </View>
  );
};

export default AttendanceGraph;

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: 'center',
    padding: 20,
    paddingLeft: 0,
    borderRadius: 10,
    // backgroundColor: '#1c1c1c',
    // height: 220,
  },
  graphTitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Teko-Bold',
    marginBottom: 10,
    marginLeft: 10,
    width: '100%',
    textAlign: 'center',
  },
  noData: {
    fontSize: 14,
    color: 'gray',
  },
});
