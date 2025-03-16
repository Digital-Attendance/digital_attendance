import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import {format} from 'date-fns';
import {
  LinearGradient as SVGLinearGradient,
  Stop,
  Defs,
} from 'react-native-svg';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useUserContext} from '../Context';
import BASE_URL from '../../url';
import DeleteSubject from './components/DeleteSubject';

const ArchivedSubjects = () => {
  const {userEmail} = useUserContext();
  const [archivedSubjects, setArchivedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const getProgressColor = averageAttendance => {
    if (averageAttendance <= 30) return ['#ff0000', '#ff4d4d'];
    if (averageAttendance <= 50) return ['#FF6200', '#FDB777'];
    if (averageAttendance <= 75) return ['#f9ed39', '#f9f9ae'];
    if (averageAttendance <= 85) return ['#0575E6', '#00F260'];
    return ['#86e83c', '#2bb539'];
  };

  const toggleMenu = useCallback(() => {
    setMenuVisible(prev => !prev);
  }, []);

  useEffect(() => {
    const fetchArchivedSubjects = async () => {
      try {
        // const response = await fetch(
        //   `${BASE_URL}/faculty/get-archived-subjects/${userEmail}`,
        // );
        // const data = await response.json();

        const response = await axios.get(
          `${BASE_URL}/faculty/get-archived-subjects/${userEmail}`,
          {
            validateStatus: function (status) {
              return status < 500;
            },
          },
        );
        const data = await response.data;

        if (response.status === 200) {
          const processedSubjects = data.archivedSubjects.map(subject => {
            let totalClasses = subject.attendanceRecords.length;
            let totalPresent = 0;
            let totalStudents = subject.students.length;

            subject.attendanceRecords.forEach(record => {
              totalPresent += record.attendance.filter(a => a.present).length;
            });

            const attendancePercentage =
              totalClasses > 0 && totalStudents > 0
                ? (totalPresent / (totalClasses * totalStudents)) * 100
                : 0;

            const lastClassDate =
              totalClasses > 0
                ? new Date(subject.attendanceRecords[totalClasses - 1].date)
                : null;

            return {
              ...subject,
              averageAttendance: attendancePercentage.toFixed(2),
              lastClassDate,
            };
          });

          setArchivedSubjects(processedSubjects);
          
        } else {
          Toast.show({type: 'error', text1: data.error});
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'An error occurred. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedSubjects();
  }, [userEmail]);

  const handleUnarchiveSubject = async subjectRecord => {
    try {
      Alert.alert(
        'Unarchive Subject',
        'Are you sure you want to unarchive this subject?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Unarchive',
            onPress: async () => {
              const response = await axios.post(
                `${BASE_URL}/faculty/unarchive-subject`,
                {
                  subjectID: subjectRecord.subjectID,
                  email: userEmail,
                },
                {
                  validateStatus: function (status) {
                    return status < 500;
                  },
                },
              );
              const data = await response.data;
              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Subject unarchived successfully',
                  position: 'top',
                  visibilityTime: 1000,
                  autoHide: true,
                  topOffset: 10,
                });
                setArchivedSubjects(
                  archivedSubjects.filter(
                    subject => subject._id !== subjectRecord._id,
                  ),
                );
              } else {
                Toast.show({
                  type: 'error',
                  text1: data.error || 'Error unarchiving subject',
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
        text1: 'Error unarchiving subject',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Archived Subjects</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : archivedSubjects.length === 0 ? (
        <Text style={styles.noDataText}>No archived subjects found</Text>
      ) : (
        <FlatList
          data={archivedSubjects}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.subjectCard}>
              <View style={styles.subjectCardHeader}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.subjectName}>
                  {item.subjectName}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => handleUnarchiveSubject(item)}
                    style={styles.archiveButton}>
                    <MaterialCommunityIcons
                      name="archive-arrow-down"
                      size={22}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={toggleMenu}
                    style={styles.deleteButton}>
                    <MaterialCommunityIcons
                      name="delete-alert-outline"
                      size={22}
                      color="#f00"
                    />
                  </TouchableOpacity>
                </View>
                <Modal transparent visible={menuVisible} animationType="fade">
                  <Pressable style={styles.overlay} onPress={toggleMenu}>
                    <DeleteSubject
                      toggleMenu={toggleMenu}
                      subjectID={item.subjectID}
                      setArchivedSubjects={setArchivedSubjects}
                    />
                  </Pressable>
                </Modal>
              </View>
              <View style={styles.subjectDetailsContainer}>
                <Text style={styles.subjectDetailsText}>
                  {item.subjectCode}
                </Text>
                <Text style={styles.subjectDetailsText}>{item.programme}</Text>
                <Text style={styles.subjectDetailsText}>{item.department}</Text>
                <Text style={styles.subjectDetailsText}>
                  Semester {item.semester}
                </Text>
              </View>
              <View style={styles.subjectInfo}>
                <View style={{}}>
                  <Text style={styles.dateText}>
                    Start Date -{' '}
                    {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                  </Text>
                  <Text style={styles.dateText}>
                    End Date -
                    {format(new Date(item.lastClassDate), 'dd/MM/yyyy')}
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <AnimatedCircularProgress
                    size={80}
                    width={9}                
                    fill={Number(Math.ceil(item.averageAttendance))}
                    rotation={-90}
                    arcSweepAngle={180}
                    backgroundColor="#005758"
                    tintColor="url(#gradient)"
                    renderCap={({center}) => (
                      <Defs>
                        <SVGLinearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%">
                          <Stop
                            offset="0%"
                            stopColor={
                              getProgressColor(item.averageAttendance)[0]
                            }
                            stopOpacity="1"
                          />
                          <Stop
                            offset="100%"
                            stopColor={
                              getProgressColor(item.averageAttendance)[1]
                            }
                            stopOpacity="1"
                          />
                        </SVGLinearGradient>
                      </Defs>
                    )}
                  />
                  <Text style={styles.progressText}>
                    {Number(item.averageAttendance)}%
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ArchivedSubjects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.73)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    color: '#2196F3FF',
    textAlign: 'center',
    marginBottom: 15,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ccc',
    marginTop: 20,
  },
  subjectCard: {
    backgroundColor: '#004d4d',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // marginBottom: 12,
    borderWidth: 0.1,
    borderBottomWidth: 2,
    borderColor: 'skyblue',
  },
  subjectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
    width: '75%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  archiveButton: {
    backgroundColor: '#005758',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#005758',
    padding: 5,
    borderRadius: 5,
    // marginRight: 10,
  },
  subjectDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  subjectDetailsText: {
    fontSize: 10,
    fontFamily: 'Raleway-Italic',
    color: '#ffea00',
  },
  subjectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    height: '32%',
    // alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#ccc',
    fontFamily: 'Raleway-Italic',
  },
  progressContainer: {
    alignItems: 'center',
    // justifyContent: 'center',    
  },
  progressText: {
    position: 'absolute',
    top: 20,
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#fff',
  },
});
