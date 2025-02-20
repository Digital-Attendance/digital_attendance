import { StyleSheet, Image, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Performers = ({ performers = [] }) => {
  return (
    <View style={styles.performersContainer}>
      {performers.map((performer, index) => (
        <View key={index} style={[styles.profilePicContainer, { left: index * 15 }]}>
          <Image source={{ uri: performer }} style={styles.profilePic} />
        </View>
      ))}
    </View>
  );
};

export default Performers;

const styles = StyleSheet.create({
  performersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicContainer: {
    position: 'absolute',
    top: 8,
    width: 30,
    height: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
