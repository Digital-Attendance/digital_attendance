import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../Context";
import BASE_URL from "../../url";

const ArchivedSubjects = () => {
  const { userEmail } = useUserContext();
  const [archivedSubjects, setArchivedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedSubjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/faculty/get-archived-subjects/${userEmail}`);
        const data = await response.json();
        
        if (response.ok) {
          setArchivedSubjects(data.archivedSubjects);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching archived subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedSubjects();
  }, [userEmail]);

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
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.subjectCard}>
              <Text style={styles.subjectName}>{item.subjectName}</Text>
              <Text style={styles.subjectDetails}>{item.subjectCode} - {item.course}</Text>
              <Text style={styles.subjectDetails}>{item.department}, Semester {item.semester}</Text>
              <Text style={styles.dateText}>Started on: {new Date(item.createdAt).toDateString()}</Text>
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
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontFamily: "Raleway-Bold",
    color: "#2196F3FF",
    textAlign: "center",
    marginBottom: 15,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ccc",
    marginTop: 20,
  },
  subjectCard: {
    backgroundColor: "#005758",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontFamily: "Raleway-Bold",
    color: "#007BFF",
  },
  subjectDetails: {
    fontSize: 12,
    fontFamily: "Raleway-Regular",
    color: "#fff",
  },
  dateText: {
    fontSize: 8,
    fontFamily: "Raleway-Italic",
    color: "#888",
    marginTop: 5,
  },
});
