import React, {useRef, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Text,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SummaryCard from './SummaryCard';
import LottieView from 'lottie-react-native';
import AttendanceGraph from './AttendanceGraph';
import SwipeButton from './SwipeButton';

const {width} = Dimensions.get('window');

// const Card = () => {
//   return (
//     <View style={styles.cardWrapper}>
//       <MaskedView
//         style={styles.cardContainer}
//         maskElement={
//           <Svg
//           width="100%"
//           height="100%"
//           preserveAspectRatio="xMidYMid meet"
//           xmlns="http://www.w3.org/2000/svg">
//             <Path d="M31.8358 249.805L289.479 251C306.548 251.079 320.445 233.445 320.539 211.587L321 104.668C321.094 82.7804 307.315 64.9389 290.223 64.8181L279.644 64.7434C266.144 64.648 255.261 50.5563 255.336 33.2687C255.41 15.9519 244.492 1.84793 230.969 1.79379L32.7752 1.0002C15.7122 0.931858 1.82525 18.5625 1.73109 40.4133L1.00048 209.955C0.906033 231.872 14.721 249.726 31.8358 249.805Z" />
//           </Svg>
//         }>
//         <SummaryCard />
//       </MaskedView>
//       <View style={styles.performersWrapper}>
//         <Performers />
//       </View>
//     </View>
//   );
// };

const SubjectCard = () => {
  const data = [1, 2, 3, 4, 5];
  const [barData, setBarData] = useState([
    {value: 250, label: 'M'},
    {value: 500, label: 'T', frontColor: '#177AD5'},
    {value: 745, label: 'W', frontColor: '#177AD5'},
    {value: 320, label: 'T'},
    {value: 600, label: 'F', frontColor: '#177AD5'},
    {value: 256, label: 'S'},
    {value: 300, label: 'S'},
  ]);
  const updateGraphData = index => {
    const graphValues = [
      [
        {value: 200, label: 'M'},
        {value: 450, label: 'T', frontColor: '#177AD5'},
        {value: 600, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T'},
        {value: 520, label: 'F', frontColor: '#177AD5'},
        {value: 210, label: 'S'},
        {value: 280, label: 'S'},
      ],
      [
        {value: 150, label: 'M'},
        {value: 300, label: 'T', frontColor: '#177AD5'},
        {value: 500, label: 'W', frontColor: '#177AD5'},
        {value: 250, label: 'T'},
        {value: 400, label: 'F', frontColor: '#177AD5'},
        {value: 190, label: 'S'},
        {value: 270, label: 'S'},
      ],
      [
        {value: 180, label: 'M'},
        {value: 370, label: 'T', frontColor: '#177AD5'},
        {value: 560, label: 'W', frontColor: '#177AD5'},
        {value: 300, label: 'T'},
        {value: 480, label: 'F', frontColor: '#177AD5'},
        {value: 230, label: 'S'},
        {value: 290, label: 'S'},
      ],
      [
        {value: 220, label: 'M'},
        {value: 400, label: 'T', frontColor: '#177AD5'},
        {value: 620, label: 'W', frontColor: '#177AD5'},
        {value: 350, label: 'T'},
        {value: 500, label: 'F', frontColor: '#177AD5'},
        {value: 240, label: 'S'},
        {value: 310, label: 'S'},
      ],
      [
        {value: 260, label: 'M'},
        {value: 450, label: 'T', frontColor: '#177AD5'},
        {value: 700, label: 'W', frontColor: '#177AD5'},
        {value: 400, label: 'T'},
        {value: 550, label: 'F', frontColor: '#177AD5'},
        {value: 250, label: 'S'},
        {value: 320, label: 'S'},
      ],
    ];
    setBarData(graphValues[index]);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const hideAddButton = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 30,
      useNativeDriver: true,
    }).start();
  };

  const showAddButton = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({item, index}) => (
    <SummaryCard key={index} index={index} />
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        layout="default"
        onScrollBeginDrag={hideAddButton}
        onScrollEndDrag={showAddButton}
        loop={true}
        onSnapToItem={index => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        containerStyle={{paddingVertical: 2}}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 5,
          backgroundColor: 'skyblue',
        }}
        inactiveDotStyle={{
          backgroundColor: 'gray',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
      <Animated.View style={[styles.addBadge, {opacity: fadeAnim}]}>
        <LottieView
          source={require('../../../assets/animations/loading.json')}
          autoPlay
          loop
          style={{width: 100, height: 100}}
        />
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons
            name="shape-square-plus"
            size={30}
            color="#000"
          />
        </TouchableOpacity>
      </Animated.View>
      <AttendanceGraph barData={barData} />
      <SwipeButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    borderRadius: 40,
    // borderBottomLeftRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 40,
    // backgroundColor: '#2f9576',
    backgroundColor: '#147df5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubjectCard;
