import React, {useState, useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  LinearGradient as SVGLinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';

const getProgressColor = progress => {
  if (progress <= 50) return ['#ff0000', '#ff4d4d'];
  if (progress <= 75) return ['#f9ed39', '#f9f9ae'];
  if (progress <= 85) return ['#0575E6', '#00F260'];
  return ['#86e83c', '#2bb539'];
};

const SummaryCard = () => {
  const [progress, setProgress] = useState(40);
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
        <TouchableOpacity style={styles.subjectContainer}>
          <View style={styles.subjectInfo}>
            <Text style={styles.subjectCode}>CS101</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.subjectTitle}>
              Introduction to Computing
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
            <View style={styles.statsData}>
              <MaterialCommunityIcons name="book" size={20} color={'#fff'} />
              <View style={styles.statsBox}>
                <Text style={styles.statsTitle}>Total</Text>
                <Text style={styles.statsText}>20</Text>
              </View>
            </View>
            <View style={styles.statsData}>
              <MaterialCommunityIcons
                name="account-check"
                size={20}
                color={'#fff'}
              />
              <View style={styles.statsBox}>
                <Text style={styles.statsTitle}>Present</Text>
                <Text style={styles.statsText}>14</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.lastClassContainer}>
          <Text style={styles.lastClassText}>Last class</Text>
          <Text style={styles.lastClassDate}>20/02/2025</Text>
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
    alignItems: 'center',
    width: '100%',
    marginTop: 10,    
    padding: 10,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  statsTitle: {
    fontSize: 8,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  statsText: {
    fontSize: 16,
    color: '#ffea00',
    fontFamily: 'Raleway-Bold',
  },
  lastClassText: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Raleway-SemiBold',
    marginTop: 5,
  },
  lastClassDate: {
    alignSelf: 'flex-end',
    fontSize: 8,
    color: '#ffea00',
    fontFamily: 'Raleway-Bold',
  },
});
