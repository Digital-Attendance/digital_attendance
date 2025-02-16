import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, {Path} from 'react-native-svg';
import SummaryCard from './SummaryCard';

const SubjectCard = () => {
  return (
    <View style={styles.container}>
      <MaskedView
        maskElement={
          <Svg height="250" width="100%">
            <Path d="M31.8358 249.805L289.479 251C306.548 251.079 320.445 233.445 320.539 211.587L321 104.668C321.094 82.7804 307.315 64.9389 290.223 64.8181L279.644 64.7434C266.144 64.648 255.261 50.5563 255.336 33.2687C255.41 15.9519 244.492 1.84793 230.969 1.79379L32.7752 1.0002C15.7122 0.931858 1.82525 18.5625 1.73109 40.4133L1.00048 209.955C0.906033 231.872 14.721 249.726 31.8358 249.805Z" />
          </Svg>
        }>
        <SummaryCard />
      </MaskedView>
      <View style={styles.addBadge}>
        <Text style={styles.addText}>+</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000',
  },

  addBadge: {
    position: 'absolute',
    top: 12,
    right: 10,
    backgroundColor: 'black',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'yellow',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubjectCard;
