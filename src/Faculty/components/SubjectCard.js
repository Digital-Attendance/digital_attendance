import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import SummaryCard from './SummaryCard';
import graphValues from '../../DummyDatas/graphDatas';
import AttendanceGraph from './AttendanceGraph';
import SwipeButton from './SwipeButton';

const {width} = Dimensions.get('window');

const SubjectCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = [1, 2, 3, 4, 5];

  const [barData, setBarData] = useState(graphValues[0]);
  const [isSwipeActive, setIsSwipeActive] = useState(false);


  const updateGraphData = index => {
    index = index % graphValues.length;
    setBarData(graphValues[index]);
  };


  const renderItem = ({item, index}) => (
    <SummaryCard
      key={index}
      index={index}
    />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.subcontainer}>
        <Carousel
          data={data}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
          layout="default"
          scrollEnabled={!isSwipeActive}
          onSnapToItem={index => {
            setActiveIndex(index);
            updateGraphData(index);
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
        <AttendanceGraph barData={barData} />
      </View>
      <SwipeButton setIsSwipeActive={setIsSwipeActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  subcontainer: {},
});

export default SubjectCard;
