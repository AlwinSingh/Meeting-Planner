//node [FileName] is used to test run the script
//Retrieves the module exported
const resultViewerAlgo = require('./resultViewerAlgo');

//Sample data for testing
var meetingId = 1234567890;
var meetingDuration = 60;
var userData = [
  ['1200000055', '0010', '0800'],
  ['1200000056', '1350', '1800'],
  ['1200000057', '1350', '1800'],
  ['1200000058', '1350', '1800'],
  ['1200000059', '1450', '1700'],
];

//Result returned is stored in this variable
var result = resultViewerAlgo.compute(meetingId, userData, meetingDuration);

//Result returned is printed out
console.log(result);

/*
var meetingDuration = 30;
var userData = [
  ['Alice', '1000', '1045'],
  ['Alice', '1040', '1110'],
  ['Becky', '1030', '1115'],
  ['Becky', '1100', '1130'],
];

var meetingDuration = 60;
var userData = [
  ['Alice', '1000', '1100'],
  ['Becky', '1100', '1200'],
  ['Charlie', '1200', '1300'],
];

var meetingDuration = 15;
var userData = [
  ['Alice', '1000', '1100'],
  ['Becky', '1045', '1230'],
  ['Charlie', '1030', '1200'],
  ['David', '1100', '1500'],
];

var meetingDuration = 15;
var userData = [
  ['Alice', '1000', '1100'],
  ['Becky', '1045', '1230'],
  ['Charlie', '1030', '1200'],
  ['David', '1100', '1500'],
  ['Eunice', '1600', '1700']
];
*/