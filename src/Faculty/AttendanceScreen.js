import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {format, parseISO} from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUserContext} from '../Context';
import Leaderboard from './components/Leaderboard';
import Records from './components/Records';
import DeleteSubject from './components/DeleteSubject';
import AddFaculty from './components/AddFaculty';
import DownloadButton from './components/DownloadButton';
import BASE_URL from '../../url';

const AttendanceScreen = ({route}) => {
  const {subjectRecord} = route.params;
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {userEmail} = useUserContext();
  const navigation = useNavigation();

  const [updatedSubjectRecord, setUpdatedSubjectRecord] =
    useState(subjectRecord);

  const handleStudentRemoval = scholarID => {
    setUpdatedSubjectRecord(prev => ({
      ...prev,
      students: prev.students.filter(
        student => student.scholarID !== scholarID,
      ),
    }));
  };

  const handleAttendanceUpdate = updatedRecord => {
    setAttendanceRecords(prevRecords =>
      prevRecords.map(record =>
        record.date === updatedRecord.date ? updatedRecord : record,
      ),
    );
  };
  const handleAttendanceDeletion = deletedDate => {
    setAttendanceRecords(prevRecords =>
      prevRecords.filter(record => record.date !== deletedDate),
    );
    setSelectedDate(null);
  };

  const handleArchiveSubject = async () => {
    try {
      Alert.alert(
        'Archive Subject',
        'Are you sure you want to archive this subject?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Archive',
            onPress: async () => {
              const response = await axios.post(
                `${BASE_URL}/faculty/archive-subject`,
                {
                  subjectCode: subjectRecord.subjectCode,
                  email: userEmail,
                },
                {
                  validateStatus: function (status) {
                    return status < 500;
                  },
                },
              );
              if (response.ok) {
                Toast.show({
                  type: 'success',
                  text1: 'Subject archived successfully',
                  position: 'top',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
                navigation.goBack();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error archiving subject',
                  position: 'top',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
              }
            },
          },
        ],
      );
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error archiving subject',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  const fetchAttendanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/faculty/attendanceRecord/${subjectRecord.subjectCode}`,
      );
      const data = await response.json();
      if (response.ok) {
        setAttendanceRecords(data.attendanceRecords);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error fetching attendance',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching attendance',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    } finally {
      setLoading(false);
    }
  }, [subjectRecord.subjectCode]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  const dates = useMemo(() => {
    return attendanceRecords
      .map(record => {
        const istDate = new Date(record.date);
        return istDate;
      })
      .sort((a, b) => new Date(b) - new Date(a));
  }, [attendanceRecords]);

  const toggleMenu = useCallback(() => {
    setMenuVisible(prev => !prev);
  }, []);
  const toggleSideMenu = useCallback(() => {
    setSideMenuVisible(prev => !prev);
  }, []);
  const toggleFacultyModal = () => {
    setFacultyModalVisible(prev => !prev);
  };

  const handleDateSelect = useCallback(date => {
    setSelectedDate(prev =>
      prev?.getTime() === date.getTime() ? null : new Date(date),
    );
  }, []);

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
        <TouchableOpacity onPress={toggleSideMenu}>
          <MaterialCommunityIcons name="widgets" size={28} color="#fff" />
        </TouchableOpacity>
        <Modal transparent visible={facultyModalVisible} animationType="fade">
          <Pressable style={styles.overlay} onPress={toggleFacultyModal}>
            <AddFaculty
              toggleFacultyModal={toggleFacultyModal}
              subjectCode={subjectRecord.subjectCode}
            />
          </Pressable>
        </Modal>
        <Modal transparent visible={menuVisible} animationType="fade">
          <Pressable style={styles.overlay} onPress={toggleMenu}>
            <DeleteSubject
              toggleMenu={toggleMenu}
              subjectCode={subjectRecord.subjectCode}
            />
          </Pressable>
        </Modal>
      </LinearGradient>
      {sideMenuVisible && (
        <Modal transparent visible={sideMenuVisible} animationType="fade">
          <Pressable style={styles.sideMenuOverlay} onPress={toggleSideMenu}>
            <View style={styles.sideMenu}>
              <Pressable style={styles.menuItem} onPress={toggleMenu}>
                <MaterialCommunityIcons name="delete" size={20} color="#fff" />
                <Text style={styles.menuText}>Delete Subject</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={toggleFacultyModal}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.menuText}>Add Faculty</Text>
              </Pressable>
              <Pressable style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="account-arrow-left-outline"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.menuText}>View Requests</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleArchiveSubject}>
                <MaterialCommunityIcons
                  name="archive-lock"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.menuText}>Archive Subject</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff6200"
          style={{marginTop: 20}}
        />
      ) : (
        <>
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => setSelectedDate(null)}>
              <LinearGradient
                colors={[selectedDate ? '#fff' : '#FF6200', '#FDB777']}
                style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Stats</Text>
              </LinearGradient>
            </TouchableOpacity>

            <FlatList
              horizontal
              data={dates}
              keyExtractor={date => date.toString()}
              renderItem={({item: date}) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                return (
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() => handleDateSelect(date)}
                      style={[
                        styles.dateItem,
                        isSelected
                          ? styles.selectedDate
                          : styles.unselectedDate,
                      ]}>
                      <Text
                        style={
                          isSelected
                            ? styles.selectedDateText
                            : styles.unselectedDateText
                        }>
                        {format(date, 'dd')}
                      </Text>
                      <Text style={styles.dateText}>{format(date, 'EEE')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{format(date, 'MMM')}</Text>
                  </View>
                );
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {selectedDate === null ? (
            <Leaderboard
              subjectRecord={updatedSubjectRecord}
              onStudentRemoved={handleStudentRemoval}
            />
          ) : (
            <Records
              subjectCode={subjectRecord.subjectCode}
              attendanceRecords={attendanceRecords}
              selectedDate={format(selectedDate, 'yyyy-MM-dd')}
              onAttendanceUpdated={handleAttendanceUpdate}
              onAttendanceDeleted={handleAttendanceDeletion}
            />
          )}
          <DownloadButton subjectCode={subjectRecord.subjectCode} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  sideMenu: {
    position: 'absolute',
    right: 0,
    top: 60,
    backgroundColor: '#333',
    width: 200,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  statsTitle: {
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
  },
  dateItem: {
    width: 49,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
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
});

export default AttendanceScreen;
