import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
  Text,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import cacheManager from '../managers/cacheManager';
import fetch from 'react-native-fetch-polyfill';
import SwitchViewHeaderButton from './GlobalComponents/switchViewButton';
import RVDataViewerTable from './ResultViewer/ResultViewerTable';
import PaginationButton from './GlobalComponents/paginationButton';
import RVFilterData from './ResultViewer/FilterResultData';
import PageSizePicker from './GlobalComponents/pageSizePicker';
import LoadingBar from './GlobalComponents/loadingBar';

export default class basicDataViewer extends Component {
  static navigationOptions = {
    title: 'Second Page',
    //Hides the header
    headerShown: false,
  };

  state = {
    data: {},
    userData: [],
    paginatedData: [],
    timeSlot: [],
    meetingId: '123',
    meetingDuration: '123',
    page: 0,
    pageSize: 5,
    basicResultApi: 'http://10.0.2.2:3000/basic/result',
    currentApiURL: '',
    resultType: 0, //0 represents basic, 1 represents advance
    switchAvailabilityTypeText: 'Switch to Advanced',
    disablePrevButton: true,
    disableNextButton: false,
    loadingAPI: false,
    apiError: false,
  };

  constructor(props) {
    super(props);
    this.populateTableOnPress = this.populateTableOnPress.bind(this);
    this.populateTable = this.populateTable.bind(this);
    this.resetTable = this.resetTable.bind(this);
    this.verifyPagination = this.verifyPagination.bind(this);
    this.switchBetweenBasicAdvanced = this.switchBetweenBasicAdvanced.bind(this);
    this.paginateResultTable = this.paginateResultTable.bind(this);
    this.jumpToFirstPage = this.jumpToFirstPage.bind(this);
    this.populateDataState = this.populateDataState.bind(this);
    this.getAPIState = this.getAPIState.bind(this);
    this.updateCacheViewer = this.updateCacheViewer.bind(this);
    this.catchCacheError = this.catchCacheError.bind(this);
    this.onClearCache = this.onClearCache.bind(this);
    this.noCachedDataFound = this.noCachedDataFound.bind(this);
    this.updateCacheViewer();
  }

  // Get API state
  getAPIState(apiLoadingState) {
    if (apiLoadingState) {
      //console.log("Loading api...");
      this.setState({loadingAPI: true});
    } else {
      //console.log("Done loading api..");
      this.setState({loadingAPI: false});
    }
  }

  // Set advance & basic data states
  switchBetweenBasicAdvanced() {
    // If: Basic Result Viewer
    // Else: Advance Result Viewer
    if (this.state.resultType == 1) {
      this.setState({switchAvailabilityTypeText: 'Switch to Advanced'});
      // API for basic
      this.setState({resultType: 0}, () =>
        this.setState(
          {basicResultApi: 'http://10.0.2.2:3000/basic/result'},
          () => this.resetTable(),
        ),
      );
    } else {
      this.setState({switchAvailabilityTypeText: 'Switch to Basic'});
      // API for adv
      this.setState({resultType: 1}, () =>
        this.setState(
          {
            basicResultApi:
              'http://10.0.2.2:3000/advance/result',
          },
          () => this.resetTable(),
        ),
      );
    }
  }

  // Increment of the Page Size
  incrementPageSize = () => {
    this.setState({pageSize: this.state.pageSize + 1}, () =>
      this.paginateResultTable(
        this.state.userData,
        this.state.pageSize,
        this.state.page + 1,
      ),
    );
  };

  // Decrement of the Page Size
  decrementPageSize = () => {
    if (this.state.pageSize > 5) {
      this.setState({pageSize: this.state.pageSize - 1}, () =>
        this.paginateResultTable(
          this.state.userData,
          this.state.pageSize,
          this.state.page + 1,
        ),
      );
    } else {
      alert('Minimum page size of 5');
    }
  };

  // Jump to first Page
  jumpToFirstPage = () => {
    this.setState({page: 0}, () => {
      this.paginateResultTable(
        this.state.userData,
        this.state.pageSize,
        this.state.page + 1,
      );
    });
    //console.log("[FIRSTPAGE FUNC] Page: " +this.state.page);
  };

  // Jump to next page
  nextPage = () => {
    this.setState({page: this.state.page + 1}, () =>
      this.paginateResultTable(
        this.state.userData,
        this.state.pageSize,
        this.state.page + 1,
      ),
    );
  };

  // Jump to previous page
  previousPage = () => {
    if (this.state.page > 0) {
      this.setState({page: this.state.page - 1}, () =>
        this.paginateResultTable(
          this.state.userData,
          this.state.pageSize,
          this.state.page + 1,
        ),
      );
    }
  };

  //Resets the table
  resetTable() {
    this.setState({apiError: false});
    this.setState(
      {timeSlot: []},
      this.setState({currentApiURL: ''}, () =>
        this.setState({userData: []}, () =>
          this.setState({page: 0}, () =>
            this.setState({paginatedData: []}, () => this.verifyPagination()),
          ),
        ),
      ),
    );
  }

  // Clearing Cache
  async onClearCache() {
    try {
      //console.log('Before Cache Clear: ' + this.state.cacheData);
      await cacheManager.clearAll();
      //console.log('After Cache Clear: ' + this.state.cacheData);
      await this.updateCacheViewer;
    } catch (error) {
      this.catchCacheError(error);
    }
  }

  // Cache Cache Error
  catchCacheError(error) {
    this.setState({apiError: true});
    return this.setState({cacheData: {error: error.message}});
  }

  // Update Cache Viewer
  async updateCacheViewer() {
    try {
      const cacheData = await cacheManager.getAll();
      this.setState({cacheData});
    } catch (error) {
      this.catchCacheError(error);
    }
  }

  //  Get the data for user's input
  populateDataState(data, fromTime, toTime) {
    this.resetTable();

    this.state.timeSlot.push(fromTime);
    this.state.timeSlot.push(toTime);

    // Conversion & get time diff
    if (fromTime && toTime) {
      var getHourDifference =
        parseInt(toTime / 100) * 60 +
        parseInt(toTime % 100) -
        (parseInt(fromTime / 100) * 60 + parseInt(fromTime % 100));
      this.setState({meetingDuration: getHourDifference});
    } else {
      this.setState({meetingDuration: 'N/A'});
    }

    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        this.state.userData.push(data[i].participantId);
      }
      this.paginateResultTable(
        this.state.userData,
        this.state.pageSize,
        this.state.page + 1,
      );
      this.getAPIState(false);
    } else {
      this.getAPIState(false);
      alert('No available participants for the meeting!');
    }
  }

  // Paginate Result Table
  paginateResultTable(userData, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    let paginatedDataArray = userData.slice(
      (page_number - 1) * page_size,
      page_number * page_size,
    );
    this.setState({paginatedData: paginatedDataArray}, () =>
      this.verifyPagination(),
    );
  }

  // Populate the table
  populateTable(requestUrl) {
    //console.log("Page: " +this.state.page);
    console.log("API: " +requestUrl);
    //The below sends the http request to the given URL
    this.setState({currentApiURL: requestUrl});
    this.getAPIState(true);
    fetch(requestUrl, {timeout: 7 * 1000})
      .then(response => response.json())
      .then(json => {
        cacheManager
          .set(requestUrl, json)
          .then(this.updateCacheViewer)
          .catch(this.catchCacheError);
        return json;
      })
      .then(data =>
        this.populateDataState(
          data.result.participants,
          data.result.fromTime,
          data.result.toTime,
        ),
      )
      .catch(error => {
        this.getAPIState(false);
        this.setState({apiError: true});
        console.log('Error:', error);
        const result = {error: error.message};
        cacheManager
          .get(requestUrl)
          .then(cachedJson => {
            if (!cachedJson) {
              result.cacheMessage = 'URL not cached';
              return this.setState({data: result});
            }
            result.json = cachedJson;
            result.cached = true;
            this.setState({data: result});
          })
          .catch(cacheError => {
            this.setState({
              data: result,
              cacheData: {error: cacheError.message},
              apiError: true,
            });
          });
      });
  }

  // Populate the table on press
  populateTableOnPress(meetingId, meetingDuration, fromTime, toTime) {
    this.setState({meetingId: meetingId});

    var filterQuery = '?meetingId=' + meetingId;

    if (fromTime.length > 0 && toTime.length > 0) {
      filterQuery += '&fromTime=' + fromTime + '&toTime=' + toTime;
    }

    if (meetingDuration > 0 && !isNaN(meetingDuration)) {
      filterQuery += '&duration=' + meetingDuration;
    }

    this.setState({page: 0}, () =>
      this.populateTable(this.state.basicResultApi + filterQuery),
    );
  }

  noCachedDataFound() {
    this.state.apiError = false;
    if (!this.state.loadingAPI) {
    alert('No cached data found!');
    }
  }

  // Verify the pagination
  verifyPagination() {
    //console.log("Last index of current data: " +this.state.paginatedData[this.state.paginatedData.length - 1]);
    //console.log("Last index of all data: " +this.state.userData[this.state.userData.length - 1]);
    var paginatedDataLastElement = this.state.paginatedData[
      this.state.paginatedData.length - 1
    ];
    var apiDataLastElement = this.state.userData[
      this.state.userData.length - 1
    ];

    // If its 1st page, disable previous button
    if (this.state.page == 0) {
      this.setState({disablePrevButton: true});
    } else {
      this.setState({disablePrevButton: false});
    }

    if (
      this.state.paginatedData.length < this.state.pageSize ||
      paginatedDataLastElement == apiDataLastElement
    ) {
      this.setState({disableNextButton: true});
      //alert('Cannot paginate more!');
    } else {
      this.setState({disableNextButton: false});
    }
  }

  componentDidMount() {
    this.verifyPagination();
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <SwitchViewHeaderButton
              switchToDV={() => navigate('FirstPage')}
              switchToRV={() => navigate('SecondPage')}
            />

            <RVFilterData
              basicResultApi={this.state.basicResultApi}
              resetTable={this.resetTable}
              populateTableOnPress={this.populateTableOnPress}
              switchBetweenBasicAdvanced={this.switchBetweenBasicAdvanced}
              resultType={this.state.resultType}
              switchAvailabilityTypeText={this.state.switchAvailabilityTypeText}
            />
            <View
              style={[
                !this.state.loadingAPI
                  ? styles.hideDisplay
                  : styles.showDisplay,
              ]}>
              <LoadingBar />
            </View>
            <View
              style={[
                this.state.loadingAPI ? styles.hideDisplay : styles.showDisplay,
              ]}>
              <RVDataViewerTable
                jsonData={this.state.paginatedData}
                jsonCacheData={this.state.cacheData}
                apiURL={this.state.currentApiURL}
                apiError={this.state.apiError}
                meetingId={this.state.meetingId}
                meetingDuration={this.state.meetingDuration}
                timeSlot={this.state.timeSlot}
                noCachedDataFound={this.noCachedDataFound}
              />
              <Text
                style={[
                  this.state.timeSlot[0] >= 0 && this.state.timeSlot[1] >= 0
                    ? styles.meetingTimeDisplay
                    : styles.hideDisplay,
                ]}>
                Meeting Time: From {this.state.timeSlot[0]} to{' '}
                {this.state.timeSlot[1]}
              </Text>
              <PaginationButton
                disablePrevButton={this.state.disablePrevButton}
                disableNextButton={this.state.disableNextButton}
                pageNumber={this.state.page}
                nextPage={this.nextPage}
                previousPage={this.previousPage}
                firstPage={this.jumpToFirstPage}
              />
              <PageSizePicker
                disablePrevButton={this.state.disablePrevButton}
                disableNextButton={this.state.disableNextButton}
                apiError={this.state.apiError}
                pageSize={this.state.pageSize}
                incrementPageSize={this.incrementPageSize}
                decrementPageSize={this.decrementPageSize}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

// Styling for component
const styles = StyleSheet.create({
  meetingTimeDisplay: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 19,
    marginBottom: 10,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  hideDisplay: {
    display: 'none',
  },
  showDisplay: {
    display: 'flex',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
