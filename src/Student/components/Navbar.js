import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = () => {
  const navigation = useNavigation();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', {weekday: 'long'});
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        onLongPress={async () => {
          await AsyncStorage.removeItem('access_token');
          navigation.popTo('SplashScreen');
        }}
        style={styles.navbarTextHeader}>
        <Text style={styles.navbarText}>{dayName}</Text>
        <Text style={styles.navbarSubText}>{formattedDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EnrollSubject');
        }}
        style={styles.iconButton}>
        <MaterialCommunityIcons
          name="shape-square-plus"
          size={30}
          color="#009f9f"
        />
      </TouchableOpacity>
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
    // borderWidth: 1,
    // borderColor: '#005758',
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
