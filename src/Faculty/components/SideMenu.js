import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Animated, {SlideInLeft, SlideOutLeft} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
const SideMenu = ({toggleSideMenu}) => {
  const navigation = useNavigation();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    navigation.popTo('SplashScreen');
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={toggleSideMenu} />
      <Animated.View
        entering={SlideInLeft}
        exiting={SlideOutLeft}
        style={styles.menuContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Digital Attendance</Text>
        </View>
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem} onPress={()=>{navigation.navigate("ArchivedSubjects")}} >
            <MaterialCommunityIcons name="archive" size={20} color="grey" />
            <Text style={styles.menuItemText}>View Archive Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialCommunityIcons name="account" size={20} color="grey" />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 2,
    // backgroundColor: '',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    height: height,
    backgroundColor: '#1E1E1E',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'JosefinSans-Bold',
    color: '#2196F3FF',
  },
  menuItems: {
    // flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 15,
    color: '#fff',
    fontFamily: 'Raleway-Regular',
  },
});
