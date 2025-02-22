import React, {useState} from 'react';
import {View, Dimensions, StyleSheet, Animated} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import SummaryCard from './SummaryCard';
import AttendanceGraph from './AttendanceGraph';
import AttendanceButton from './AttendanceButton';

const {width} = Dimensions.get('window');

const SubjectCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const data = [1, 2, 3, 4, 5];

  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const renderItem = ({item, index}) => (
    <SummaryCard key={index} index={index} />
  );

  return (
    <View style={styles.wrapper}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        layout="default"
        scrollEnabled={!isSwipeActive}
        onSnapToItem={index => {
          setActiveIndex(index);
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
      <AttendanceGraph />
      <AttendanceButton setIsSwipeActive={setIsSwipeActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  subcontainer: {
    flex: 1,
  },
});

export default SubjectCard;
