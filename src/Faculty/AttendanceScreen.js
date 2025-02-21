import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {format, subMonths, eachDayOfInterval} from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Leaderboard from './components/Leaderboard';
import Records from './components/Records';

import students from '../DummyDatas/studentsData';
import DeleteSubject from './components/DeleteSubject';
import DownloadButton from './components/DownloadButton';

const AttendanceScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const startDate = subMonths(today, 1);
  const dates = eachDayOfInterval({start: startDate, end: today}).reverse();

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#005758', '#004d4d']} style={styles.header}>
        <View style={styles.subjectContainer}>
          <Text
            style={styles.subjectName}
            numberOfLines={1}
            ellipsizeMode="tail">
            Introduction to Computing
          </Text>
          <Text style={styles.subjectCode}>CS 101</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={toggleMenu}>
          <MaterialCommunityIcons name="trash-can-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Modal transparent={true} visible={menuVisible} animationType="none">
          <Pressable style={styles.overlay} onPress={toggleMenu}>
            <DeleteSubject toggleMenu={toggleMenu} subjectCode="CS 101" />
          </Pressable>
        </Modal>
      </LinearGradient>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedDate(null);
          }}>
          <LinearGradient
            colors={['#FF6200', '#FDB777']}
            style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Stats</Text>
          </LinearGradient>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}>
          {dates.map((date, index) => (
            <View style={{alignItems: 'center'}} key={index}>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDate(
                    selectedDate?.getTime() === date.getTime()
                      ? null
                      : new Date(date),
                  );
                }}
                style={[
                  styles.dateItem,
                  selectedDate?.getTime() === date.getTime()
                    ? styles.selectedDate
                    : styles.unselectedDate,
                ]}>
                <Text
                  style={
                    selectedDate?.getTime() === date.getTime()
                      ? styles.selectedDateText
                      : styles.unselectedDateText
                  }>
                  {format(date, 'dd')}
                </Text>
                <Text style={styles.dateText}>{format(date, 'EEE')}</Text>
              </TouchableOpacity>
              <Text style={styles.monthText}>{format(date, 'MMM')}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {selectedDate === null ? (
        <Leaderboard students={students} />
      ) : (
        <Records selectedDate={format(selectedDate, 'dd MMM yyyy')} />
      )}
      <DownloadButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#004d4d',
    padding: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 10,
    // shadowRadius: 4,
    // elevation: 100,
  },
  subjectContainer: {
    alignItems: 'center',
    width: '90%',
    // borderWidth: 1,
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
  deleteButton: {
    // borderWidth: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // menuContainer: {
  //   position: 'absolute',
  //   top: 60,
  //   right: 40,
  //   backgroundColor: '#004d4d',
  //   paddingHorizontal: 10,
  //   borderWidth: 0.1,
  //   borderRadius: 8,
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  //   elevation: 5,
  //   width: 80,
  // },
  // menuItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 8,
  // },
  // menuText: {
  //   fontSize: 10,
  //   marginLeft: 10,
  //   color: '#fff',
  // },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20
  },
  statsContainer: {
    backgroundColor: 'orange',
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  statsTitle: {
    fontSize: 12,
    fontFamily: 'Raleway-SemiBold',
  },
  dateScroll: {
    flexGrow: 0,
  },
  dateItem: {
    width: 49,
    height: 50,
    borderRadius: 10,
    borderWidth: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  selectedDate: {
    backgroundColor: '#007BFF',
  },
  unselectedDate: {
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 8,
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
  },
  monthText: {
    fontSize: 8,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    marginTop: 4,
  },

  selectedDateText: {
    color: 'white',
    fontFamily: 'Raleway-Bold',
  },
  unselectedDateText: {
    color: 'black',
    fontFamily: 'Raleway-SemiBold',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRecords: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
});

export default AttendanceScreen;
