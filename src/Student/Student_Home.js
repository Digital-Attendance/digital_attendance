import { ScrollView, StyleSheet } from 'react-native';
import React, { useCallback,useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Student_Home = () => {
  const [refresh, setRefresh] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Navbar />
      <SubjectCard refresh={refresh} />
    </ScrollView>
  );
};

export default Student_Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E1E1E',
  },
});
