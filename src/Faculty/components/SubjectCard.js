import React, {useEffect, useState} from 'react';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SummaryCard from './SummaryCard';
import graphValues from '../../DummyDatas/graphDatas';
import AttendanceGraph from './AttendanceGraph';
import SwipeButton from './SwipeButton';

import {useUserContext} from '../../Context';
import BASE_URL from '../../../url';

const {width} = Dimensions.get('window');

const SubjectCard = () => {
  const {userEmail} = useUserContext();

  const [activeIndex, setActiveIndex] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [barData, setBarData] = useState([]);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/faculty/dashboard/${userEmail}`)
      .then(response => {
        setSubjects(response.data);
        console.log('response.data:', response.data);
        if (response.data.length > 0) {
          updateGraphData(0, response.data);
        }
      })
      .catch(error => console.log(error));
  }, []);

  const updateGraphData = (index, data = subjects) => {
    if (data.length > 0) {
      const attendanceRecords = data[index].attendanceRecords || [];
      const formattedData = attendanceRecords.map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        studentsPresent: record.presentStudents.length,
      }));
      setBarData(formattedData);
    }
  };

  const renderItem = ({item, index}) => (
    <SummaryCard key={index} index={index} subjectRecord={item} />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.subcontainer}>
        {subjects.length > 0 ? (
          <>
            <Carousel
              data={subjects}
              renderItem={renderItem}
              sliderWidth={width}
              itemWidth={width}
              layout="default"
              scrollEnabled={!isSwipeActive}
              onSnapToItem={index => {
                setActiveIndex(index);
                updateGraphData(index, subjects);
              }}
            />
            <Pagination
              dotsLength={subjects.length}
              activeDotIndex={activeIndex}
              containerStyle={{paddingVertical: 2}}
              dotStyle={styles.activeDot}
              inactiveDotStyle={styles.inactiveDot}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
            <AttendanceGraph barData={barData} />
            <SwipeButton
              setIsSwipeActive={setIsSwipeActive}
              userEmail={userEmail}
              subjectCode={subjects[activeIndex]?.subjectCode}
            />
          </>
        ) : (
          <View style={styles.noSubjectContainer}>
            <Text style={styles.noSubjectText}>No subjects available.</Text>
            <Text style={styles.noSubjectText}>
              Tap the{' '}
              <MaterialCommunityIcons
                name="shape-square-plus"
                size={30}
                color="#009f9f"
              />{' '}
              to add subjects.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  subcontainer: {flex: 1},
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'skyblue',
  },
  inactiveDot: {backgroundColor: 'gray'},
  noSubjectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubjectText: {
    fontSize: 18,
    color: '#aaa',
    fontFamily: 'Raleway-Regular',
  },
});

export default SubjectCard;
