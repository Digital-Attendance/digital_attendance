import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';
import SwipeButton from './components/SwipeButton';

const Faculty_Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Navbar />
        <SubjectCard />
      </ScrollView>
      <SwipeButton/>
    </SafeAreaView>
  );
};

export default Faculty_Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
