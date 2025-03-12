import React, {useState, useCallback,useRef} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';

const Faculty_Home = () => {
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFirstRun = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
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
      <SubjectCard onRefresh={onRefresh} refresh={refresh} />
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
