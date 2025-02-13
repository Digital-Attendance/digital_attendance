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
import Faculty from "./src/Faculty";
import Student from "./src/Student";
import AttendanceStudent from "./src/AttendanceStudent";
import Registration_FaceVerification from "./src/Registration_FaceVerification";

const Stack = createStackNavigator();
// import { Easing } from "react-native-reanimated";
import { enableScreens } from 'react-native-screens';
enableScreens();



const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AsyncStorageProvider>
        <NavigationContainer>
          {/* <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
              headerShown: false,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 500, easing: Easing.inOut(Easing.ease) } },
                close: { animation: 'timing', config: { duration: 500, easing: Easing.inOut(Easing.ease) } },
              },
              cardStyleInterpolator: ({ current, next }) => ({
                cardStyle: {
                  transform: [
                    { translateY: current.progress.interpolate({ inputRange: [0, 1], outputRange: [600, 0] }) },
                  ],
                },
              }),
            }}
          > */}
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{ 
              animation: 'slide_from_right',
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
