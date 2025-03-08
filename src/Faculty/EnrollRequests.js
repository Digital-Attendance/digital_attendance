import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { useUserContext } from "../Context";
import BASE_URL from "../../url";
import Toast from "react-native-toast-message";

const EnrollRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({});
  const {userEmail} = useUserContext();

  useEffect(() => {
    fetchEnrollmentRequests();
  }, []);

  const fetchEnrollmentRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/faculty/enrollment-requests`, {
        params: { facultyEmail:userEmail },
      });

      if (response.status === 200) {
        setRequests(response.data.enrollmentRequests);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to fetch requests",
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch requests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (subjectID, studentEmail, action) => {
    try {
      const response = await axios.post(`${BASE_URL}/faculty/enroll-student`, {
        facultyEmail:userEmail,
        studentEmail,
        subjectID,
        action,
      });

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: `Successfully ${action}ed enrollment`,
        });
        fetchEnrollmentRequests();
      } else {
        Toast.show({
          type: "error",
          text1: `Failed to ${action} enrollment`,
        });
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      Toast.show({
        type: "error",
        text1: `Failed to ${action} enrollment`,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enrollment Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        Object.keys(requests).length > 0 ? (
          <FlatList
            data={Object.entries(requests)}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => {
              const [subjectID, students] = item;
              return (
                <View style={styles.subjectContainer}>
                  <Text style={styles.subjectTitle}>Subject: {subjectID}</Text>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <View key={student.studentEmail} style={styles.requestItem}>
                        <Text style={styles.studentText}>{student.studentEmail}</Text>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.button, styles.approve]}
                            onPress={() => handleDecision(subjectID, student.studentEmail, "approve")}
                          >
                            <Text style={styles.buttonText}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.button, styles.deny]}
                            onPress={() => handleDecision(subjectID, student.studentEmail, "deny")}
                          >
                            <Text style={styles.buttonText}>Deny</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noRequests}>No pending requests</Text>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.noRequests}>No pending enrollment requests</Text>
        )
      )}
    </View>
  );
};

export default EnrollRequests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  header: {
    fontSize: 22,
    fontFamily : 'Raleway-Bold',
    color: "#2196F3FF",
    textAlign: "center",
    marginBottom: 40,
  },
  subjectContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  subjectTitle: {
    fontSize: 18,
    fontFamily : 'Raleway-Bold',
    marginBottom: 8,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  studentText: {
    fontSize: 16,
    fontFamily : 'Raleway-Regular',
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approve: {
    backgroundColor: "#28A745",
  },
  deny: {
    backgroundColor: "#DC3545",
  },
  buttonText: {
    color: "#FFF",
    fontFamily : 'Raleway-Italic',
  },
  noRequests: {
    textAlign: "center",
    fontSize: 16,
    color: "#6C757D",
    fontFamily : 'Raleway-Regular',
  },
});
