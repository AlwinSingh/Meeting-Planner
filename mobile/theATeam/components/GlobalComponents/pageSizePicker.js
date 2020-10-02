import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class Pagination extends Component {
  render() {
    return (
      <>
        {/* Page size disabled if there is an API error or nextButton/PrevButton is disabled */}
        <View
          style={[
            this.props.apiError
              ? styles.disableButton
              : styles.enableButton,
          ]}>
          <View style={styles.pagination}>
            {/* Input Field to display page size*/}
            <View style={styles.inputFields}>
              <Text style={styles.input1}>{this.props.pageSize}</Text>
            </View>
            {/* Button  to increment or decrement*/}
            <View style={styles.buttons}>
              {/* TouchableOpactiy disabled if there is an API error or Nextbutton/Prev button is disabled */}
              <TouchableOpacity
                style={(this.props.disableNextButton && this.props.disablePrevButton) ? styles.buttonIncreaseDisabled : styles.buttonIncrease}
                onPress={this.props.incrementPageSize}
                disabled={
                  this.props.apiError ||
                  (this.props.disableNextButton && this.props.disablePrevButton)
                }>
                <Text style={styles.text}>▲</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDecrease}
                onPress={this.props.decrementPageSize}
                disabled={
                  this.props.apiError
                }>
                <Text style={styles.text}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }
}

// Styling for Component
const styles = StyleSheet.create({
  disableButton: {
    opacity: 0.3,
  },
  enableButton: {
    opacity: 1,
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 30,
    marginBottom: 25,
    height: 53,
    borderColor: 'black',
    borderWidth: 1,
  },
  inputFields: {
    width: 45,
  },
  input1: {
    textAlign: 'center',
    fontSize: 25,
    height: 51,
    paddingTop: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
  buttons: {
    borderWidth: 1,
    marginLeft: 0,
  },
  buttonIncrease: {
    height: 25,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  buttonIncreaseDisabled: {
    opacity: 0.3,
    height: 25,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  buttonDecrease: {
    height: 25,
    borderTopWidth: 1,
    paddingHorizontal: 15,
  },
  text: {
    textAlign: 'center',
  },
});
