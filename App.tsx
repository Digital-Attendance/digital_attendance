import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AsyncStorageProvider} from './src/Context';
import Toast,{BaseToast,ErrorToast,ToastConfigParams} from 'react-native-toast-message';

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
import SubjectInfo from './src/Student/SubjectInfo';
import ArchivedSubjects from './src/Faculty/ArchivedSubjects';
import EnrollRequests from './src/Faculty/EnrollRequests';
import CollabRequests from './src/Faculty/CollabRequests';
import PendingEnrollments from './src/Student/PendingEnrollments';
import GetStartedFaculty from './src/Faculty/GetStartedFaculty';
import GetStartedStudent from './src/Student/GetStartedStudent';

const toastConfig = {
  success: (props : ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'transparent', backgroundColor: '#E8F5E9' }}
      contentContainerStyle={{ padding:0 }}
      text1Style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
  error: (props: ToastConfigParams<any>) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'transparent', backgroundColor: '#FFEBEE', }}
      contentContainerStyle={{ padding: 0 }}
      text1Style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
  info: (props: ToastConfigParams<any>) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'transparent', backgroundColor: '#1E1E1E', }}
      contentContainerStyle={{ padding: 0 }}
      text1Style={{
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 14,
        color: 'black',
      }}
    />
  ),
};

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
              <Stack.Screen name="GetStartedFaculty" component={GetStartedFaculty} />
              <Stack.Screen name="Faculty_Home" component={Faculty_Home} />
              <Stack.Screen name="AddSubject" component={AddSubject} />
              <Stack.Screen name="EnrollRequests" component={EnrollRequests} />
              <Stack.Screen name="CollabRequests" component={CollabRequests} />
              <Stack.Screen
                name="AttendanceScreen"
                component={AttendanceScreen}
              />
              <Stack.Screen name="ArchivedSubjects" component={ArchivedSubjects} />
              {/* Student Screens */}
              <Stack.Screen name="GetStartedStudent" component={GetStartedStudent} />
              <Stack.Screen name="Student_Home" component={Student_Home} />
              <Stack.Screen name="SubjectInfo" component={SubjectInfo} />
              <Stack.Screen name="EnrollSubject" component={EnrollSubject} />
              <Stack.Screen name="VerifyLocation" component={VerifyLocation} />
              <Stack.Screen
                name="LivenessDetection"
                component={LivenessDetection}
              />
              <Stack.Screen name="PendingEnrollments" component={PendingEnrollments} />
            </Stack.Navigator>
          </NavigationContainer>
        </AsyncStorageProvider>
      <Toast config={toastConfig} />
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
