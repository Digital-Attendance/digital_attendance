import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import {format, parseISO, subMonths, eachDayOfInterval} from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Leaderboard from './components/Leaderboard';
import Records from './components/Records';
import students from '../DummyDatas/studentsData';
import DeleteSubject from './components/DeleteSubject';
import DownloadButton from './components/DownloadButton';

const AttendanceScreen = ({route}) => {
  const {subjectRecord} = route.params;
  const {
    attendanceRecords,
    averageAttendanceLast5Days,
    lastClassDate,
    numberOfClassesTaken,
    numberOfStudents,
    subjectCode,
    subjectName,
  } = subjectRecord;
  const [selectedDate, setSelectedDate] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const today = new Date();
  const dates = useMemo(() => {
    const uniqueDates = [];

    attendanceRecords.forEach(record => {
      const dateObj = parseISO(record.date); // Convert ISO string to Date object
      const dateStr = format(dateObj, 'yyyy-MM-dd'); // Keep consistent format (ISO-like)

      if (!uniqueDates.includes(dateStr)) {
        uniqueDates.push(dateStr);
      }
    });

    // Sort dates in descending order (most recent first)
    uniqueDates.sort((a, b) => new Date(b) - new Date(a));

    // Convert back to Date objects
    return uniqueDates.map(dateStr => parseISO(dateStr));
  }, [attendanceRecords]);

  const toggleMenu = useCallback(() => {
    setMenuVisible(prev => !prev);
  }, []);

  const handleDateSelect = useCallback(date => {
    setSelectedDate(prev =>
      prev?.getTime() === date.getTime() ? null : new Date(date),
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
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
            {subjectName}
          </Text>
          <Text style={styles.subjectCode}>{subjectCode}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={toggleMenu}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <Modal transparent visible={menuVisible} animationType="fade">
          <Pressable style={styles.overlay} onPress={toggleMenu}>
            <DeleteSubject toggleMenu={toggleMenu} subjectCode="CS101" />
          </Pressable>
        </Modal>
      </LinearGradient>

      {/* Date Container */}
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
                    isSelected ? styles.selectedDate : styles.unselectedDate,
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
        <Leaderboard students={students} />
      ) : (
        <Records
          attendanceRecords={attendanceRecords}
          selectedDate={format(selectedDate, 'dd MMM yyyy')}
        />
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
