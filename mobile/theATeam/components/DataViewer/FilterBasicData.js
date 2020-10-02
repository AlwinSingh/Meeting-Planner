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
    meetingId: '',
    participantId: '',
  };
  constructor(props) {
    super(props);
    this.filterTableOnPress = this.filterTableOnPress.bind(this);
    this.onAppLoad = this.onAppLoad.bind(this);
    this.resetComponents = this.resetComponents.bind(this);
  }

  // Gets the input
  filterTableOnPress() {
    let meetingId = (this.state.meetingId).replace(/[^0-9]/g, '');
    let participantId = (this.state.participantId).replace(/[^0-9]/g, '');
    //console.log(meetingId);
    // Check if meeting id/participant ID is equal to 10 digits
    if (meetingId.length == 10 && participantId.length > 0) {
      if (participantId.length != 10) {
        alert('Meeting ID and Participant ID must be 10 digits!');
        return;
      }
    } else if (participantId.length == 10 && meetingId.length > 0) {
      if (meetingId.length != 10) {
        alert('Meeting ID and Participant ID must be 10 digits!');
        return;
      }
    }

    // If either one input is equal to 10 digits,
    // else display alert
    if (meetingId.length == 10 || participantId.length == 10) {
      // convert the meetingId from a string to an integer
      if (meetingId.length == 10) {
        meetingId = parseInt(meetingId);
      }
      // convert the participantId from a string to an integer
      if (participantId.length == 10) {
        participantId = parseInt(participantId);
      }

      this.props.filterTableOnPress(meetingId, participantId);
    } else {
      alert('Meeting ID or Participant ID must be 10 digits!');
    }
  }

  onAppLoad() {
    //console.log("PROP: " +this.props.basicDataAPI);
    this.props.onAppLoad(this.props.basicDataAPI);
  }

  componentDidMount() {
    this.onAppLoad();
  }

  // Reset components clear all input fields
  resetComponents() {
    this.props.resetTable();
    this.state.meetingId = '';
    this.state.participantId = '';
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
            onChangeText={participantId => this.setState({participantId})}
            placeholder="Input participant ID"
            keyboardType="numeric"
            value={this.state.participantId}
          />
        </View>

        {/* Search, reset & switch to advance button */}
        <View style={styles.test}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={this.filterTableOnPress}>
            <Text style={styles.text}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={this.resetComponents}>
            <Text style={styles.text}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchViewButton}
            onPress={this.props.switchBetweenBasicAdvanced}>
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
