import React, {useState, useCallback} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Faculty_Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, []),
  );
  const onRefresh = () => {
    setRefreshing(true);
    console.log('Refreshing');
    setRefresh(prev => !prev);
    setTimeout(() => setRefreshing(false), 1000);
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
