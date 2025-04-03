import React, {useState, useEffect, useCallback} from 'react';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../../Context';
import SummaryCard from './SummaryCard';
import AttendanceGraph from './AttendanceGraph';
import AttendanceButton from './AttendanceButton';
import BASE_URL from '../../../url';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

const SubjectCard = ({refresh}) => {
  const {userEmail} = useUserContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    const cachedSubjects = await AsyncStorage.getItem('cachedSubjects');
    if (cachedSubjects) {
      const parsedSubjects = JSON.parse(cachedSubjects);
      setSubjects(parsedSubjects);
      if (activeIndex >= parsedSubjects.length) {
        setActiveIndex(0);
      }
    }

    axios
      .get(`${BASE_URL}/student/dashboard/${userEmail}`, {
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
          });
          return;
        }
        const newSubjects = response.data || [];
        setSubjects(newSubjects);
        if (activeIndex >= response.data.length) {
          setActiveIndex(0);
        }
        AsyncStorage.setItem('cachedSubjects', JSON.stringify(response.data));
      })
      .catch(error =>{
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch subjects',
          visibilityTime: 1000,
          autoHide: true,
        });
        setSubjects([]); 
      }
      );

    
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

          <AttendanceButton
            key={activeIndex}
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
