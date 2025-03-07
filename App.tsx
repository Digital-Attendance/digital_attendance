import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';

import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AsyncStorageProvider} from './src/Context';

const Stack = createStackNavigator();

import SplashScreen from './src/SplashScreen';
import Start from './src/Start';
import Login from './src/Login';
import Register from './src/Register';
import Registration_FaceVerification from './src/Registration_FaceVerification';
import ForgotPassword from './src/ForgotPassword';
import PasswordResetOTPVerification from './src/PasswordResetOtpVerification';
import ResetPassword from './src/ResetPassword';
import EmailOTPVerification from './src/EmailOTPVerification';

import Faculty_Home from './src/Faculty/Faculty_Home';
import AttendanceScreen from './src/Faculty/AttendanceScreen';
import AddSubject from './src/Faculty/AddSubject';
import Student_Home from './src/Student/Student_Home';
import VerifyLocation from './src/Student/VerifyLocation';
import LivenessDetection from './src/Student/LivenessDetection';
import EnrollSubject from './src/Student/EnrollSubject';

import Toast from 'react-native-toast-message';
import SubjectInfo from './src/Student/SubjectInfo';


const App = () => {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'#1E1E1E'} />
        <AsyncStorageProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="Start" component={Start} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen
                name="FaceVerification"
                component={Registration_FaceVerification}
              />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen
                name="OTPVerification"
                component={PasswordResetOTPVerification}
              />
              <Stack.Screen
                name="EmailVerification"
                component={EmailOTPVerification}
              />
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
              {/* Faculty Screens */}
              <Stack.Screen name="Faculty_Home" component={Faculty_Home} />
              <Stack.Screen name="AddSubject" component={AddSubject} />
              <Stack.Screen
                name="AttendanceScreen"
                component={AttendanceScreen}
              />
              {/* Student Screens */}
              <Stack.Screen name="Student_Home" component={Student_Home} />
              <Stack.Screen name="SubjectInfo" component={SubjectInfo} />
              <Stack.Screen name="EnrollSubject" component={EnrollSubject} />
              <Stack.Screen name="VerifyLocation" component={VerifyLocation} />
              <Stack.Screen
                name="LivenessDetection"
                component={LivenessDetection}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AsyncStorageProvider>
      <Toast />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
});

export default App;
