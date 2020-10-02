import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';

export default class DataViewerTable extends Component {
  constructor(props) {
    super(props);
    // Sets the table properties
    this.state = {
      emptyData: false,
      tableHead: [
        'Meeting ID',
        'Participant ID',
        'Avail ID',
        'Start Time',
        'End Time',
      ],
      widthArr: [110, 110, 110, 78, 78],
    };
  }

  render() {
    const state = this.state;
    const tableData = [];
    var key;
    let jsonResult = {};

    //console.log("[DV Cache Table]: " + JSON.stringify(this.props.jsonCacheData));

    // If there is an API error/Network error, get data from cache
    if (
      (this.props.jsonCacheData.CacheData && this.props.apiError) ||
      (!this.props.jsonData.result && this.props.apiError)
    ) {
      console.log('Possible network error, populating from cache');

      // Gets the cache data
      for (key in this.props.jsonCacheData) {
        if (key == this.props.apiURL) {
          jsonResult = this.props.jsonCacheData[key].result;
          break;
        }
      }

      // Populates the jsonResults
      if (jsonResult && jsonResult.length >= 0) {
        try {
          //console.log("Populating Table...");
          for (let i = 0; i < jsonResult.length; i++) {
            const rowData = [];
            rowData.push(jsonResult[i].meetingid);
            rowData.push(jsonResult[i].participantid);

            if (jsonResult[i].availabilityid) {
              rowData.push(jsonResult[i].availabilityid);
            }

            if (jsonResult[i].unavailabilityid) {
              rowData.push(jsonResult[i].unavailabilityid);
            }

            rowData.push(jsonResult[i].starttime);
            rowData.push(jsonResult[i].endtime);
            tableData.push(rowData);
          }
        } catch (err) {
          console.log('[Populating Cache Data] Error Message: ' + err.message);
        }
      }
    } else {
      if (this.props.jsonData.result) {
        // Else get the jsonResult
        try {
          let jsonResult = this.props.jsonData.result;

          // If jsonResult is more than 1, populates the table
          if (jsonResult.length > 0) {
            //console.log("Populating Table...");
            for (let i = 0; i < jsonResult.length; i++) {
              const rowData = [];
              rowData.push(jsonResult[i].meetingid);
              rowData.push(jsonResult[i].participantid);

              if (jsonResult[i].availabilityid) {
                rowData.push(jsonResult[i].availabilityid);
              }

              if (jsonResult[i].unavailabilityid) {
                rowData.push(jsonResult[i].unavailabilityid);
              }

              rowData.push(jsonResult[i].starttime);
              rowData.push(jsonResult[i].endtime);
              tableData.push(rowData);
            }
          } else {
          }
        } catch (err) {
          console.log('[Populating Data] Error Message: ' + err.message);
        }
      }
    }

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          {/* If its emptyData, hide display, else show display */}
          <View
            style={[
              this.state.emptyData ? styles.hideDisplay : styles.showDisplay,
            ]}>
            {/* Table Header */}
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={state.tableHead}
                widthArr={state.widthArr}
                style={styles.header}
                textStyle={styles.headerText}
              />
            </Table>
            {/* Table Data */}
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#dbdbdb'},
                    ]}
                    textStyle={styles.tableText}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Styling for Component
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30},
  header: {height: 50, backgroundColor: '#343a40'},
  headerText: {textAlign: 'center', color: '#fff', fontWeight: 'bold'},
  tableText: {textAlign: 'center', color: '#000000', fontWeight: 'bold'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#c7c7c7'},
});
