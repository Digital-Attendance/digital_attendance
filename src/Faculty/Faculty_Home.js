import React, {useState, useCallback} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Faculty_Home = () => {
  const [refresh, setRefresh] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, []),
  );
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      >
      <Navbar />
      <SubjectCard refresh={refresh} /> 
    </ScrollView>
  );
};

export default Faculty_Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
});
