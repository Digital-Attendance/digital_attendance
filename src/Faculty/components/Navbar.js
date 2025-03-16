import React,{useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from './SideMenu';

const Navbar = () => {
  const [isSideMenuVisible, setSideMenuVisibility] = useState(false);
  const navigation = useNavigation();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', {weekday: 'long'});
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleSideMenu = () => {
    setSideMenuVisibility(prev => !prev);
  }


  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        onPress={toggleSideMenu}
        style={styles.navbarTextHeader}>
        <Text style={styles.navbarText}>{dayName}</Text>
        <Text style={styles.navbarSubText}>{formattedDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddSubject');
        }}
        style={styles.iconButton}>
        <MaterialCommunityIcons
          name="shape-square-plus"
          size={30}
          color="#009f9f"
        />
      </TouchableOpacity>
      {isSideMenuVisible && <SideMenu toggleSideMenu={toggleSideMenu} />}
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarTextHeader: {
    
  },
  navbarText: {
    color: '#f0f0f0',
    fontSize: 35,
    fontFamily: 'Teko-Bold',
  },
  navbarSubText: {
    top: -20,
    color: '#ccc',
    fontSize: 15,
    fontFamily: 'JosefinSans-Regular',
  },
  iconButton: {
    padding: 12,
  },
});
