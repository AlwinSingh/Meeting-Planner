import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import cacheManager from '../../managers/cacheManager';

export default class DataViewerTable extends Component {
  // Sets the table properties
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Participant Id', 'Meeting Id', 'Duration'],
      widthArr: [130, 130, 130],
    };
  }

  render() {
    const state = this.state;
    const tableData = [];
    var key;

    //console.log("[RV Cache Table]: " + JSON.stringify(this.props.jsonCacheData));

    //console.log("-----------------------------------------");

    // If there is an API error/Network error, get data from cache
    if (
      (this.props.jsonCacheData && this.props.apiError) ||
      (!this.props.jsonData.result && this.props.apiError)
    ) {
      console.log('Possible network error, populating from cache');

      if (this.props.jsonCacheData) {

        try {
          let cacheContainsData = false;
          let jsonResult = this.props.jsonCacheData;

          // Gets the cache data
          for (key in this.props.jsonCacheData) {
            if (key == this.props.apiURL) {
              jsonResult = this.props.jsonCacheData[key].result;
              cacheContainsData = true;
              break;
            }
          }

          if (!cacheContainsData) {
            this.props.noCachedDataFound();
          }

          // Populates the jsonResults
          if (jsonResult && jsonResult.participants) {
            console.log('Populating Table...');
            for (let i = 0; i < jsonResult.participants.length; i++) {
              const rowData = [];
              rowData.push(jsonResult.participants[i].participantId);

              rowData.push(this.props.meetingId);
              rowData.push(
                parseInt(jsonResult.toTime / 100) * 60 +
                  parseInt(jsonResult.toTime % 100) -
                  (parseInt(jsonResult.fromTime / 100) * 60 +
                    parseInt(jsonResult.fromTime % 100)),
              );
              tableData.push(rowData);
            }
          }
        } catch (err) {
          console.log('[Populating Cache Data] Error Message: ' + err.message);
        }
      }
    } else {
      if (this.props.jsonData) {
        // Else get the jsonResult
        try {
          let jsonResult = this.props.jsonData;

          // If jsonResult is more than 1, populates the table
          if (jsonResult.length > 0) {
            //console.log("Populating Table...");
            for (let i = 0; i < jsonResult.length; i++) {
              const rowData = [];
              rowData.push(jsonResult[i]);

              rowData.push(this.props.meetingId);
              rowData.push(this.props.meetingDuration + " Mins");
              tableData.push(rowData);
            }
          }
        } catch (err) {
          console.log('[Populating Data] Error Message: ' + err.message);
        }
      }
    }

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            {/* Table Header */}
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={state.tableHead}
                widthArr={state.widthArr}
                style={styles.header}
                textStyle={styles.headerText}
              />
            </Table>
            {/*  Table Data */}
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
