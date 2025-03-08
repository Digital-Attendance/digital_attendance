import React, {useState, useMemo, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {
  LinearGradient as SVGLinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import {format} from 'date-fns';

import Performers from '../../Faculty/components/Performers';


const getProgressColor = progress => {
  if (progress <= 50) return ['#ff0000', '#ff4d4d'];
  if (progress <= 75) return ['#f9ed39', '#f9f9ae'];
  if (progress <= 85) return ['#0575E6', '#00F260'];
  return ['#86e83c', '#2bb539'];
};

const SummaryCard = ({subjectRecord}) => {
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    let attendedClasses = subjectRecord.attendedClasses;
    let totalClasses = subjectRecord.totalClasses;
    let percentage = 0;
    if (totalClasses > 0) {
      percentage = (attendedClasses / totalClasses) * 100;
    }
    setProgress(percentage);
  }, [subjectRecord]);
  const progressColors = getProgressColor(progress);

  const CircularProgress = useMemo(
    () => (
      <AnimatedCircularProgress
        size={80}
        width={9}
        fill={progress}
        rotation={-90}
        arcSweepAngle={180}
        backgroundColor="#005758"
        tintColor="url(#gradient)"
        renderCap={({center}) => (
          <Defs>
            <SVGLinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={progressColors[0]} stopOpacity="1" />
              <Stop
                offset="100%"
                stopColor={progressColors[1]}
                stopOpacity="1"
              />
            </SVGLinearGradient>
          </Defs>
        )}
      />
    ),
    [progress],
  );

  return (
    <View style={styles.wrapper}>
      <LinearGradient colors={['#007a7a', '#004d4d']} style={styles.mainCard}>
        <TouchableOpacity style={styles.subjectContainer} onPress={() => {navigation.navigate('SubjectInfo', {subjectRecord})}}>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectCode}>{subjectRecord.subjectCode}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.subjectTitle}>
              {subjectRecord.subjectName} ({subjectRecord.department} - {subjectRecord.section})
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <View>
              <LottieView
                source={require('../../../assets/animations/loading.json')}
                autoPlay
                loop
                style={{width: 50, height: 50}}
              />
              <View style={{position: 'absolute', top: 21, left: 21}}>
                <MaterialCommunityIcons name="circle" size={8} color={'#fff'} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.statsContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressSection}>
              {CircularProgress}
              <Text style={styles.progressText}>{progress}%</Text>
              <Text style={styles.progressTitle}>Attendance %</Text>
            </View>
          </View>
          <View style={styles.statsDataContainer}>
            <View style={styles.statsIconContainer}>
              <LottieView
                source={require('../../../assets/animations/person_3.json')}
                autoPlay
                loop
                style={{width: 50, height: 50}}
              />

              <LottieView
                source={require('../../../assets/animations/classes_3.json')}
                autoPlay
                loop
                style={{width: 45, height: 45}}
              />
            </View>
            <View style={styles.statsDataSubContainer}>
              <View style={styles.statsDataSubContainerBox}>
                <Text style={styles.statsDataSubContainerBoxTitle}>
                  Present
                </Text>

                <Text style={styles.statsDataSubContainerBoxText}>
                  {subjectRecord.attendedClasses}
                </Text>
              </View>
              <View style={styles.statsDataSubContainerBox}>
                <Text style={styles.statsDataSubContainerBoxTitle}>
                  Classes
                </Text>

                <Text style={styles.statsDataSubContainerBoxText}>
                  {subjectRecord.totalClasses}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.performanceContainer}>
            <Text style={styles.performanceTitle}>Leaderboard</Text>
            <Performers subjectRecord={subjectRecord} />
          </View>
          <View style={styles.lastClassContainer}>
            <View style={styles.lastClassIconContainer}>
              <LottieView
                source={require('../../../assets/animations/lastclass.json')}
                autoPlay
                loop
                style={{width: 20, height: 20}}
              />
              <Text style={styles.lastClassTitle}>Last Class</Text>
            </View>

            <Text style={styles.lastClassDateText}>
              {subjectRecord.lastClassDate === 'No classes yet'
                ? 'No classes yet'
                : format(new Date(subjectRecord.lastClassDate), 'd MMM yyyy')}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SummaryCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // borderWidth: 1,
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#005758',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderWidth: 0.1,
    borderBottomWidth: 2,
    borderColor: 'skyblue',
  },
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectInfo: {},
  subjectCode: {
    fontSize: 32,
    letterSpacing: 1,
    color: '#fff',
    fontFamily: 'JosefinSans-Bold',
  },
  subjectTitle: {
    fontSize: 8,
    color: '#ffea00',
    fontFamily: 'Raleway-Bold',
  },
  buttonContainer: {
    left: 10,
  },

  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    // justifyContent: 'space-evenly',
    // marginTop: 15,
    // borderWidth: 1,
    // borderColor: '#f00',
  },
  progressContainer: {
    marginRight: 40,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    top: 20,
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },
  progressTitle: {
    position: 'absolute',
    top: 50,
    fontSize: 8,
    color: 'skyblue',
    fontFamily: 'Raleway-SemiBold',
  },
  statsDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    top: -10,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: '#f0f',
  },
  statsIconContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    // flexDirection: 'row',
    // borderWidth: 1,
    // padding: 5,
    // borderColor: '#f0f',
  },
  statsDataSubContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    // flexDirection: 'row',
    // borderWidth: 1,
    // padding: 5,
    // borderColor: '#f0f',
  },
  statsDataSubContainerBox: {
    alignItems: 'center',
    // justifyContent: 'center',
    // justifyContent: 'space-around',
    // padding: 8,
    // borderWidth: 1,
  },
  statsDataSubContainerBoxTitle: {
    fontSize: 8,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  statsDataSubContainerBoxText: {
    fontSize: 16,
    color: '#ffea00',
    fontFamily: 'Raleway-Bold',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 10,
    // borderWidth: 1,
    // borderColor: '#f00',
  },
  performanceContainer: {
    // borderWidth: 1,
    // borderColor: '#fff',
  },

  performanceTitle: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  lastClassContainer: {
    alignItems: 'flex-end',
    // borderWidth: 1,
    // borderColor: '#fff',
    // justifyContent : 'flex-end'
  },
  lastClassIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastClassTitle: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  lastClassDateText: {
    fontSize: 8,
    color: '#ffea00',
    fontFamily: 'Raleway-Bold',
    textAlign: 'right',
  },
});
