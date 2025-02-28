import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Navbar from './components/Navbar'
import SubjectCard from './components/SubjectCard'
import AttendanceGraph from './components/AttendanceGraph'
import AttendanceButton from './components/AttendanceButton'

const Student_Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Navbar/>
      <SubjectCard/>
    </ScrollView>
  )
}

export default Student_Home

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1E1E1E',
  },
})