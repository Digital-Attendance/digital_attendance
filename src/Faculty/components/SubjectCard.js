import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import SummaryCard from './SummaryCard';
import graphValues from '../../DummyDatas/graphDatas';
import students from '../../DummyDatas/leaderboardData';
import AttendanceGraph from './AttendanceGraph';
import SwipeButton from './SwipeButton';
import Buttons from './Buttons';
import Leaderboard from './Leaderboard';

const {width} = Dimensions.get('window');

const SubjectCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = [1, 2, 3, 4, 5];

  const [barData, setBarData] = useState(graphValues[0]);
  const [showPerformers, setShowPerformers] = useState(false);

  const togglePerformers = () => {
    console.log(showPerformers);
    setShowPerformers(prev => !prev);
  };

  const updateGraphData = index => {
    index = index % graphValues.length;
    setBarData(graphValues[index]);
  };

  // const fadeAnim = useRef(new Animated.Value(1)).current;

  // const hideAddButton = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 30,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const showAddButton = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 30,
  //     useNativeDriver: true,
  //   }).start();
  // };

  const renderItem = ({item, index}) => (
    <SummaryCard
      key={index}
      index={index}
      onTogglePerformers={togglePerformers}
    />
  );

  return (
    <View style={styles.wrapper}>
      {/* <SwipeButton /> */}
      <View style={styles.subcontainer}>
        <Carousel
          data={data}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
          layout="default"
          // onScrollBeginDrag={hideAddButton}
          // onScrollEndDrag={showAddButton}
          // loop={true}
          onSnapToItem={index => {
            setActiveIndex(index);
            updateGraphData(index);
            setShowPerformers(false);
          }}
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
        {showPerformers && <Leaderboard students={students} />}
        <AttendanceGraph barData={barData} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  subcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default SubjectCard;
