import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
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
const SummaryCard = ({onTogglePerformers}) => {
  const [progress, setProgress] = useState(70);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundCard1} />
      <LinearGradient colors={['#004d4d', '#007a7a']} style={styles.mainCard}>
        <View style={styles.subjectName_ButtonContainer}>
          <View style={styles.subjectNameContainer}>
            <Text style={styles.subjectName}>CS 101</Text>
            <Text style={styles.subjectSubName}>Introduction to Computing</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleMenu}>
              <MaterialCommunityIcons
                name="dots-vertical"
                color="#fff"
                size={20}
              />
            </TouchableOpacity>
          </View>
          {/* Dropdown Menu */}
          <Modal transparent={true} visible={menuVisible} animationType="fade">
            <Pressable style={styles.overlay} onPress={toggleMenu}>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  // onPress={() => alert('Edit Pressed')}
                  >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={10}
                    color="#000"
                  />
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  // onPress={() => alert('Delete Pressed')}
                  >
                  <MaterialCommunityIcons
                    name="delete"
                    size={10}
                    color="#d9534f"
                  />
                  <Text style={[styles.menuText, {color: '#d9534f'}]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressSection}>
              <AnimatedCircularProgress
                size={80}
                width={9}
                fill={progress}
                rotation={-90}
                arcSweepAngle={180}
                // tintColor="#8eff1d"
                backgroundColor="#005758"
                tintColor="url(#gradient)"
                renderCap={({center}) => (
                  <Defs>
                    <SVGLinearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%">
                      <Stop offset="0%" stopColor="#00F260" stopOpacity="1" />
                      <Stop offset="100%" stopColor="#0575E6" stopOpacity="1" />
                    </SVGLinearGradient>
                  </Defs>
                )}
              />
              <Text style={styles.progressText}>{progress}%</Text>
              <Text style={styles.progressTitle}>AVG Attendance</Text>
              <Text style={styles.progressSubTitle}>Last 5 Days</Text>
            </View>
          </View>
          <View style={styles.statsDataContainer}>
            <View style={styles.statsSubContainer}>
              <View style={styles.statsSubContainerData}>
                <LottieView
                  source={require('../../../assets/animations/person_3.json')}
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
            <View style={styles.statsSubContainer}>
              <View style={styles.statsSubContainerData}>
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
          <TouchableOpacity
            style={styles.performanceContainer}
            onPress={onTogglePerformers}>
            <Text style={styles.performanceTitle}>Leaderboard</Text>
            <Performers performers={performerImages} />
          </TouchableOpacity>
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
    paddingBottom: 20,
    // borderWidth: 1,
    // borderColor: '#f00',
  },

  backgroundCard1: {
    position: 'absolute',
    top: 15,
    width: '100%',
    height: '100%',
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
    paddingBottom: 10,
    // borderWidth: 1,
    // borderColor: '#0f0',
  },
  subjectName_ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
  },
  subjectNameContainer: {
    marginTop: 10,
    // borderWidth: 1,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menuContainer: {
    position: 'absolute',
    top : 150,
    right: 40,
    backgroundColor: '#004d4d',
    paddingHorizontal: 10,
    borderWidth: 0.1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 80,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 10,
    marginLeft: 10,
    color: '#fff',
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
    justifyContent: 'space-evenly',
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#f0f',
  },
  statsSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // padding: 5,
    // borderColor: '#f0f',
  },
  statsSubContainerData: {
    alignItems: 'center',
    // justifyContent: 'center',
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
