import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Faculty_Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Navbar />
      <SubjectCard />
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
