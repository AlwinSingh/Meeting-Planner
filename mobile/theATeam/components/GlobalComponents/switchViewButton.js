import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class DVHeaderButton extends Component {
  render() {
    return (
      <>
        {/* Button to switch between the different pages */}
        <View style={styles.header}>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.dvButton}
              onPress={this.props.switchToDV}>
              <Text style={styles.text}>Data Viewer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rvButton}
              onPress={this.props.switchToRV}>
              <Text style={styles.text}>Result Viewer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.buttons}>
          <Button title="Data Viewer" />
        </View>
        <View style={styles.buttons}>
          <Button title="Result Viewer" />
        </View> */}
      </>
    );
  }
}

// Styling for Component
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
  },
  dvButton: {
    flex: 1,
    height: 60,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  rvButton: {
    flex: 1,
    height: 60,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  // header:{
  //     flexDirection:'row'
  // },
  // buttons:{
  //     flex:1,
  // }
});
