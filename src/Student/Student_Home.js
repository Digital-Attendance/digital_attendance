import {ScrollView, StyleSheet, RefreshControl} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Student_Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setRefresh(prev => !prev);
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
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

export default Student_Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E1E1E',
  },
});
