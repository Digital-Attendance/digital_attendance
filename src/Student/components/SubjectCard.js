import React, {useState, useEffect, useCallback} from 'react';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useUserContext} from '../../Context';
import SummaryCard from './SummaryCard';
import AttendanceGraph from './AttendanceGraph';
import AttendanceButton from './AttendanceButton';
import BASE_URL from '../../../url';

const {width} = Dimensions.get('window');

const SubjectCard = ({refresh}) => {
  const {userEmail} = useUserContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = () => {
    axios
      .get(`${BASE_URL}/student/dashboard/${userEmail}`)
      .then(response => {
        setSubjects(response.data);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchSubjects();
  }, [refresh]);

  const renderItem = useCallback(({item, index}) => {
    return <SummaryCard key={index} subjectRecord={item} />;
  }, []);

  return (
    <View style={styles.wrapper}>
      {subjects.length > 0 ? (
        <>
          <Carousel
            data={subjects}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width}
            layout="default"
            scrollEnabled={true}
            onSnapToItem={index => {
              setActiveIndex(index);
            }}
          />
          <Pagination
            dotsLength={subjects.length}
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
          <AttendanceGraph
            cumulativeAttendance={subjects[activeIndex]?.cumulativeAttendance}
          />

          <AttendanceButton key={activeIndex} subjectCode={subjects[activeIndex]?.subjectCode} />
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
            to enroll in subjects.
          </Text>
        </View>
      )}
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
