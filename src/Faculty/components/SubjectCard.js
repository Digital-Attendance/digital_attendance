import React, {useEffect, useState, useCallback} from 'react';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import axios from 'axios';
import {format} from 'date-fns';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-toast-message';
import SummaryCard from './SummaryCard';
import AttendanceGraph from './AttendanceGraph';
import SwipeButton from './SwipeButton';

import {useUserContext} from '../../Context';
import BASE_URL from '../../../url';

const {width} = Dimensions.get('window');

const SubjectCard = ({onRefresh, refresh}) => {
  const {userEmail, isSwipeActive} = useUserContext();

  const [activeIndex, setActiveIndex] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [barData, setBarData] = useState([]);

  const fetchSubjects = async () => {
    const cachedSubjects = await AsyncStorage.getItem('cachedSubjects');

    if (cachedSubjects) {
      const parsedSubjects = JSON.parse(cachedSubjects);
      setSubjects(parsedSubjects);
      setActiveIndex(prevIndex =>
        Math.min(prevIndex, parsedSubjects.length - 1),
      );

      if (parsedSubjects.length > 0) {
        updateGraphData(
          Math.min(activeIndex, parsedSubjects.length - 1),
          parsedSubjects,
        );
      }
    }

    axios
      .get(`${BASE_URL}/faculty/dashboard/${userEmail}`, {
        validateStatus: function (status) {
          return status < 500;
        },
      })
      .then(response => {
        if (response.status !== 200) {
          Toast.show({
            type: 'error',
            text1: 'Failed to fetch subjects',
            visibilityTime: 1000,
            autoHide: true,
            topOffset: 10,
          });
          return;
        }
        const newSubjects = response.data || [];
        setSubjects(newSubjects);
        setActiveIndex(prevIndex =>
          Math.min(prevIndex, newSubjects.length - 1),
        );

        if (newSubjects.length > 0) {
          updateGraphData(
            Math.min(activeIndex, newSubjects.length - 1),
            newSubjects,
          );
        }

        AsyncStorage.setItem('cachedSubjects', JSON.stringify(newSubjects));
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch subjects',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
        setSubjects([]);
      });
  };

  useEffect(() => {
    fetchSubjects();
  }, [refresh]);

  const updateGraphData = (index, data = subjects) => {
    if (data.length > 0) {
      const attendanceRecords = data[index]?.attendanceRecords || [];
      const formattedData = attendanceRecords.map(record => {
        const istDate = new Date(record.date);

        return {
          date: format(istDate, 'd MMM'),
          studentsPresent: Number(
            record.Students.filter(student => student.present).length,
          ),
        };
      });
      setBarData(formattedData);
    }
  };

  const renderItem = useCallback(
    ({item, index}) => {
      return <SummaryCard key={index} subjectRecord={item} />;
    },
    [isSwipeActive],
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
            <AttendanceGraph
              students={subjects[activeIndex]?.numberOfStudents}
              barData={barData}
            />
            <SwipeButton
              key={activeIndex}
              onRefresh={onRefresh}
              subjectID={subjects[activeIndex]?.subjectID}
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
