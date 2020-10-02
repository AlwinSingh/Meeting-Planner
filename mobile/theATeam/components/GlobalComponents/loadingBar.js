import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

// Loading Bar
export default class Pagination extends Component {
  render() {
    return (
      <>
        <View style={[styles.container, styles.horizontal]}>
          <BallIndicator color="black" />
        </View>
      </>
    );
  }
}

// Styling for Component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 150,
  },
});
