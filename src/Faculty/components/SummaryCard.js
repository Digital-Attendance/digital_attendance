import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LottieView from 'lottie-react-native';

const Performers = () => {
  return (
    <View style={styles.performersContainer}>
      <TouchableOpacity
        style={[styles.profilePicContainer, styles.profilePic1]}>
        <Image
          source={{
            uri: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
          }}
          style={styles.profilePic}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profilePicContainer, styles.profilePic2]}>
        <Image
          source={{
            uri: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
          }}
          style={styles.profilePic}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.profilePicContainer, styles.profilePic3]}>
        <Image
          source={{
            uri: 'http://placebear.com/250/250',
          }}
          style={styles.profilePic}
        />
      </TouchableOpacity>
    </View>
  );
};

const SummaryCard = () => {
  const [progress, setProgress] = useState(70);
  const getTintColor = progress => {
    const lightness = 30 + (progress / 100) * 60;
    return `hsl(90, 100%, 55.70%)`;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundCard1} />
      {/* <View style={styles.backgroundCard2} /> */}
      <View style={styles.mainCard}>
        <View style={styles.subjectNameContainer}>
          <Text style={styles.subjectName}>Digital Circuit</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statsDataContainer}>
            <View style={styles.statsSubContainer}>
              <View style={styles.statsSubContainerData}>
                {/* <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color="#EB5939"
                /> */}
                <LottieView
                  source={require('../../../assets/animations/person.json')}
                  autoPlay
                  loop
                  style={{width: 45, height: 45}}
                />
              </View>
              <View style={styles.statsSubContainerData}>
                <View style={styles.statsSubContainerDataHeaderContainer}>
                  <Text style={styles.statsSubContainerDataHeaderTitle}>
                    Students
                  </Text>
                </View>
                <View style={styles.statsSubContainerDataDataContainer}>
                  <Text style={styles.statsSubContainerDataHeaderText}>41</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressSection}>
              <AnimatedCircularProgress
                size={80}
                width={9}
                fill={progress}
                rotation={0}
                tintColor={getTintColor(progress)}
                backgroundColor="#005758"
              />
              <Text style={styles.progressText}>{progress}%</Text>
              <Text style={styles.progressTitle}>AVG Attendance</Text>
              <Text style={styles.progressSubTitle}>Last 5 Days</Text>
            </View>
          </View>
          <View style={styles.statsDataContainer}>
            <View style={styles.statsSubContainer}>
              <View style={styles.statsSubContainerData}>
                {/* <MaterialCommunityIcons
                  name="counter"
                  size={20}
                  color="#851DE0"
                /> */}
                <LottieView
                  source={require('../../../assets/animations/classes_3.json')}
                  autoPlay
                  loop
                  style={{width: 45, height: 45}}
                />
              </View>
              <View style={styles.statsSubContainerData}>
                <View style={styles.statsSubContainerDataHeaderContainer}>
                  <Text style={styles.statsSubContainerDataHeaderTitle}>
                    Classes
                  </Text>
                </View>
                <View style={styles.statsSubContainerDataDataContainer}>
                  <Text style={styles.statsSubContainerDataHeaderText}>2</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.performanceContainer}>
            <Text style={styles.performanceTitle}>Leaderboard</Text>
            <Performers />
          </View>
          <View style={styles.lastClassContainer}>
            <View style={styles.lastClassIconContainer}>
              {/* <MaterialCommunityIcons
                name="book-variant"
                size={12}
                color="#daa520"></MaterialCommunityIcons> */}
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
      </View>
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
    // paddingBottom: 10,
    // borderColor: '#f00',
  },

  backgroundCard1: {
    position: 'absolute',
    top: 15,
    width: '100%',
    height: '100%',
    // backgroundColor: 'skyblue',
    backgroundColor: '#005758',
    opacity: 0.5,
    borderRadius: 30,
    zIndex: 0,
  },

  // backgroundCard2: {
  //   position: 'absolute',
  //   // top: -10,
  //   width: '100%',
  //   height: 158,
  //   backgroundColor: '#F5EEE7',
  //   opacity: 0.75,
  //   borderRadius: 30,
  //   zIndex: 1,
  // },
  mainCard: {
    width: '100%',
    backgroundColor: '#005758',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 15,
    // borderWidth: 1,
    // borderColor: '#0f0',
  },

  subjectNameContainer: {
    marginTop: 10,
    // borderWidth: 1,
    // borderColor: '#0f0',
  },
  subjectName: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // marginTop: 15,
    justifyContent: 'space-evenly',
    // borderWidth: 1,
    padding: 10,
    // borderColor: '#f00',
  },

  progressContainer: {
    // marginRight: 40,
    // borderWidth: 1,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    top: 30,
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },
  progressTitle: {
    fontSize: 8,
    marginTop: 3,
    color: 'skyblue',
    fontFamily: 'Raleway-SemiBold',
  },
  progressSubTitle: {
    fontSize: 6,
    color: 'skyblue',
    fontFamily: 'Raleway-SemiBold',
  },
  statsDataContainer: {
    justifyContent: 'space-evenly',
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#f0f',
  },
  statsSubContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // padding: 5,
    // borderColor: '#f0f',
  },
  statsSubContainerData: {
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-around',
    // padding: 8,
    // borderWidth: 1,
  },
  statsSubContainerDataHeaderTitle: {
    fontSize: 8,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  statsSubContainerDataHeaderText: {
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
  performersContainer: {
    // marginTop: 5,
    // borderWidth: 1,
    // borderColor: '#fff',
  },
  profilePicContainer: {
    position: 'absolute',
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },

  profilePic1: {
    left: 0,
  },

  profilePic2: {
    left: 15,
  },

  profilePic3: {
    left: 30,
  },

  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
