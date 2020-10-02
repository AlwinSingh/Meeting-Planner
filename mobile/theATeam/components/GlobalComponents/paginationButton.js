import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class paginationButton extends Component {
  constructor(props) {
    super(props);
  }

  // Pagination
  render() {
    return (
      <>
        {/* Previous Page Button */}
        <View style={styles.button}>
          <TouchableOpacity
            style={[
              this.props.disablePrevButton
                ? styles.prevButtonDisabled
                : styles.prevButton,
            ]}
            disabled={this.props.disablePrevButton}
            onPress={this.props.previousPage}>
            <Text style={styles.text}>Previous</Text>
          </TouchableOpacity>

          {/* Display Page Number */}
          <Text style={styles.pageNo}>Page {this.props.pageNumber + 1}</Text>

          {/* Next Page Button */}
          <TouchableOpacity
            style={[
              this.props.disableNextButton
                ? styles.nextButtonDisabled
                : styles.nextButton,
            ]}
            disabled={this.props.disableNextButton}
            onPress={this.props.nextPage}>
            <Text style={styles.text}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Return to First Page Button */}
        <View style={styles.firstPageBtnParent}>
          <TouchableOpacity
            style={[
              this.props.disablePrevButton
                ? styles.firstPageButtonDisabled
                : styles.firstPageButton,
            ]}
            disabled={this.props.disablePrevButton}
            onPress={this.props.firstPage}>
            <Text style={styles.text}>First Page</Text>
          </TouchableOpacity>
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
    marginHorizontal: 20,
  },
  firstPageBtnParent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
  prevButton: {
    flex: 0.7,
    height: 45,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  nextButton: {
    flex: 0.7,
    height: 45,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  firstPageButton: {
    flex: 0.3,
    height: 45,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
  },
  prevButtonDisabled: {
    opacity: 0.3,
    flex: 0.7,
    height: 45,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  nextButtonDisabled: {
    opacity: 0.3,
    flex: 0.7,
    height: 45,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
  },
  firstPageButtonDisabled: {
    opacity: 0.3,
    flex: 0.3,
    height: 45,
    borderRadius: 0,
    backgroundColor: '#292b2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
  },
  pageNo: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
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
