import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import fetch from 'react-native-fetch-polyfill';
import cacheManager from '../managers/cacheManager';
import SwitchViewHeaderButton from './GlobalComponents/switchViewButton';
import DVDataViewerTable from './DataViewer/DataViewerTable';
import PaginationButton from './GlobalComponents/paginationButton';
import DVFilterData from './DataViewer/FilterBasicData';
import PageSizePicker from './GlobalComponents/pageSizePicker';

export default class basicDataViewer extends Component {
  static navigationOptions = {
    title: 'First Page',
    //Hides the header
    headerShown: false,
  };

  state = {
    data: {},
    cacheData: {},
    page: 0,
    pageSize: 5,
    basicDataAPI:
      'http://10.0.2.2:3000/basic/data?availabilityType=1',
    meetingId: '',
    participantId: '',
    currentApiURL: '',
    availabilityType: 1,
    switchAvailabilityTypeText: 'Switch to Unavailability',
    isDataEmpty: false,
    disablePrevButton: true,
    disableNextButton: false,
    apiError: false,
  };

  constructor(props) {
    super(props);
    this.filterTableOnPress = this.filterTableOnPress.bind(this);
    this.onAppLoad = this.onAppLoad.bind(this);
    this.resetTable = this.resetTable.bind(this);
    this.verifyPagination = this.verifyPagination.bind(this);
    this.switchBetweenBasicAdvanced = this.switchBetweenBasicAdvanced.bind(this);
    this.updateCacheViewer = this.updateCacheViewer.bind(this);
    this.catchCacheError = this.catchCacheError.bind(this);
    this.onClearCache = this.onClearCache.bind(this);
    this.jumpToFirstPage = this.jumpToFirstPage.bind(this);
    this.isDataEmpty = this.isDataEmpty.bind(this);
    this.updateCacheViewer();
  }

  // Set advance & basic data states
  switchBetweenBasicAdvanced() {
    // If: Basic Result Viewer
    // Else: Advance Result Viewer
    if (this.state.availabilityType == 1) {
      this.setState({switchAvailabilityTypeText: 'Switch to Availability'});
      // API for unavailability
      this.setState({availabilityType: 0}, () =>
        this.setState(
          {
            basicDataAPI:
              'http://10.0.2.2:3000/basic/data?availabilityType=0',
          },
          () => this.resetTable(),
        ),
      );
    } else {
      this.setState({switchAvailabilityTypeText: 'Switch to Unavailability'});
      // API for availability
      this.setState({availabilityType: 1}, () =>
        this.setState(
          {
            basicDataAPI:
              'http://10.0.2.2:3000/basic/data?availabilityType=1',
          },
          () => this.resetTable(),
        ),
      );
    }
  }

  // Increment of the Page Size
  incrementPageSize = () => {
  if (this.state.pageSize < 20) {
    this.setState({pageSize: this.state.pageSize + 5}, () =>
      this.onAppLoad(
        this.state.basicDataAPI +
          '&page=' +
          this.state.page +
          '&pageSize=' +
          this.state.pageSize +
          '&meetingId=' +
          this.state.meetingId +
          '&participantId=' +
          this.state.participantId,
      ),
    );
   } else {
    alert('Maximum page size of 20!');
   }
  };

  // Decrement of the Page Size
  decrementPageSize = () => {
    if (this.state.pageSize > 5) {
      this.setState({pageSize: this.state.pageSize - 5}, () =>
        this.onAppLoad(
          this.state.basicDataAPI +
            '&page=' +
            this.state.page +
            '&pageSize=' +
            this.state.pageSize +
            '&meetingId=' +
            this.state.meetingId +
            '&participantId=' +
            this.state.participantId,
        ),
      );
    } else {
      alert('Minimum page size of 5');
    }
  };

  // Jump to next page
  nextPage = () => {
    this.setState({page: this.state.page + 1}, () => {
      // Set default values
      this.onAppLoad(
        this.state.basicDataAPI +
          '&page=' +
          this.state.page +
          '&pageSize=' +
          this.state.pageSize +
          '&meetingId=' +
          this.state.meetingId +
          '&participantId=' +
          this.state.participantId,
      );
    });
    //console.log("[NEXTPAGE FUNC] Page: " +this.state.page);
  };

  // Jump to first page
  jumpToFirstPage = () => {
    this.setState({page: 0}, () => {
      this.onAppLoad(
        this.state.basicDataAPI +
          '&page=' +
          this.state.page +
          '&pageSize=' +
          this.state.pageSize +
          '&meetingId=' +
          this.state.meetingId +
          '&participantId=' +
          this.state.participantId,
      );
    });
    //console.log("[FIRSTPAGE FUNC] Page: " +this.state.page);
  };

  // Jump to previous page
  previousPage = () => {
    if (this.state.page > 0) {
      this.setState({page: this.state.page - 1}, () =>
        this.onAppLoad(
          this.state.basicDataAPI +
            '&page=' +
            this.state.page +
            '&pageSize=' +
            this.state.pageSize +
            '&meetingId=' +
            this.state.meetingId +
            '&participantId=' +
            this.state.participantId,
        ),
      );
      //console.log("[PREVPAGE FUNC] Page: " +this.state.page);
    }
  };

  //Resets the table
  resetTable() {
    this.state.meetingId = '';
    this.state.participantId = '';

    this.setState({apiError: false}, () =>
      this.setState({page: 0}, () =>
        this.onAppLoad(
          this.state.basicDataAPI +
            '&page=' +
            this.state.page +
            '&pageSize=' +
            this.state.pageSize,
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
    // Get Cache
    try {
      const cacheData = await cacheManager.getAll();
      this.setState({cacheData});
    } catch (error) {
      this.catchCacheError(error);
    }
  }

  onAppLoad(requestUrl) {
    //console.log("Page: " +this.state.page);
    //console.log("API: " +requestUrl);
    //The below sends the HTTP request to the given URL
    this.setState({currentApiURL: requestUrl});
    fetch(requestUrl, {timeout: 6 * 1000})
      .then(response => response.json())
      .then(json => {
        cacheManager
          .set(requestUrl, json)
          .then(this.updateCacheViewer)
          .catch(this.catchCacheError);
        return json;
      })
      .then(data => this.setState({data}, () => this.verifyPagination()))
      .catch(error => {
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

  // Filter the table
  filterTableOnPress(meetingId, participantId) {
    this.state.meetingId = meetingId;
    this.state.participantId = participantId;

    this.setState({page: 0}, () =>
      this.onAppLoad(
        this.state.basicDataAPI +
          '&page=' +
          this.state.page +
          '&pageSize=' +
          this.state.pageSize +
          '&meetingId=' +
          meetingId +
          '&participantId=' +
          participantId,
      ),
    );
  }

  // Verify Pagination
  verifyPagination() {
    // If its 1st page, disable previous button
    if (this.state.page == 0) {
      this.setState({disablePrevButton: true});
    } else {
      this.setState({disablePrevButton: false});
    }

    // If there is data, execute if segment
    // Else, execute else segment
    if (this.state.data.result) {
      // If there is no data, disable previous & next button
      if (this.state.data.result.length == 0 && this.state.page == 0) {
        this.setState({disableNextButton: true}, () =>
          this.setState({disablePrevButton: true}, () =>
            alert('Oops! No data to display!'),
          ),
        );
        return;
      }

      // If there is no data, and page is greater than 0, just to first page
      // else if page size is greater than result length, disable next button
      if (this.state.data.result.length == 0 && this.state.page > 0) {
        this.setState({disableNextButton: true}, () =>
          this.setState({disablePrevButton: true}, () =>
            this.jumpToFirstPage(),
          ),
        );
        return;
      } else {
        if (this.state.data.result.length < this.state.pageSize) {
          this.setState({disableNextButton: true});
          //alert('Cannot paginate more!');
        } else {
          this.setState({disableNextButton: false});
        }
      }
    } else {
      this.setState({disablePrevButton: true});
      this.setState({disableNextButton: true});
    }
  }

// Check if Data is empty
  isDataEmpty() {
    // If data length is 0
    if (this.state.data.result) {
      if (this.state.data.result.length == 0) {
        alert('No data found!');
      }
      return;
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

            <DVFilterData
              basicDataAPI={
                this.state.basicDataAPI +
                '&page=' +
                this.state.page +
                '&pageSize=' +
                this.state.pageSize
              }
              onAppLoad={this.onAppLoad}
              resetTable={this.resetTable}
              filterTableOnPress={this.filterTableOnPress}
              switchBetweenBasicAdvanced={this.switchBetweenBasicAdvanced}
              switchAvailabilityTypeText={this.state.switchAvailabilityTypeText}
            />
            <DVDataViewerTable
              jsonData={this.state.data}
              jsonCacheData={this.state.cacheData}
              apiURL={this.state.currentApiURL}
              apiError={this.state.apiError}
            />
            <PaginationButton
              disablePrevButton={this.state.disablePrevButton}
              disableNextButton={this.state.disableNextButton}
              pageNumber={this.state.page}
              nextPage={this.nextPage}
              firstPage={this.jumpToFirstPage}
              previousPage={this.previousPage}
            />
            <PageSizePicker
              disablePrevButton={this.state.disablePrevButton}
              disableNextButton={this.state.disableNextButton}
              apiError={this.state.apiError}
              pageSize={this.state.pageSize}
              incrementPageSize={this.incrementPageSize}
              decrementPageSize={this.decrementPageSize}
            />
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

// Styling for components
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  hideDisplay: {
    display: 'none',
  },
  showDisplay: {
    display: 'flex',
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
