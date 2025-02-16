// import React from 'react';
// import {View, Text} from 'react-native';
// import {LineChart} from 'react-native-gifted-charts';

// const MultiAreaChart = () => {
//   const data1 = [
//     {value: 300, label: '15 APRIL'},
//     {value: 250},
//     {value: 200},
//     {value: 220},
//     {value: 280},
//     {value: 150},
//     {value: 400, label: '21 APRIL'},
//   ];

//   const data2 = [
//     {value: 200},
//     {value: 180},
//     {value: 260},
//     {value: 210},
//     {value: 170},
//     {value: 120},
//     {value: 220},
//   ];

//   return (
//     <View style={{padding: 20}}>
//       <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
//         Attendance % by Subject
//       </Text>
//       <Text
//         style={{
//           fontSize: 14,
//           textAlign: 'center',
//           color: 'gray',
//           marginBottom: 10,
//         }}>
//         15 April - 21 April
//       </Text>

//       <LineChart
//         data={data1}
//         data2={data2} // For multiple lines
//         width={200}
//         height={150}
//         spacing={40}
//         initialSpacing={20}
//         isBezier
//         thickness={2}
//         color1="blue"
//         color2="red"
//         hideDataPoints
//         areaChart
//         startFillColor1="rgba(0, 100, 255, 0.4)"
//         startFillColor2="rgba(255, 0, 0, 0.4)"
//         endFillColor1="rgba(0, 100, 255, 0.1)"
//         endFillColor2="rgba(255, 0, 0, 0.1)"
//         yAxisLabelTexts={['0', '250', '500']}
//         xAxisLabelStyle={{fontSize: 12, color: 'gray'}}
//         yAxisTextStyle={{fontSize: 12, color: 'gray'}}
//         hideRules
//       />

//       {/* Legend for Points */}
//       <View
//         style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
//         <View
//           style={{flexDirection: 'row', alignItems: 'center', marginRight: 15}}>
//           <View
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: 5,
//               backgroundColor: 'blue',
//             }}
//           />
//           <Text style={{marginLeft: 5}}>Point 01</Text>
//         </View>
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <View
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: 5,
//               backgroundColor: 'red',
//             }}
//           />
//           <Text style={{marginLeft: 5}}>Point 02</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default MultiAreaChart;
import React from 'react';
import {View, Text} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

const MultiLineChart = () => {
  const data1 = [
    {value: 0, label: 'Mon'},
    {value: 70, label: 'Tue'},
    {value: 75, label: 'Wed'},
    {value: 50, label: 'Thurs'},
    {value: 85, label: 'Fri'},
  ];

  const data2 = [
    {value: 0, label: 'Mon'},
    {value: 65, label: 'Tue'},
    {value: 70, label: 'Wed'},
    {value: 45, label: 'Thurs'},
    {value: 50, label: 'Fri'},
  ];

  const data3 = [
    {value: 0, label: 'Mon'},
    {value: 55, label: 'Tue'},
    {value: 50, label: 'Wed'},
    {value: 80, label: 'Thurs'},
    {value: 30, label: 'Fri'},
  ];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Raleway-SemiBold',
          textAlign: 'center',
        }}>
        Attendance % by Subject
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'Raleway-Regular',
          textAlign: 'center',
          color: 'gray',
          marginBottom: 10,
        }}>
        12 Feb - 16 Feb
      </Text>
      <LineChart
        data={data1}
        data2={data2}
        data3={data3}
        // areaChart
        curved
        // startFillColor1="#2973B2"
        // startFillColor2="#FFA09B"
        // startFillColor3="skyblue"
        // startOpacity={0.8}
        // endOpacity={0.3}
        width={250}
        height={150}
        spacing={40}
        initialSpacing={20}
        thickness={0.5}
        color1="#2973B2"
        color2="#FFA09B"
        color3="skyblue"
        hideDataPoints={true}
        yAxisLabelTexts={['0', '25', '75', '100']}
        yAxisTextStyle={{fontSize: 8, color: 'gray'}}
        xAxisLabelStyle={{fontSize: 8, color: 'gray'}}
        hideRules={true}
        xAxisLabelTextStyle={{fontSize: 8, color: 'gray'}}
        xAxisLength={200}
      />

      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: '#2973B2',
            }}
          />
          <Text
            style={{marginLeft: 5, fontSize: 8, fontFamily: 'Raleway-Regular'}}>
            CS101
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 15}}>
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: '#FFA09B',
            }}
          />
          <Text
            style={{marginLeft: 5, fontSize: 8, fontFamily: 'Raleway-Regular'}}>
            EI101
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: '#9ACBD0',
            }}
          />
          <Text
            style={{marginLeft: 5, fontSize: 8, fontFamily: 'Raleway-Regular'}}>
            ME101
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MultiLineChart;
