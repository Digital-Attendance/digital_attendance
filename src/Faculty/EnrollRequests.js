import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {ChevronDown, ChevronUp} from 'lucide-react-native';
import {useUserContext} from '../Context';
import BASE_URL from '../../url';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EnrollRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({});
  const [expandedSubject, setExpandedSubject] = useState({});
  const {userEmail} = useUserContext();

  useEffect(() => {
    fetchEnrollmentRequests();
  }, []);

  const fetchEnrollmentRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/faculty/enrollment-requests`,
        {
          params: {facultyEmail: userEmail},
          validateStatus: function (status) {
            return status < 500;
          },
        },
      );

      if (response.status === 200) {
        setRequests(response.data.enrollmentRequests);
        const autoExpandSubject = {};
        Object.entries(response.data.enrollmentRequests).forEach(
          ([subjectID, students]) => {
            if (students.length > 0) {
              autoExpandSubject[subjectID] = true;
            }
          },
        );
        setExpandedSubject(autoExpandSubject);
      } else {
        Toast.show({
          type: 'info',
          text1: response.data.error,
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch enrollment requests!',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (subjectID, studentEmail, action) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/enroll-student`,
        {
          facultyEmail: userEmail,
          studentEmail,
          subjectID,
          action,
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
          text1: `Successfully ${action}ed enrollment`,
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
        fetchEnrollmentRequests();
      } else {
        Toast.show({
          type: 'error',
          text1: `Failed to ${action} enrollment`,
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Failed to ${action} enrollment`,
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  const toggleExpand = subjectID => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSubject(prev => ({
      ...prev,
      [subjectID]: !prev[subjectID],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enrollment Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : Object.keys(requests).length > 0 ? (
        <FlatList
          data={Object.entries(requests)}
          keyExtractor={item => item[0]}
          renderItem={({item}) => {
            const [subjectID, students] = item;
            // const isExpanded = expandedSubject === subjectID;
            return (
              <View>
                <TouchableOpacity onPress={() => toggleExpand(subjectID)}>
                  <LinearGradient
                    colors={['#004d4d', '#004d4d']}
                    style={styles.subjectContainer}>
                    <Text style={styles.subjectTitle}>{subjectID}</Text>
                    {expandedSubject[subjectID] ? (
                      <ChevronUp color="#fff" />
                    ) : (
                      <ChevronDown color="#fff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                {expandedSubject[subjectID] && (
                  <View style={styles.studentListContainer}>
                    <ScrollView style={styles.scrollContainer}>
                      {students.length > 0 ? (
                        students.map(student => (
                          <View
                            key={student.studentEmail}
                            style={styles.requestItem}>
                            <Text style={styles.studentText}>
                              {student.name} - ({student.scholarID})
                            </Text>
                            <View style={styles.buttonContainer}>
                              <TouchableOpacity
                                style={[styles.button, styles.approve]}
                                onPress={() =>
                                  handleDecision(
                                    subjectID,
                                    student.studentEmail,
                                    'approve',
                                  )
                                }>
                                <Text style={styles.buttonText}>Admit</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.button, styles.deny]}
                                onPress={() =>
                                  handleDecision(
                                    subjectID,
                                    student.studentEmail,
                                    'deny',
                                  )
                                }>
                                <Text style={styles.buttonText}>Kick</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noRequests}>
                          No pending requests
                        </Text>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noRequests}>No pending enrollment requests</Text>
      )}
    </View>
  );
};

export default EnrollRequests;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#1E1E1E'},
  header: {
    fontSize: 22,
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 20,
  },
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  subjectTitle: {fontSize: 18, color: '#fff', fontFamily: 'Raleway-Medium'},
  studentListContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'skyblue',
  },
  scrollContainer: {maxHeight: 150},
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  studentText: {fontSize: 14, color: '#fff', fontFamily: 'Raleway-Medium'},
  buttonContainer: {flexDirection: 'row'},
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approve: {backgroundColor: '#28A745'},
  deny: {backgroundColor: '#DC3545'},
  buttonText: {color: '#FFF', fontSize: 12},
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6C757D',
    marginTop: 20,
  },
});
