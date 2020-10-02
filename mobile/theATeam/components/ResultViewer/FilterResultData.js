import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export default class filterBasicData extends Component {
  state = {
    toggleAdvanceFilterDisplay: 'none',
    meetingId: '',
    meetingDuration: '',
    fromTime: '',
    toTime: '',
  };
  constructor(props) {
    super(props);
    this.populateTableOnPress = this.populateTableOnPress.bind(this);
    this.toggleAdvanceFilter = this.toggleAdvanceFilter.bind(this);
    this.switchComponents = this.switchComponents.bind(this);
    this.resetComponents = this.resetComponents.bind(this);
  }

  populateTableOnPress() {
    let meetingId = (this.state.meetingId).replace(/[^0-9]/g, '');
    let meetingDuration = (this.state.meetingDuration).replace(/[^0-9]/g, '');
    let fromTime = (this.state.fromTime).replace(/[^0-9]/g, '');
    let toTime = (this.state.toTime).replace(/[^0-9]/g, '');
    // Check if meetingId is 10 & is a number
    if (meetingId.length != 10 || isNaN(meetingId)) {
      alert('Meeting ID must be 10 digits!');
    } else {
      // Check if fromtime & to time is a valud input
      if (
        this.props.resultType == 1 &&
        (fromTime.length != 4 ||
          toTime.length != 4 ||
          isNaN(fromTime) ||
          isNaN(toTime) ||
          fromTime > 2359 ||
          toTime > 2359 ||
          fromTime < 0 ||
          toTime < 0)
      ) {
        alert('You must define a time range! (24hr format)');
      } else {
        // if it is, takes in the value & populate the table
        this.props.populateTableOnPress(
          parseInt(meetingId),
          parseInt(meetingDuration),
          fromTime,
          toTime,
        );
      }
    }
  }

  async toggleAdvanceFilter() {
    await this.props.switchBetweenBasicAdvanced;
    if (this.props.resultType == 1) {
      this.setState({toggleAdvanceFilterDisplay: 'flex'});
    } else {
      this.setState({toggleAdvanceFilterDisplay: 'none'});
    }
  }

  // Switch Component
  switchComponents() {
    this.props.switchBetweenBasicAdvanced();
    this.toggleAdvanceFilter();
    this.resetComponents();
  }

  // Reset components clear all input fields
  resetComponents() {
    this.props.resetTable();
    this.setState({meetingId: ''});
    this.setState({meetingDuration: ''});
    this.setState({fromTime: ''});
    this.setState({toTime: ''});
  }

  render() {
    return (
      // Input fields
      <View>
        <View style={styles.inputFields}>
          <TextInput
            style={styles.input1}
            onChangeText={meetingId => this.setState({meetingId})}
            placeholder="Input meeting ID"
            keyboardType="numeric"
            value={this.state.meetingId}
          />
          <TextInput
            style={styles.input2}
            onChangeText={meetingDuration => this.setState({meetingDuration})}
            placeholder="Input duration"
            keyboardType="numeric"
            value={this.state.meetingDuration}
          />
        </View>

        {/* Advanced Fields (Display only if it is asked to show) */}
        <View style={{display: this.state.toggleAdvanceFilterDisplay}}>
          <View style={styles.inputAdvanceFields}>
            <TextInput
              style={styles.input1}
              onChangeText={fromTime => this.setState({fromTime})}
              placeholder=" Input from time"
              keyboardType="numeric"
              value={this.state.fromTime}
            />
            <TextInput
              style={styles.input2}
              onChangeText={toTime => this.setState({toTime})}
              placeholder=" Input to time"
              keyboardType="numeric"
              value={this.state.toTime}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.test}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.populateTableOnPress}>
            <Text style={styles.text}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={this.resetComponents}>
            <Text style={styles.text}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchViewButton}
            onPress={this.switchComponents}>
            <Text style={styles.text}>
              {this.props.switchAvailabilityTypeText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// Styling for Component
const styles = StyleSheet.create({
  test: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputAdvanceFields: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  inputFields: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    marginBottom: 15,
  },
  input1: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    borderTopLeftRadius: 10,
  },
  input2: {
    flex: 1,
    borderColor: 'black',
    borderLeftWidth: 0,
    borderWidth: 1,
    borderTopRightRadius: 10,
  },
  searchButton: {
    width: 120,
    height: 50,
    alignSelf: 'flex-end',
    marginRight: 10,
    borderRadius: 0,
    backgroundColor: '#499c49',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  resetButton: {
    width: 120,
    height: 50,
    alignSelf: 'flex-end',
    marginRight: 10,
    borderRadius: 0,
    backgroundColor: 'maroon',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  switchViewButton: {
    width: 120,
    height: 50,
    alignSelf: 'flex-end',
    marginRight: 10,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
