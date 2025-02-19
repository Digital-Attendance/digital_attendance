import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar, Badge } from '@rneui/themed'

const Navbar = () => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', {weekday: 'long'});
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <View style={styles.navContainer}>
      <View style={styles.navbarTextHeader}>
        <Text style={styles.navbarText}>{dayName}</Text>
        <Text style={styles.navbarSubText}>{formattedDate}</Text>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="notifications-outline" size={24} color="#1E1E1E" />
        <View style={styles.badge}/>
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 20,
  },
  navbarText: {
    color: '#1E1E1E',
    fontSize: 35,
    fontFamily: 'Raleway-ExtraBold',
  },
  navbarSubText: {
    color: '#ccc',
    fontSize: 15,
    fontFamily: 'JosefinSans-Regular',
  },
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 8,
    backgroundColor: '#e3000f',
    width: 10,
    height: 10,
    borderRadius: 10,
  },
});
