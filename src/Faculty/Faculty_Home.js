import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Navbar from './components/Navbar';
import SummaryCard from './components/SummaryCard';
import Subjects from './components/Subjects';

const Faculty_Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Navbar/>
        <SummaryCard/>
        <Subjects/>
      </ScrollView>
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
