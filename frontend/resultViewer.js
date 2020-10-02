let resultUrl = 'https://theateam-ades.herokuapp.com/basic/result';

const resultViewerPagination = {
    //Gets the current page size directly from the front end
    pageSize: $('#basic-result-page-size-select').val(),
    //Page Number starts from 0 rather than 0 as we are doing client side pagination that will be elaborated on below
    pageNumber: 1,
    //The pagination takes in the Participants data, so that it can be loaded in accordingly dependent on the page number & page size
    participantsData: [],
};

//Result Query is not loaded yet as it is dynamic, it changes according to whether we are viewing basic / advanced result viewer
let resultQuery = {};


// Below are all the functions
$(document).ready(function () {
    $('#webLoadSpinner').fadeOut(4500, function () {
        $('.container').fadeIn(300);
    });
;
    registerSwitchViewerButton();
    registerSwitchToAdvanceResultButton();
    registerResultData();
    checkPagination();
    verifySearchInput();
    resetSearchData();
});

//Checks the input fields upon onKey press and enables / disables the buttons
function checkInputFields() {
    var meetingIdSearchInput = $('#meetingIdSearchBar').val();
    var durationSearchInput = $('#meetingDurationSearchBar').val();

    var fromTimeSearchInput = $('#fromTimeSearchBar').val();
    var toTimeSearchInput = $('#toTimeSearchBar').val();

    //As we noticed with further debugging that a dot could be inserted into the input, the following code disables that
    //Adds a keypress event listener to the div id that takes in a event
    $('.formSearchbar').keypress(function(key){
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
      });


    //Conditional Display Rendering, if it matches the requirements it will enable the form buttons else it will not. The function enableFormButtons takes in a boolean value that allows for the buttons to be toggled anywhere.

    if (fromTimeSearchInput != undefined && toTimeSearchInput != undefined) {
        if (meetingIdSearchInput.length > 0 && meetingIdSearchInput.length == 10 && fromTimeSearchInput.length == 4 && toTimeSearchInput.length == 4 && parseInt(fromTimeSearchInput) <= 2359 && parseInt(toTimeSearchInput) <= 2359 && parseInt(fromTimeSearchInput) >= 0 && parseInt(toTimeSearchInput) >= 0 && parseInt(fromTimeSearchInput) < parseInt(toTimeSearchInput)) {

            enableFormButtons(true);

        } else {
            enableFormButtons(false);
        }
    } else {
        if (meetingIdSearchInput.length > 0 && meetingIdSearchInput.length == 10) {
            enableFormButtons(true);
        } else {
            enableFormButtons(false);
        }
    }
    
}

// Verify all the user search input 
function verifySearchInput() {
    // When search button is clicked, take the value and 
    // check if input length is 10 or whether it is a number.
    // If not 10, return false & alert
    $('#searchButton').click(function () {
        var meetingIdSearchInput = $('#meetingIdSearchBar').val();
        var durationSearchInput = $('#meetingDurationSearchBar').val();
        var alertErrMsg = '';;

        if (meetingIdSearchInput.length > 1 && meetingIdSearchInput.length  == 10) {
            if (isNaN(parseInt(meetingIdSearchInput))) {
               alertErrMsg = 'Meeting ID must be 10 numeric digits';
                return false;
            }
        }

        if (durationSearchInput.length > 1) {
            if (isNaN(parseInt(meetingIdSearchInput))) {
               alertErrMsg = 'Meeting duration must be valid and omit the colon (10:00 -> 1000)';
                return false;
            }
        }
    });
}

//Resets the input fields and the tables' body
function resetDataFields() {
    $('#meetingIdSearchBar').val('');
    $('#meetingDurationSearchBar').val('');
    $('#fromTimeSearchBar').val('');
    $('#toTimeSearchBar').val('');
    $('#result-tbody').empty();
    $('#result-tbody').html('');
    $('.meetingTimeDisplay').empty();
}

// Reset the search data
function resetSearchData() {
    // When the rest button is click, meetingId & participantId is null
    // Refreshes the DataTable
    //Upon clocking, reset the fields and pagination as well as disable pagination + form buttons because clicking reset button would mean the table will not be loaded as there is no data set
    $('#form-filter').on('click', '#resetButton', function () {
        
        resetDataFields();

        resetPagination();
        disablePaginationElements();

        enableFormButtons(false);
    });
}  

// Populate the table in html
function populateBasicResultTable(data) {
    resultViewerPagination['participantsData'] = [];
    updateHTMLPagination(1);

    //If there is no meeting time available, it will return a JSON Array [{'meeting':'No available timing'}]
    //Hence, if 'meeting' exist in the result, it means that there is no available timing and will append the html to display as such
    if (data.result.meeting || data.result.participants.length < 1) {
        $('.dataErrMsg').html(`<p>Oops! There is no available participants found for Meeting ID of <strong>${$('#meetingIdSearchBar').val()}</strong> `);
        //for a duration of <strong>${$('#meetingDurationSearchBar').val()}</strong> minutes</p>`);
        $('.dataErrMsg').css('display', 'block');
        resetDataFields();
    } else {
    //Otherwise, reset Error Message and push into global variable array ('participantsData');
        $('.dataErrMsg').html('');
        $('.dataErrMsg').css('display', 'none');

    //Updates the text information under the table with the fromtime and to time
    updateMeetingTimeDisplay(data.result.fromTime, data.result.toTime);

    //If the duration is not specified (As it is an optional field from the user) we will perform the computation of the duration on our own
    if (!resultQuery['duration'] || resultQuery['duration'].length < 1) {
        //Calls the function that performs the computation
        getDurationIfNotSpecified(data.result.fromTime, data.result.toTime);
    };

    //Loop throughthe dataset and push the participants id into the participants data array
    for (var j = 0; j < data.result.participants.length; j++) {
       resultViewerPagination['participantsData'].push(data.result.participants[j].participantId);
     }
     
      //Update the table
      updateResultTable();
    }
}

//For every input get the key attribute and assign this key attribute that matches the resultQuery delcared above to it's input value
function compute(event) {
    $('#form-filter input').not(':input[type=submit]').each((index, input) => {
        resultQuery[$(input).attr('key')] = $(input).val();
    });

    refreshBasicResultTable();
    return false;
}

// Filter for the form
function registerResultData() {
    $('#form-filter').submit(compute);
}

function getBasicResultBackend(callback) {
    $.get(resultUrl, resultQuery).done((result) =>
        callback(null, result)).fail((message) => callback(message, null));
}

function refreshBasicResultTable() {
    getBasicResultBackend(function (err, data) {
        if (err) {
            console.log(err);
            return err;
        }
        populateBasicResultTable(data);
    });
}

function checkPagination() {
    verifyPageButton();

    $('#data-next-page-btn').click(function() {
        //Gets the current page number from the classs' attribute
        var currentPage = parseInt($('.dynamicPageNumber').attr('data-page-number'));
        //Increment the page number
        currentPage++;
        //Calls the function below that will take in the updated page number and append it to client side paginated data and at the same time, update the frontend display
        updateHTMLPagination(currentPage);
         //Verifies the pagination so as to disable / enable the pagination elements of the page
        verifyPageButton();
        //Updates the table with the new set of data that meets the current pagination specifications
        updateResultTable();
    });

    $('#data-previous-page-btn').click(function() {
        //Gets the current page number from the classs' attribute
        var currentPage = parseInt($('.dynamicPageNumber').attr('data-page-number'));
        //Decremen the page number
        currentPage--;
        //Calls the function below that will take in the updated page number and append it to client side paginated data and at the same time, update the frontend display
        updateHTMLPagination(currentPage);
        //Verifies the pagination so as to disable / enable the pagination elements of the page
        verifyPageButton();
        //Updates the table with the new set of data that meets the current pagination specifications
        updateResultTable();
    });

    $('#data-first-page-btn').click(function() {
        //We do not need to get the current page attribute anymore as this button jumps to the first page so we can just pass the value of '1' to the function below
        //Calls the function below that will take in the updated page number and append it to client side paginated data and at the same time, update the frontend display
        updateHTMLPagination(1);
        //Verifies the pagination so as to disable / enable the pagination elements of the page
        verifyPageButton();
        //Updates the table with the new set of data that meets the current pagination specifications
        updateResultTable();
    });
}

function updateResultTable() {
    if (resultViewerPagination['participantsData'].length > 0) {
    verifyPageButton();
    //$('.pageSize').removeClass('disabled');
    var updateMeetingTimeDisplay = 'No meeting time found';
    var resultTableHtml = '';
    resultViewerPagination['pageSize'] = $('#basic-result-page-size-select').val();

    //The pagination function takes in the participants data, pageSize and page number
    var currentPageItems = paginateResultTable(resultViewerPagination['participantsData'], resultViewerPagination['pageSize'], resultViewerPagination['pageNumber']);

    if (currentPageItems.length > 0) {
        for (var i = 0; i < currentPageItems.length; i++) {
            resultTableHtml +=
                `<tr>
                    <td>${currentPageItems[i]}</td>
                    <td>${resultQuery['meetingId']}</td>
                    <td>${resultQuery['duration']}</id>
                </tr>`
        
                if (currentPageItems[i] == resultViewerPagination['participantsData'][resultViewerPagination['participantsData'].length - 1]) {
                    $('#data-next-page-btn').addClass('disabled').prop('disabled', true);;
                } else {
                    $('#data-next-page-btn').removeClass('disabled').prop('disabled', false);;
                }
            }
        $('#result-tbody').html(resultTableHtml);
    } 
    } else {
        disablePaginationElements();
    }
}

function getDurationIfNotSpecified(fromTime, toTime) {
    resultQuery['duration'] = ((parseInt(toTime/100)*60) + (parseInt(toTime%100))) - ((parseInt(fromTime/100)*60) + (parseInt(fromTime%100)));
}

function updateMeetingTimeDisplay(fromTime, toTime) {
    //console.log(fromTime);
    var fromTimeDayTime = 'AM';
    var toTimeDayTime = 'AM';

    if (fromTime >= 1200) {
        fromTimeDayTime = 'PM';
    }

    if (toTime >= 1200) {
        toTimeDayTime = 'PM';
    }

    $('.meetingTimeDisplay').text('Meeting Time(s): ' + fromTime + ' ' + fromTimeDayTime + ' to ' + toTime + ' ' + toTimeDayTime);
}





/* Abstracted Functions */
function paginateResultTable(userData, page_size, page_number) {
	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    var paginatedArray = userData.slice((page_number - 1) * page_size, page_number * page_size);
    return paginatedArray;
}

function verifyPageButton() {
    if (resultViewerPagination['pageNumber'] == 1) {
        $('#data-first-page-btn').addClass('disabled');
        $('#data-previous-page-btn').addClass('disabled');
        if (resultViewerPagination['participantsData'].length > 0) {
        $('.pageSize').removeClass('disabled');
        }
    } else {
        $('#data-first-page-btn').removeClass('disabled');
        $('#data-previous-page-btn').removeClass('disabled');
        $('.pageSize').addClass('disabled');
    }
}

function updateHTMLPagination(pageNumber) {
    if (pageNumber < 1) {
        pageNumber = 1;
    }

    $('.dynamicPageNumber').attr('data-page-number', pageNumber.toString());
    $('.dynamicPageNumberText').text('Page ' +pageNumber.toString());
    resultViewerPagination['pageNumber'] = pageNumber;
}

function disablePaginationElements() {
    $('#result-tbody').html('');
    $('.page-item').addClass('disabled');
    $('.pageSize').addClass('disabled');
    $('#data-first-page-btn').addClass('disabled');
}

function resetPagination() {
    resultQuery['meetingId'] = null;
    resultQuery['duration'] = null;

    if (resultQuery['fromTime'] && resultQuery['toTime']) {
        resultQuery['fromTime'] = null;
        resultQuery['toTime'] = null;
    } 

    resultViewerPagination['participantsData'] = [];
    resultViewerPagination['pageNumber'] = 1;
    $('.dynamicPageNumberText').text('Page ' +resultViewerPagination['pageNumber'].toString());
    $('.dynamicPageNumber').attr('data-page-number', resultViewerPagination['pageNumber'].toString());
}

function enableFormButtons(boolean) {
    //True: Enable, False: Disable
    if (boolean) {
        $('#searchButton').removeClass('disabled').prop('disabled', false);
        $('#resetButton').removeClass('disabled').prop('disabled', false);
    } else {
        $('#searchButton').addClass('disabled').prop('disabled', true);
        $('#resetButton').addClass('disabled').prop('disabled', true)
    }
}

/* Function to switch between Result & Data Viewer */
function registerSwitchViewerButton() {
    $('.btn-dataviewer').click(redirectToViewer);
    $('.btn-resultviewer').click(redirectToViewer);
}

function registerSwitchToAdvanceResultButton() {
    $('.btn-switchresultviewer').click(redirectBetweenBasicAdvanced);
}

function redirectBetweenBasicAdvanced(event) {
    //Gets the attribute from the button click to see what the current page is
    var currentPageData = $(this).attr('data-custom-value');
    
    //If current page is available data, swap it to advanced, this means changing the result Query & API
    if (currentPageData == 'computeAvailableData') {
        //The button text will be updated so the user knows the page has changed
        $(this).text('Compute by Availability');
        //Update the attribute so the next click, it will swap to availablity
        $(this).attr('data-custom-value', 'computeUnavailableData');
        //Update the API
        resultUrl = 'https://theateam-ades.herokuapp.com/advance/result';
        //Update the result query, we do not need to load in everything again as when we access the page originally, the query is already loaded in with meetingId, duration, fromTime and toTime
        //We just want to reset the field(s) that may have not been cleared
        resultQuery = {
            meetingId: null,
            duration: null,
        };
        //The advanced result viewer has additional inputs, when we are viewing advanced RV, we want to display them
        $('.advanceResultViewerInput').css('display', 'block');
        //Calls the function that loads the element with the id of #form-filter with the advanced RV input fields
        loadAdvFormFilter();
    } else {
        $(this).text('Compute by Unavailability');
        $(this).attr('data-custom-value', 'computeAvailableData'); 
        resultUrl = 'https://theateam-ades.herokuapp.com/basic/result';
        resultQuery = {
            meetingId: null,
            duration: null,
            fromTime: null,
            toTime: null
        };
        //The advanced result viewer has additional inputs, when we are viewing basic RV, we want to hide them
        $('.advanceResultViewerInput').css('display', 'none');
        //Calls the function that loads the element with the id of #form-filter with the basic RV input fields
        loadBasicFormFilter();
    }
}

//Reloads the #form-filter element
function loadAdvFormFilter() {
    $('#form-filter').html(
    `
    <div class='form-row'>

    <!-- Search Bar -->
    <div class='col-3 ml-auto'>
        <input id='meetingIdSearchBar' key='meetingId' type='number' class='form-control borderRadius pr-1 formSearchbar'
            placeholder='Input Meeting ID' onkeyup='checkInputFields()'>
    </div>
    <div class='col-3'>
        <input id='meetingDurationSearchBar' key='duration' type='number' class='form-control borderRadius formSearchbar'
            placeholder='Input Duration' onkeyup='checkInputFields()'>
    </div>

    <div class='col-1'>
        <input id='fromTimeSearchBar' key='fromTime' type='number' class='form-control borderRadius formSearchbar'
            placeholder='fromTime' onkeyup='checkInputFields()'>
    </div>

    <div class='col-1'>
        <input id='toTimeSearchBar' key='toTime' type='number' class='form-control borderRadius formSearchbar'
            placeholder='toTime' onkeyup='checkInputFields()'>
    </div>

    <div class='px-2'></div>
    <!-- Search & Reset button -->
    <input id='searchButton' class='btn btn-dark customATeamButton px-4 disabled' type='submit' value='Search' disabled></input>
    <div class='px-1'></div>
    <button id='resetButton' class='btn btn-danger customATeamResetButton px-4 disabled' type='reset' value='Reset' disabled>Reset</button>
    
    </div>
    `
    );
}

//Reloads the #form-filter element
function loadBasicFormFilter() {
    $('#form-filter').html(
        `<div class='form-row'>

        <!-- Search Bar -->
        <div class='col-3 ml-auto'>
            <input id='meetingIdSearchBar' key='meetingId' type='number' class='form-control borderRadius pr-1 formSearchbar'
                placeholder='Input Meeting ID' onkeyup='checkInputFields()'>
        </div>
        <div class='col-3'>
            <input id='meetingDurationSearchBar' key='meetingDuration' type='number' class='form-control borderRadius formSearchbar'
                placeholder='Input Duration' onkeyup='checkInputFields()'>
        </div>
        
        <div class='px-2'></div>
        <!-- Search & Reset button -->
        <input id='searchButton' class='btn btn-dark customATeamButton px-4 disabled' type='submit' value='Search' disabled></input>
        <div class='px-1'></div>
        <button id='resetButton' class='btn btn-danger customATeamResetButton px-4 disabled' type='reset' value='Reset' disabled>Reset</button>
    </div>`
    );
}

//Switch between each viewer, DV & RV
function redirectToViewer(event) {
    var getButtonValue = $(this).attr('data-custom-value');
    var assignLocation = 'index.html';

    if (getButtonValue == 'rviewer') {
        assignLocation = 'resultViewer.html';
    }
    
    window.location.href = assignLocation;
}
