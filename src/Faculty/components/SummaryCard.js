import React, {useState, useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  LinearGradient as SVGLinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import Performers from './Performers';
import performerImages from '../../DummyDatas/performersImages';
const SummaryCard = () => {
  const [progress, setProgress] = useState(70);
  const navigation = useNavigation();

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
              <Stop offset="0%" stopColor="#00F260" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0575E6" stopOpacity="1" />
            </SVGLinearGradient>
          </Defs>
        )}
      />
    ),
    [progress],
  );

  return (
    <View style={styles.wrapper}>
      {/* <View style={styles.backgroundCard1} /> */}
      <LinearGradient colors={['#007a7a', '#004d4d']} style={styles.mainCard}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AttendanceScreen');
          }}
          style={styles.subjectName_ButtonContainer}>
          <View style={styles.subjectNameContainer}>
            <Text style={styles.subjectName}>CS101</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.subjectSubName}>Introduction to Computing</Text>
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
              <Text style={styles.progressTitle}>AVG Attendance</Text>
              <Text style={styles.progressSubTitle}>Last 5 Days</Text>
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
                  Students
                </Text>

                <Text style={styles.statsDataSubContainerBoxText}>41</Text>
              </View>
              <View style={styles.statsDataSubContainerBox}>
                <Text style={styles.statsDataSubContainerBoxTitle}>
                  Classes
                </Text>

                <Text style={styles.statsDataSubContainerBoxText}>2</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.performanceContainer}>
            <Text style={styles.performanceTitle}>Leaderboard</Text>
            <Performers performers={performerImages} />
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
            <Text style={styles.lastClassDateText}>12/02/2025</Text>
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
    // borderColor: '#f00',
  },

  // backgroundCard1: {
  //   position: 'absolute',
  //   top: 12,
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: 'skyblue',
  //   opacity: 0.85,
  //   borderRadius: 30,
  //   zIndex: 0,
  // },

  mainCard: {
    width: '100%',
    backgroundColor: '#005758',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderWidth: 0.1,
    borderBottomWidth : 2,
    borderColor : 'skyblue',
  },
  subjectName_ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
  },
  subjectNameContainer: {
    // marginTop: 10,
    // borderWidth: 1,
    // marginRight : 50,
    // borderColor: '#0f0',
  },
  subjectName: {
    fontSize: 32,
    letterSpacing: 1,
    color: '#fff',
    fontFamily: 'JosefinSans-Bold',
  },
  subjectSubName: {
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
    // borderWidth: 1,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
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
  progressSubTitle: {
    position: 'absolute',
    top: 60,
    fontSize: 6,
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
