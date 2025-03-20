import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { useUserContext } from '../Context';

import BASE_URL from '../../url';

const PendingEnrollments = () => {
  const { userEmail } = useUserContext();
  const [pendingSubjects, setPendingSubjects] = useState([]);

  useEffect(() => {
    const fetchPendingEnrollments = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/student/pending-enrollments`, {
          studentEmail: userEmail,
        },{
          validateStatus: function (status) {
            return status < 500;
          },
        });
        setPendingSubjects(response.data.pendingSubjects || []);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch pending enrollments',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    };
    fetchPendingEnrollments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pending Enrollment Requests</Text>

      {pendingSubjects.length === 0 ? (
        <Text style={styles.noRequests}>No pending enrollments</Text>
      ) : (
        <FlatList
          data={pendingSubjects}
          keyExtractor={(item) => item.subjectID}
          renderItem={({ item }) => (
            <LinearGradient colors={['#007a7a', '#004d4d']} style={styles.requestCard}>
              <View style={styles.subjectDetails}>
                <Text style={styles.subjectName}>{item.subjectName}</Text>
                <Text style={styles.subjectInfo}>{item.subjectCode}</Text>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
};

export default PendingEnrollments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Raleway-Bold',
    color: '#2196F3FF',
    textAlign: 'center',
    marginVertical: 16,
  },
  noRequests: {
    fontSize: 16,
    color: '#ccc',
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  subjectDetails: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  subjectInfo: {
    fontSize: 12,
    color: '#ffea00',
  },
});
