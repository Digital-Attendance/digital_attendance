// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   Dimensions,
// } from 'react-native';
// import Animated, {FadeIn, FadeInUp} from 'react-native-reanimated';
// const {width, height} = Dimensions.get('window');

// const tutorialData = [
//   {
//     image: require('../assets/tutorials/tutorial_10.jpg'),
//     title: 'Register & Explore',
//     description:
//       'Register or Login for your respective Role. Explore the app and get familiar with the features.',
//   },
//   {
//     image: require('../assets/tutorials/tutorial_8.jpg'),
//     title: 'Home Screen (Faculty)',
//     description:
//       'Tap the add subject button to add a new subject. Tap the Date to open the Side Menu',
//   },
//   {
//     image: require('../assets/tutorials/tutorial_11.jpg'),
//     title: 'Side Menu (Faculty)',
//     description: 'Explore the options available in the Side Menu.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_2.jpg'),
//     title: 'Subject Information',
//     description:
//       'The centered Card displays the Subject Information. Press the subject name to navigate into the subject. Swipe the below Attendance Button the start the Attendance.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_6.jpg'),
//     title: 'Attendance Button (Faculty)',
//     description: 'Swipe Back to Stop the Attendance.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_7.jpg'),
//     title: 'Leaderboard (Faculty)',
//     description:
//       'View the Leaderboard of the Subject. Press on any date to view the Attendance of that date. Press the Add Faculty Button to add a new Faculty.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_1.jpg'),
//     title: 'Attendance Record (Faculty)',
//     description:
//       'Press on Delete Icon to delete the Attendance Record. Press on Edit Icon to edit the Attendance Record. Press on Archive Icon to Archive the Subject.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_3.jpg'),
//     title: 'Edit Attendance (Faculty)',
//     description:
//       'Edit the Attendance Record and Press Save to Save the Changes. Press Cancel to Discard the Changes. Swipe the Email Button to Email the Attendance Record.',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_9.jpg'),
//     title: 'Subject Information (Student)',
//     description:
//       'The centered Card displays the Subject Information. Press the subject name to navigate into the subject. Swipe the below  Mark Attendance Button the start the Attendance procedure. Tap the Date to open the Side Menu',
//   },

//   {
//     image: require('../assets/tutorials/tutorial_4.jpg'),
//     title: 'Attendance Record (Student)',
//     description: 'The Attendance Record tracks your attendance.',
//   },
//   {
//     image: require('../assets/tutorials/tutorial_5.jpg'),
//     title: 'Attendance Procedure (Student)',
//     description:
//       'Location Based Attendance Procedure. When location is verified, you are moved to next procedure of liveness detection and facial Recognition.',
//   },
// ];

// const GetStartedScreen = ({navigation}) => {
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleNext = () => {
//     if (currentIndex < tutorialData.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       navigation.navigate('Start');
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     } else {
//       setShowTutorial(false);
//     }
//   };

//   if (!showTutorial) {
//     return (
//       <View style={styles.mainContainer}>
//         <Animated.View entering={FadeIn.duration(800)}>
//           <Image
//             source={require('../assets/splash_black.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </Animated.View>

//         <Animated.Text style={styles.header} entering={FadeInUp.duration(800)}>
//           Welcome to Digital Attendance
//         </Animated.Text>
//         <Animated.Text
//           style={styles.subHeader}
//           entering={FadeInUp.duration(1000)}>
//           No Mercy. No Proxy !
//         </Animated.Text>

//         <Animated.View entering={FadeInUp.duration(1200)}>
//           <TouchableOpacity
//             style={styles.getStartedButton}
//             onPress={() => setShowTutorial(true)}>
//             <Text style={styles.getStartedText}>Get Started</Text>
//           </TouchableOpacity>
//           <View style={styles.skipContainer}>
//             <Text style={styles.skipTitle}>Skip Tutorial ?</Text>
//             <TouchableOpacity
//               style={styles.skipButton}
//               onPress={() => navigation.navigate('Start')}>
//               <Text style={styles.skipsubtitle}>Press here</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Animated.View entering={FadeIn.duration(800)}>
//         <ImageBackground
//           source={require('../assets/phone_frame.png')}
//           style={styles.phoneFrame}
//           resizeMode="cover">
//           <Image
//             source={tutorialData[currentIndex].image}
//             style={styles.tutorialImage}
//             resizeMode="contain"
//           />
//         </ImageBackground>
//       </Animated.View>

//       <Animated.Text style={styles.title} entering={FadeInUp.duration(800)}>
//         {tutorialData[currentIndex].title}
//       </Animated.Text>
//       <Animated.Text
//         style={styles.description}
//         entering={FadeInUp.duration(1000)}>
//         {tutorialData[currentIndex].description}
//       </Animated.Text>

//       <View style={styles.buttonContainer}>
//         {currentIndex > 0 && (
//           <TouchableOpacity
//             style={[styles.button, styles.prevButton]}
//             onPress={handlePrevious}>
//             <Text style={styles.buttonText}>Previous</Text>
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={[styles.button, styles.nextButton]}
//           onPress={handleNext}>
//           <Text style={styles.buttonText}>
//             {currentIndex === tutorialData.length - 1 ? "Let's Go!" : 'Next'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1E1E1E',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
//   header: {
//     fontSize: 24,
//     fontFamily: 'Raleway-Bold',
//     textAlign: 'center',
//     color: '#fff',
//     marginBottom: 10,
//     marginHorizontal: 70,
//   },
//   subHeader: {
//     fontSize: 16,
//     textAlign: 'center',
//     fontFamily: 'Raleway-Regular',
//     color: '#aaa',
//     marginBottom: 20,
//     paddingHorizontal: 20,
//   },
//   getStartedButton: {
//     backgroundColor: '#004d4d',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 8,
//   },
//   getStartedText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//     fontFamily: 'Raleway-Bold',
//   },
//   skipContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   skipButton: {
//     paddingHorizontal: 10,
//   },
//   skipTitle: {
//     color: '#fff',
//     fontSize: 14,
//     fontFamily: 'Raleway-Bold',
//   },
//   skipsubtitle: {
//     color: '#004d4d',
//     fontSize: 14,
//     fontFamily: 'Raleway-Bold',
//     marginLeft: 5,
//   },
//   // backgroundImage: {
//   //   width: width,
//   //   height: height,
//   //   justifyContent: 'flex-end',
//   // },
//   // overlay: {
//   //   flex: 1,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   //   backgroundColor: 'rgba(0, 0, 0, 0.63)',
//   //   padding: 20,
//   //   // paddingLeft: 5,
//   // },
//   infoContainer: {
//     alignItems: 'center',
//   },

//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1E1E1E',
//     padding: 20,
//   },

//   phoneFrame: {
//     width: width * 0.8,
//     height: height * 0.65,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tutorialImage: {
//     width: '82%',
//     height: '72%',
//     borderRadius: 10,
//     position: 'absolute',
//     // top: '14%',
//   },
//   title: {
//     color: '#fff',
//     fontSize: 28,
//     fontFamily: 'Raleway-Bold',
//     marginBottom: 10,
//   },
//   description: {
//     color: '#ddd',
//     fontSize: 14,
//     textAlign: 'center',
//     fontFamily: 'Raleway-Bold',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   button: {
//     backgroundColor: '#004d4d',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//     marginHorizontal: 10,
//   },
//   prevButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//   },
//   nextButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default GetStartedScreen;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const GetStartedScreen = () => {
  return (
    <View>
      <Text>GetStartedScreen</Text>
    </View>
  )
}

export default GetStartedScreen

const styles = StyleSheet.create({})