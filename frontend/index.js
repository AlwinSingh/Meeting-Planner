//API Base URL
const basicDataUrl = 'https://theateam-ades.herokuapp.com/basic/data';

//Queries that will be required that will be passed on to the API to get the results
//Availability Type, 1 represents Available data while 0 represents unavailable
const basicDataQuery = {
    meetingId: null,
    participantId: null,
    availabilityType: 1,
    page: 0,
    pageSize: 5
};

// Below are all the functions
$(document).ready(function () {

    //Spinner animation before the page loads
    $('#webLoadSpinner').fadeOut(4500, function () {
        $('.container').fadeIn(300);
    });

    //This registers the function / calls them upon the page being loaded
    refreshBasicDataTable();
    registerSwitchViewerButton();
    registerSwitchToUnavailabilityButton();
    registerBasicData();
    registerBasicDataPaginationForm();
    verifySearchInput();
    resetSearchData();
})

//This function switches between the RV / DV
function registerSwitchViewerButton() {
    //Upon clicking either button with the particular Class it will call the redirect function
    $('.btn-dataviewer').click(redirectToViewer);
    $('.btn-resultviewer').click(redirectToViewer);
}

//Switches between the basic / advanced featurer for the Data Viewer
function registerSwitchToUnavailabilityButton() {
    //Calls the function redirectbetweenbasicadvanced() upon click
    $('.btn-switchbasicviewer').click(redirectBetweenBasicAdvanced);
}

function redirectBetweenBasicAdvanced(event) {
    //Get the event click 'data-custom'value' attribute
    var currentPageData = $(this).attr('data-custom-value');
    
    //If the current data attribute is availableData, that means we should be switching to Advanced
    //If the current data attribute is availabledata, that means we should switch to Basic

    if (currentPageData == 'availableData') {
        $(this).text('View Availability Data');
        $(this).attr('data-custom-value', 'unavailableData');

        //Update the availabilityType as then the API would know to retrieve available / unavailable data
        basicDataQuery['availabilityType'] = 0;
    } else {
        $(this).text('View Unavailability Data');
        $(this).attr('data-custom-value', 'availableData');
        basicDataQuery['availabilityType'] = 1;
    }

    refreshBasicDataTable();
}

function redirectToViewer(event) {
    var getButtonValue = $(this).attr('data-custom-value');
    var assignLocation = 'index.html';

    if (getButtonValue == 'rviewer') {
        assignLocation = 'resultViewer.html';
    }
    
    window.location.href = assignLocation;
}

//Checks the input fields upon onKey press and enables / disables the buttons
function checkInputFields() {
    //As we noticed with further debugging that a dot could be inserted into the input, the following code disables that
    //Adds a keypress event listener to the div id that takes in a event
    $('.formSearchbar').keyup(function(key){
        var meetingIdSearchInput = $('#meetingIdSearchBar').val();
        var participantIdSearchInput = $('#participantIdSearchBar').val();

        //The event would then allow us to retrieve specific information about the keypress
        //.keyCode is to retrieve the keyboard event key code property
        //Each key on your keyboard has an assigned key code, through this we can determine the key that was pressed
        if (key.keyCode == 46) {
            //This stops the default action of a event from happening
            key.preventDefault();
        }

        if (key.keyCode == 101) {
            //This stops the default action of a event from happening
            key.preventDefault();
        }
        
        //console.log('Meeting id input: ' +meetingIdSearchInput.length);
        //console.log('participant id input: ' +participantIdSearchInput.length);

        if (meetingIdSearchInput.length > 0  || participantIdSearchInput.length > 0) {
            $('#searchButton').removeClass('disabled');
            $('#resetButton').removeClass('disabled');
        } else {
            $('#searchButton').addClass('disabled');
            $('#resetButton').addClass('disabled');
        }

      });
}

// Verify all the user search input 
function verifySearchInput() {
    // When search button is clicked, take the value and 
    // check if input length is 10 or whether it is a number.
    // If not 10, return false & alert
    $('#searchButton').click(function () {
        var meetingIdSearchInput = $('#meetingIdSearchBar').val();
        var participantIdSearchInput = $('#participantIdSearchBar').val();

        if (meetingIdSearchInput.length > 1 && meetingIdSearchInput.length  != 10 || participantIdSearchInput.length > 1 && participantIdSearchInput.length  != 10) {
            if (isNaN(parseInt(meetingIdSearchInput)) || isNaN(parseInt(participantIdSearchInput))) {
                alert('Meeting / Participant ID must be 10 numeric digits!');
                return false;
            } else {
            alert('Meeting / Participant ID must be 10 numeric digits!');
            return false;
            }
        }

    });
}

// Reset the search data
function resetSearchData() {
    // When the rest button is click, meetingId & participantId is null
    // Refreshes the DataTable
    $('#resetButton').click(function () {
        var meetingIdSearchInput = $('#meetingIdSearchBar').val();
        var participantIdSearchInput = $('#participantIdSearchBar').val();

        basicDataQuery['meetingId'] = null;
        basicDataQuery['participantId'] = null;
        refreshBasicDataTable();

        
        $('#searchButton').addClass('disabled');
        $('#resetButton').addClass('disabled');
    });
}

// Retrieves the data count
function retrieveDataCount(data, pageSize, currentPage) {
    // Data message & page number
    $('.dataErrMsg').css('display', 'none');
    $('.dynamicPageNumber').text('Page ' + (currentPage + 1));

    // If at first page, disable previous and go to first page button
    // Else enable it if its NOT on the first page.
    if (currentPage == 0) {
        $('#data-previous-page-btn').addClass('disabled');
        $('#data-first-page-btn').addClass('disabled');
    } else {
        $('#data-previous-page-btn').removeClass('disabled');
        $('#data-first-page-btn').removeClass('disabled');
    }

    // Count the data on a page
    var dataCount = 0;
    for (var i = 0; i < data.result.length; i++) {
        dataCount++;
    }

    // Use to check for data when searching on a page not on first page &
    // datacount is less than the display selected 
    if (dataCount == 0 && currentPage != 0) {
        const fn = 'gotoFirstPage';
        basicDataPaginationFunction[fn](0);
        refreshBasicDataTable();
    }

    // Shows how may rows is displayed
    $('#currentDataDisplayed').html('Displaying ' + dataCount + ' row(s)');

    // If datacount is less than the page size, disabled the next page button
    // Else enable the next page button 
    if (dataCount < pageSize) {
        $('#data-next-page-btn').addClass('disabled');
        // If there is no data to be displayed, return error message
        if (dataCount == 0 && currentPage == 0) {
            $('#currentDataDisplayed').css('display', 'none');
            $('.dataErrMsg').html('<p>Oops! There is no more Data to view on this page</p>');
            $('.dataErrMsg').css('display', 'block');
        }
    } else {
        $('#currentDataDisplayed').css('display', 'block');
        $('#data-next-page-btn').removeClass('disabled');
    }
}

// Populate the table in html
function populateBasicDataTable(data) {
    retrieveDataCount(data, basicDataQuery['pageSize'], basicDataQuery['page']);
    var dataTableHtml;

    //If the availablilityType is 1, then the data would be 'availabilityId', else it would be 'unavailabilityId', hence the data.result.map alters in that fashion for this if-else condition
    if (basicDataQuery['availabilityType'] == 1) {
    dataTableHtml =
            data.result.map(
                ({
                    id,
                    meetingid,
                    availabilityid,
                    participantid,
                    starttime,
                    endtime
                }) => `
        <tr>
            <td>${id}</id>
            <td>${meetingid}</td>
            <td>${availabilityid}</td>
            <td>${participantid}</td>
            <td>${starttime}</td>
            <td>${endtime}</td>
        </tr>
        `);
        } else {
        dataTableHtml =
            data.result.map(
                ({
                    id,
                    meetingid,
                    unavailabilityid,
                    participantid,
                    starttime,
                    endtime
                }) => `
           <tr>
               <td>${id}</id>
               <td>${meetingid}</td>
               <td>${unavailabilityid}</td>
               <td>${participantid}</td>
               <td>${starttime}</td>
               <td>${endtime}</td>
           </tr>
        `);
        }

    $('#basic-data-tbody').html(dataTableHtml);
}

// Refreshes the data 
function refreshBasicDataTable() {
    getBasicDataBackend(function (err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        populateBasicDataTable(data);
    });
}

// Send request to the backend to retrieve data from the database
function getBasicDataBackend(callback) {
    $.get(basicDataUrl, basicDataQuery).done((result) =>
        callback(null, result)).fail((message) => callback(message, null));
}

// Filter the basic data
function filterBasicData(event) {
    $('#form-filter input').not(':input[type=submit]').each((index, input) => {
        basicDataQuery[$(input).attr('key')] = $(input).val();
    });

    refreshBasicDataTable();
    return false;
}

// Filter for the form
function registerBasicData() {
    $('#form-filter').submit(filterBasicData);
}

// Paginates through the different pages of data depending on the amount of data to show on each page
function paginateBasicData(event) {
    const fn = $(this).attr('fn');
    const value = $(this).attr('value') || $(this).val();
    basicDataPaginationFunction[fn](value);
    refreshBasicDataTable();
}

// When clicked, go to paginateBasicData
function registerBasicDataPaginationForm() {
    $('#basic-data-previous-page').click(paginateBasicData);
    $('#basic-data-first-page').click(paginateBasicData);
    $('#basic-data-next-page').click(paginateBasicData);
    $('#basic-data-page-size-select').change(paginateBasicData);
}

// Change page/pagesize
const basicDataPaginationFunction = {
    gotoFirstPage: function () {
        basicDataQuery['page'] = 0;
    },
    changePage: function (delta) {
        basicDataQuery['page'] += parseInt(delta);
    },
    changePageSize: function (newPageSize) {
        basicDataQuery['pageSize'] = newPageSize;
    }
}