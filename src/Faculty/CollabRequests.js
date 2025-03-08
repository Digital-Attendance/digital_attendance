import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../Context";

import BASE_URL from "../../url";

const CollabRequests = ({ route }) => {
  const [requests, setRequests] = useState([]);
  const { userEmail } = useUserContext();

  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/faculty/pending-requests`, {
        params: { email: userEmail },
      });
      setRequests(response.data.pendingRequests || []);
    } catch (error) {
      console.error("Error fetching collab requests:", error);
      Alert.alert("Error", "Failed to fetch collaboration requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Accept/Reject actions
  const handleRequestResponse = async (subjectID, action) => {
    try {
      const response = await axios.post(`${BASE_URL}/faculty/respond-request`, {
        subjectID,
        email: userEmail,
        action,
      });

      Alert.alert("Success", response.data.message);
      setRequests(prevRequests => prevRequests.filter(req => req.subjectID !== subjectID));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      Alert.alert("Error", `Failed to ${action} request.`);
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
          keyExtractor={(item) => item.subjectID}
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <Text style={styles.subjectName}>{item.subjectID}</Text>
              <Text style={styles.requester}>Requested by: {item.requestedByEmail}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleRequestResponse(item.subjectID, "accept")}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleRequestResponse(item.subjectID, "reject")}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: "#1E1E1E",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontFamily: "Raleway-Bold",
    color: "#2196F3FF",
    textAlign: "center",
    marginVertical: 16,
  },
  noRequests: {
    fontSize: 16,
    color: "#ccc",
    fontFamily: "Raleway-Regular",
    textAlign: "center",
    marginTop: 20,
  },
  requestCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  requester: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
