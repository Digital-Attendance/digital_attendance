import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AttendanceStats from './components/AttendanceStats';
import Toast from 'react-native-toast-message';
import BASE_URL from '../../url';
import {useUserContext} from '../Context';
import axios from 'axios';
const SubjectInfo = ({navigation, route}) => {
  const {subjectRecord} = route.params;
  const {userEmail} = useUserContext();
  const handleUnEnroll = () => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to unenroll from this Subject?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Unenroll',
          onPress: async () => {
            try {
              const response = await axios.post(
                `${BASE_URL}/student/unenroll`,
                {
                  subjectCode: subjectRecord.subjectID,
                  email: userEmail,
                },
                {
                  validateStatus: function (status) {
                    return status < 500;
                  },
                },
              );
              

              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'You have successfully unenrolled from this subject!',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
                navigation.goBack();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Failed to unenroll!',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
              }
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Something went wrong!',
                visibilityTime: 1000,
                autoHide: true,
                topOffset: 10,
              });
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#007a7a', '#005758']}
        style={styles.header}>
        <View style={styles.subjectContainer}>
          <Text
            style={styles.subjectName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {subjectRecord.subjectName}
          </Text>
          <Text style={styles.subjectCode}>{subjectRecord.subjectCode}</Text>
        </View>
        <TouchableOpacity onPress={handleUnEnroll}>
          <MaterialCommunityIcons
            name="account-arrow-right"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </LinearGradient>
      <AttendanceStats subjectRecord={subjectRecord} userEmail={userEmail} />
    </View>
  );
};

export default SubjectInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    width: '100%',
  },
  subjectContainer: {
    alignItems: 'center',
    width: '90%',
  },
  subjectName: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },
  subjectCode: {
    fontSize: 10,
    fontFamily: 'Raleway-Medium',
    color: '#ffea00',
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   marginHorizontal: 20,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#fff',
  // },
  // title: {
  //   color: '#fff',
  //   fontSize: 38,
  //   fontFamily: 'Teko-Bold',
  // },
  // subtitle: {
  //   color: '#ffea00',
  //   fontSize: 16,
  //   fontFamily: 'Teko-Medium',
  // },
});
