import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
      {/* <TouchableOpacity style={styles.profilePicContainer}>
        <Image
          source={{
            uri: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
          }}
          style={styles.profilePic}
        />
      </TouchableOpacity> */}
      <View style={styles.navbarTextHeader}>
        <Text style={styles.navbarText}>{dayName}</Text>
        <Text style={styles.navbarSubText}>{formattedDate}</Text>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="notifications-outline" size={24} color="#1E1E1E" />
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
    marginBottom: 20,
  },
  //   profilePicContainer: {
  //     width: 40,
  //     height: 40,
  //     borderRadius: 20,
  //     overflow: 'hidden',
  //   },
  //   profilePic: {
  //     width: '100%',
  //     height: '100%',
  //     resizeMode: 'cover',
  //   },
  navbarTextHeader: {},
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
});
