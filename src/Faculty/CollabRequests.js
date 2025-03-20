import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {useUserContext} from '../Context';

import BASE_URL from '../../url';

const CollabRequests = () => {
  const {userEmail} = useUserContext();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchColabRequests = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/faculty/pending-requests`,
          {
            params: {email: userEmail},
            validateStatus: function (status) {
              return status < 500;
            },
          },
        );
        setRequests(response.data.pendingRequests || []);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch requests',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
      }
    };
    fetchColabRequests();
  }, []);

  const handleRequestResponse = async (subjectID, action) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/faculty/respond-request`,
        {
          subjectID,
          email: userEmail,
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
          text1: 'Request responded successfully',
          position: 'top',
          visibilityTime: 1000,
          autoHide: true,
          topOffset: 10,
        });
        setRequests(prevRequests =>
          prevRequests.filter(req => req.subjectID !== subjectID),
        );
      } else {
        Toast.show({
          type: 'error',
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
        text1: 'Error responding to request',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
        topOffset: 10,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Collaboration Requests</Text>

      {requests.length === 0 ? (
        <Text style={styles.noRequests}>No pending requests</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={item => item.subjectID}
          renderItem={({item}) => (
            <LinearGradient
              colors={['#007a7a', '#004d4d']}
              style={styles.requestCard}>
              <View style={styles.subjectDetails}>
                <Text style={styles.subjectName}>{item.subjectName}</Text>
                <Text style={styles.subjectInfo}>
                  {item.programme}-{item.department}-{item.semester}-
                  {item.section}
                </Text>
              </View>
              <View style={styles.details}>
                <View style={styles.requesterDetails}>
                  <Text style={styles.requester}>Requested by:</Text>
                  <Text style={styles.requesterName}>{item.name}</Text>
                  <Text style={styles.requesterEmail}>{item.email}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() =>
                      handleRequestResponse(item.subjectID, 'accept')
                    }>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() =>
                      handleRequestResponse(item.subjectID, 'reject')
                    }>
                    <Text style={styles.buttonText}>Deny</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          )}
        />
      )}
    </View>
  );
};

export default CollabRequests;

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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  subjectDetails: {
    // flexDirection: 'row',
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
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  requester: {
    fontSize: 10,
    color: '#ffea00',
    fontFamily: 'Raleway-Medium',
    marginVertical: 8,
  },
  requesterName: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  requesterEmail: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'Raleway-Italic',
  },

  buttonContainer: {
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
  },
});
