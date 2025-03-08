import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {SlideInLeft, SlideOutLeft} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {useUserContext} from '../../Context';
import BASE_URL from '../../../url';
const {width, height} = Dimensions.get('window');
const SideMenu = ({toggleSideMenu}) => {
  const {userEmail, userName} = useUserContext();
  const [requests, setRequests] = useState([]);
  const [profileImage, setProfileImage] = useState(
    'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
  );
  const navigation = useNavigation();

  useEffect(() => {
    const getProfileImage = async () => {
      const image = await AsyncStorage.getItem('profileImage');
      if (image) {
        setProfileImage(image);
      }
    };
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/faculty/pending-requests`,
          {
            params: {email: userEmail},
          },
        );
        setRequests(response.data.pendingRequests || []);
      } catch (error) {
        console.error('Error fetching collab requests:', error);
      }
    };
    getProfileImage();
    fetchRequests();
  }, []);

  const handleRequest = subjectID => {
    setRequests(prevRequests =>
      prevRequests.filter(req => req.subjectID !== subjectID),
    );
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.popTo('SplashScreen');
        },
      },
    ]);
  };

  const selectProfileImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
        AsyncStorage.setItem('profileImage', response.assets[0].uri);
      }
    });
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
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={selectProfileImage}>
            <Image source={{uri: profileImage}} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('ArchivedSubjects');
            }}>
            <MaterialCommunityIcons name="archive" size={20} color="grey" />
            <Text style={styles.menuItemText}>Archive Subjects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('EnrollRequests');
            }}>
            <MaterialCommunityIcons
              name="account-search"
              size={20}
              color="grey"
            />
            <Text style={styles.menuItemText}>Enrollment Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('CollabRequests', {requests, handleRequest});
            }}>
            <View style={{position: 'relative'}}>
              <MaterialCommunityIcons
                name="account-multiple-plus"
                size={20}
                color="grey"
              />
              {requests.length > 0 && <View style={styles.redDot} />}
            </View>
            <Text style={styles.menuItemText}>Collab Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Linking.openURL(
                'mailto:digital.attendance.nits@gmail.com,',
              );
            }}>
            <MaterialCommunityIcons name="account-box" size={20} color="grey" />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="account-box" size={20} color="grey" />
            <Text style={styles.menuItemText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.logout]}
            onPress={handleLogout}>
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
    textAlign: 'center',
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
    // alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#fff',
    // shadowOffset: {width: 40, height: 40},
    // shadowRadius: 0,
    elevation: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userName: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Raleway-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  statsText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 5,
    fontFamily: 'Raleway-Regular',
  },

  menuItems: {
    marginTop: 20,
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
  redDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
