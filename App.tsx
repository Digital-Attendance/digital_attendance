import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AsyncStorageProvider } from "./src/Context";

import Login from "./src/Login";
import Register from "./src/Register";
import Start from "./src/Start";
import Faculty from "./src/Faculty/Faculty";
import Student from "./src/Student/MainPage";
import AttendanceStudent from "./src/AttendanceStudent";
import Registration_FaceVerification from "./src/Registration_FaceVerification";

const Stack = createStackNavigator();

import { enableScreens } from 'react-native-screens';
import ForgotPassword from "./src/ForgotPassword";
import PasswordResetOTPVerification from "./src/PasswordResetOtpVerification";
import ResetPassword from "./src/ResetPassword";
import EmailOTPVerification from "./src/EmailOTPVerification";
import Faculty_Home from "./src/Faculty/Faculty_Home";

// enableScreens();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AsyncStorageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{ 
              headerShown: false,
             }}
          >
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="FaceVerification" component={Registration_FaceVerification} />
            <Stack.Screen name="Faculty" component={Faculty} />
            <Stack.Screen name="Student" component={Student} />
            <Stack.Screen name="AttendanceStudent" component={AttendanceStudent} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="OTPVerification" component={PasswordResetOTPVerification} />
            <Stack.Screen name="EmailVerification" component={EmailOTPVerification} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            {/* Faculty Screens */}
            <Stack.Screen name="Faculty_Home" component={Faculty_Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </AsyncStorageProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfbfe",
  },
});

export default App;
