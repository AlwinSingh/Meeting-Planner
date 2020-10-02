var meetingDuration = undefined;
var timeRange = [];
var userData = [];
var meetingId = 0;

function computeAdvanced(retrievedMeetingId, retrievedUserData, retrievedMeetingDuration, retrievedTimeRange) {
  timeRange = retrievedTimeRange;
  meetingId = retrievedMeetingId;
  userData = retrievedUserData;

  if (retrievedMeetingDuration != undefined) {
    meetingDuration = parseInt(retrievedMeetingDuration);
  } else {
    meetingDuration = retrievedMeetingDuration;
  }

  try {
    //totalSTETDifferenceTime(userST, userET);
    return { error: null, result: retrieveMeetingTimeFromUnavailableTimings() };
  } catch (error) {
    return { error, result: null };
  }
}

function retrieveMeetingTimeFromUnavailableTimings() {
  var possiblePairs = [];
  var commonStartTiming;
  var commonEndTiming;
  var possibleAttendees = 1;
  var attendeesCounter = 1;

  // CONVERTS ST & ET TO MINS
  for (var i = 0; i < userData.length; i++) {
    // Converts ST to Min
    var SThoursToMin = parseInt(userData[i][1] / 100) * 60;
    var STmins = parseInt(userData[i][1] % 100);
    userData[i][1] = SThoursToMin + STmins;
    // Convert ET to Mins
    var EThoursToMin = parseInt(userData[i][2] / 100) * 60;
    var ETmins = parseInt(userData[i][2] % 100);
    userData[i][2] = EThoursToMin + ETmins;
  }

  // CONVERTS TIME RANGE TO MINS
  var TRSThoursToMin = parseInt(timeRange[0] / 100) * 60;
  var TRSTmins = parseInt(timeRange[0] % 100);
  timeRange[0] = TRSThoursToMin + TRSTmins;
  var TREThoursToMin = parseInt(timeRange[1] / 100) * 60;
  var TRETmins = parseInt(timeRange[1] % 100);
  timeRange[1] = TREThoursToMin + TRETmins;

  // Find Busy Slots (Only if there are repeated slots)
  var busySlots = [];
  for (var i = 0; i < userData.length; i++) {
    for (var k = i + 1; k < userData.length; k++) {
      // If there are repeated slots of the same person & the 2nd starting time is earlier than
      // 1st starting time , push into busy slots
      if (userData[i][0] === userData[k][0] && userData[k][1] < userData[i][2]) {
        busySlots.push([userData[i][0], userData[i][1], userData[k][2]]);
      }
    }
  }

  // Find Free Slots
  var earliestTime = 0;
  var latestTime = 3600;
  var freeSlots = [];
  // If there is no busySlots that overlaps
  if (busySlots.length === 0) {
    for (var i = 0; i < userData.length; i++) {
      // Push time before the busy time, then push time after the busy time
      if (userData[i][1] != 0) {
        freeSlots.push([userData[i][0], earliestTime, userData[i][1]]);
      }
      if (userData[i][2] != latestTime) {
        freeSlots.push([userData[i][0], userData[i][2], latestTime]);
      }
    }
  } else {
    for (var i = 0; i < busySlots.length; i++) {
      // Push time before the busy time, then push time after the busy time
      if (busySlots[i][1] != 0) {
        freeSlots.push([busySlots[i][0], earliestTime, busySlots[i][1]]);
      }
      if (busySlots[i][2] != latestTime) {
        freeSlots.push([busySlots[i][0], busySlots[i][2], latestTime]);
      }
    }
  }

  // Check if there is a duration input
  switch (Number.isInteger(meetingDuration)) {
    // If meetindDuration is a number
    case true:
      // FINDS ALL POSSIBLE TIME SLOTS
      for (var i = 0; i < freeSlots.length; i++) {
        var possibleTimes = [];
        // Find the durationFree
        var durationFree = freeSlots[i][2] - freeSlots[i][1];
        // This is the earliest ST
        possibleTimes.push(freeSlots[i][1]);

        // Find in intervals of 5 Minutes
        do {
          if (durationFree >= 5) {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + 5);
            durationFree -= 5;
          } else {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + durationFree);
            durationFree -= durationFree;
          }
        } while (possibleTimes[possibleTimes.length - 1] != freeSlots[i][2]);

        // Forms the possible pair only if
        // 1. The duration is equal to the meeting duration
        // 2. Ending time is later than the starting time
        // 3. Starting Time must be greater or equal to the starting timeRange of the meeting
        // 4. Ending Time must be smaller of equal to the ending timeRange of the meeting
        for (var x = 0; x < possibleTimes.length; x++) {
          for (var k = x + 1; k < possibleTimes.length; k++) {
            if (
              possibleTimes[k] - possibleTimes[x] === meetingDuration &&
              possibleTimes[x] < possibleTimes[k] &&
              possibleTimes[x] >= timeRange[0] &&
              possibleTimes[k] <= timeRange[1]
            ) {
              possiblePairs.push([freeSlots[i][0], possibleTimes[x], possibleTimes[k]]);
            }
          }
        }
      }

      // Find the most common time pairing
      for (var i = 0; i < possiblePairs.length; i++) {
        for (var j = i + 1; j < possiblePairs.length; j++) {
          // CONDITIONS REQUIRED:
          // 1. Timing & ID must not be from the same person
          // 2. Starting & Ending Time must be the same
          if (
            possiblePairs[i][0] != possiblePairs[j][0] &&
            possiblePairs[i][1] == possiblePairs[j][1] &&
            possiblePairs[i][2] == possiblePairs[j][2]
          ) {
            possibleAttendees++;
          }

          // Finds the most common starting time & sets the most common starting timing.
          if (attendeesCounter < possibleAttendees) {
            attendeesCounter = possibleAttendees;
            commonStartTiming = possiblePairs[j][1];
            commonEndTiming = possiblePairs[j][1] + meetingDuration;
          }
        }
        possibleAttendees = 1;
      }
      break;

    // If meetingDuration is not a number/undefined
    case false:
    default:
      // FINDS ALL POSSIBLE TIME SLOTS
      for (var i = 0; i < freeSlots.length; i++) {
        var possibleTimes = [];
        // Find the durationFree
        var durationFree = freeSlots[i][2] - freeSlots[i][1];
        // This is the earliest ST
        possibleTimes.push(freeSlots[i][1]);

        // Find in intervals of 5 Minutes
        do {
          if (durationFree >= 5) {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + 5);
            durationFree -= 5;
          } else {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + durationFree);
            durationFree -= durationFree;
          }
        } while (possibleTimes[possibleTimes.length - 1] != freeSlots[i][2]);

        // Forms the possible pair only if
        // 1. Ending time is later than the starting time
        // 2. Starting Time must be greater or equal to the starting timeRange of the meeting
        // 3. Ending Time must be smaller of equal to the ending timeRange of the meeting
        for (var x = 0; x < possibleTimes.length; x++) {
          for (var k = x + 1; k < possibleTimes.length; k++) {
            if (
              possibleTimes[x] < possibleTimes[k] &&
              possibleTimes[x] >= timeRange[0] &&
              possibleTimes[k] <= timeRange[1]
            ) {
              possiblePairs.push([freeSlots[i][0], possibleTimes[x], possibleTimes[k]]);
            }
          }
        }
      }

      // If userData only has 1 entry
      // Else if userData has more than 1 entry
      if (userData.length == 1) {
        // Calculate TimeDiff
        var timeDiff;
        var possiblePairsWithTimeDiff = [];
        for (var x = 0; x < possiblePairs.length; x++) {
          timeDiff = possiblePairs[x][2] - possiblePairs[x][1];
          possiblePairsWithTimeDiff.push([possiblePairs[x][1], possiblePairs[x][2], timeDiff]);
        }

        // Sets default values
        commonStartTiming = possiblePairsWithTimeDiff[0][0];
        commonEndTiming = possiblePairsWithTimeDiff[0][1];
        biggestTimeDiff = possiblePairsWithTimeDiff[0][2];
        // Find the biggest Time Diff
        for (var i = 1; i < possiblePairsWithTimeDiff.length; i++) {
          if (possiblePairsWithTimeDiff[i][2] > biggestTimeDiff) {
            commonStartTiming = possiblePairsWithTimeDiff[i][0];
            commonEndTiming = possiblePairsWithTimeDiff[i][1];
            biggestTimeDiff = possiblePairsWithTimeDiff[i][2];
          }
        }

      } else if (userData.length > 1) {
        // Find the pairs that exists more than 2 times
        var commonPairs = [];
        for (var x = 0; x < possiblePairs.length; x++) {
          for (var k = x + 1; k < possiblePairs.length; k++) {
            // Must fulfil the folowing criteria when checking:
            // Condition 1: ID must not be from the same person
            // Condition 2: Starting time must be same
            // Condition 3: Ending time must be same
            // Condition 4: The pair must not exist inside the commonPairs array
            if (
              possiblePairs[x][0] != possiblePairs[k][0] &&
              possiblePairs[x][1] == possiblePairs[k][1] &&
              possiblePairs[x][2] == possiblePairs[k][2] &&
              commonPairs.includes(possiblePairs[k]) == false
            ) {
              // If this is the first time its going through
              // & the very 1st pairing with the timing does not exists, then push in the 1st value
              // & next pairing with same start and end time.
              // Else if there is already another pair with the same start and end time already exists,
              // Just push in the value of the latest one (3rd value onwards)
              if (commonPairs.includes(possiblePairs[x]) == false) {
                commonPairs.push(possiblePairs[x]);
                commonPairs.push(possiblePairs[k]);
              } else if (commonPairs.includes(possiblePairs[x]) == true) {
                commonPairs.push(possiblePairs[k]);
              }
            }
          }
        }

        // Check if commonPairs is empty
        // Else if its not empty
        if (commonPairs.length == 0) {
          // Find the most common time pairing
          for (var i = 0; i < possiblePairs.length; i++) {
            for (var j = i + 1; j < possiblePairs.length; j++) {
              // CONDITIONS REQUIRED:
              // 1. Timing & ID must not be from the same person
              // 2. Starting & Ending Time must be the same
              if (
                possiblePairs[i][0] != possiblePairs[j][0] &&
                possiblePairs[i][1] == possiblePairs[j][1] &&
                possiblePairs[i][2] == possiblePairs[j][2]
              ) {
                possibleAttendees++;
              }

              // Finds the most common starting time & sets the most common starting timing.
              // CONDITIONS REQUIRED:
              // 1. possibleAttendees must be greater than the attendeeCounter(Previous) OR
              // 2. possibleAttendees must be equal to the attendeeCounter AND be greater than the previous duration.
              if (
                attendeesCounter < possibleAttendees ||
                (attendeesCounter === possibleAttendees &&
                  possiblePairs[j][2] - possiblePairs[j][1] > commonEndTiming - commonStartTiming)
              ) {
                attendeesCounter = possibleAttendees;
                commonStartTiming = possiblePairs[j][1];
                commonEndTiming = possiblePairs[j][2];
              }
            }
            possibleAttendees = 1;
          }
        } else {
          // Find how many times a pairing occured
          var PairingTimingOccurance = [];
          var PairingOccurance = 1;
          for (var x = 0; x < commonPairs.length; x++) {
            for (var k = x + 1; k < commonPairs.length; k++) {
              // If a pair starting time & ending time is the same, increase PairingOccurance by 1
              if (commonPairs[x][1] == commonPairs[k][1] && commonPairs[x][2] == commonPairs[k][2]) {
                PairingOccurance++;
              }
            }

            // If the PairingTimeOccurace array is empty OR
            // the previous ending time is not the same as the next pair ending time (Prevents duplicates)
            if (
              PairingTimingOccurance.length == 0 ||
              PairingTimingOccurance[PairingTimingOccurance.length - 1][1] != commonPairs[x][2]
            ) {
              // Calculates the time difference & push it into the PairingTimeOccurance
              var timeDiff = commonPairs[x][2] - commonPairs[x][1];
              PairingTimingOccurance.push([commonPairs[x][1], commonPairs[x][2], timeDiff, PairingOccurance]);
            }
            PairingOccurance = 1;
          }

          // Find highest occurance number for pairs
          // Assumes that the 1st pair is the one with highest occurance
          // Loops through everypair in the array; If there is an new occurance number which is larger
          // than the current one set, update it as the largest occurance number.
          var highestPairingOccurance = PairingTimingOccurance[0][3];
          for (var x = 1; x < PairingTimingOccurance.length; x++) {
            if (PairingTimingOccurance[x][3] > highestPairingOccurance) {
              highestPairingOccurance = PairingTimingOccurance[x][3];
            }
          }

          // Filter out all the pairs with the highestPairingOccurance
          // Loops through every one to get the arrays with the highest occurance number
          // Push all the arrays into the new array which stores all the values with the same
          // highest occurance number
          var pairingWithHighestOccurance = [];
          for (var x = 0; x < PairingTimingOccurance.length; x++) {
            if (PairingTimingOccurance[x][3] == highestPairingOccurance) {
              pairingWithHighestOccurance.push(PairingTimingOccurance[x]);
            }
          }

          // Find the ideal time slot
          var longestDuration = pairingWithHighestOccurance[0][2];
          var idealTimeSlot = [];
          var x = 0;
          // Find the longer meeting timing duration base on its difference by default
          // However if there are only 2 participants, we will take the duration where they can both
          // have the longest meeting duration.
          // Do while will stop if the next number is smaller than the current longest duration
          do {
            if (pairingWithHighestOccurance[x][2] > longestDuration) {
              longestDuration = pairingWithHighestOccurance[x][2];
            } else if (pairingWithHighestOccurance[x][3] == 2) {
              // Loops through the array and sets the longest duration
              for (var k = 0; k < pairingWithHighestOccurance.length; k++) {
                if (pairingWithHighestOccurance[k][2] > longestDuration) {
                  longestDuration = pairingWithHighestOccurance[k][2];
                }
              }
            }
            // Increment by 1
            x++;
          } while (pairingWithHighestOccurance[x][2] > longestDuration);

          // If there are only 2 people; loop throgh the array & push the timing with the longest duration
          // into the idealTimeSlot array
          // Else if its more than 2 people (Occurances), push in the array where the do while loop stops at;
          // It needs to minus 1 as x has an increment before leaving the do while loop.
          if (pairingWithHighestOccurance[x][3] == 2) {
            for (var x = 0; x < pairingWithHighestOccurance.length; x++) {
              if (pairingWithHighestOccurance[x][2] == longestDuration) {
                idealTimeSlot.push(pairingWithHighestOccurance[x]);
              }
            }
          } else {
            idealTimeSlot.push(pairingWithHighestOccurance[x - 1]);
          }

          var earliestST = idealTimeSlot[0][0];
          var earliestET = idealTimeSlot[0][1];

          if (idealTimeSlot.length > 1) {
            // Loops through the array and sets the longest duration
            for (var k = 0; k < idealTimeSlot.length; k++) {
              if (idealTimeSlot[k][0] < earliestST && idealTimeSlot[k][1] < earliestET) {
                commonStartTiming = idealTimeSlot[k][0];
                commonEndTiming = idealTimeSlot[k][1];
              }
            }
          } else {
            // Sets the commonStartTiming & End Timing
            commonStartTiming = idealTimeSlot[0][0];
            commonEndTiming = idealTimeSlot[0][1];
          }
        }
      }
      break;
  }

  // FIND ALL POSSIBLE ATTENDEES
  var attendees = [];

  // Check who the attendees is
  for (var i = 0; i < possiblePairs.length; i++) {
    // To count the attendees, they must fulfil the following requirements
    // 1. Their time free must be equal to the common starting time.
    // 2. Their time free must be equal to the common ending time.
    if (possiblePairs[i][1] === commonStartTiming && possiblePairs[i][2] === commonEndTiming) {
      // Push the first attendees if length is 0 (To prevent duplicate data)
      // Else if name does not exist already, continue to push the other names
      if (attendees.length === 0 || attendees.includes(possiblePairs[i][0]) === false) {
        attendees.push(possiblePairs[i][0]);
      }
    }
  }

  // Converts the start time back to 24 hours clock
  var STMinToHours = Math.floor(commonStartTiming / 60) * 100;
  var STFinalMins = commonStartTiming % 60;
  var startTimein24h = STMinToHours + STFinalMins;
  // Converts the end time back to 24 hours clock
  var ETMinToHours = Math.floor(commonEndTiming / 60) * 100;
  var ETFinalMins = commonEndTiming % 60;
  var endTimein24h = ETMinToHours + ETFinalMins;

  // Result to be returned
  var participantsArray = [];
  var returnResult = {};

  if (isNaN(startTimein24h) == false && isNaN(endTimein24h) == false) {
    console.log('Meeting Duration: ' + meetingDuration + ' minutes.');
    console.log('Meeting Timing: ' + startTimein24h + 'h to ' + endTimein24h + 'h');
    console.log('Attendees Number: ' + attendees.length);
    console.log('Attendees Name: ' + attendees);

    for (var i = 0; i < attendees.length; i++) {
      participantsArray.push({ participantId: parseInt(attendees[i]) });
      //returnResult.push({"participantId":attendees[i]});
    }

    //returnResult = {"fromTime":startTimein24h, "toTime":endTimein24h, "meetingId":meetingId, "duration":meetingDuration, "participants":participantsArray};
    returnResult = {
      fromTime: startTimein24h.toString(),
      toTime: endTimein24h.toString(),
      participants: participantsArray,
    };
  } else {
    returnResult = { meeting: 'No available timings!' };
    console.log('No Available Timing!');
  }

  return returnResult;
}

function computeBasic(retrievedMeetingId, retrievedUserData, retrievedMeetingDuration) {
  meetingId = retrievedMeetingId;
  userData = retrievedUserData;

  if (retrievedMeetingDuration != undefined) {
    meetingDuration = parseInt(retrievedMeetingDuration);
  } else {
    meetingDuration = retrievedMeetingDuration;
  }

  try {
    //totalSTETDifferenceTime(userST, userET);
    return { error: null, result: retrieveMeetingTimeFromAvailableTimings() };
  } catch (error) {
    return { error, result: null };
  }
}

/* BASIC ALGORITHM */
function retrieveMeetingTimeFromAvailableTimings() {
  // Array to store the possible pairs
  var possiblePairs = [];
  var commonStartTiming = 0;
  var commonEndTiming = 0;
  var possibleAttendees = 1;
  var attendeesCounter = 1;

  // CONVERTS ST & ET TO MINS
  for (var i = 0; i < userData.length; i++) {
    // Converts ST to Min
    var SThoursToMin = parseInt(userData[i][1] / 100) * 60;
    var STmins = parseInt(userData[i][1] % 100);
    userData[i][1] = SThoursToMin + STmins;
    // Convert ET to Mins
    var EThoursToMin = parseInt(userData[i][2] / 100) * 60;
    var ETmins = parseInt(userData[i][2] % 100);
    userData[i][2] = EThoursToMin + ETmins;
  }

  // Check if there is a duration input
  switch (Number.isInteger(meetingDuration)) {
    // If meetindDuration is a number
    case true:
      // FINDS ALL POSSIBLE TIME SLOTS
      for (var i = 0; i < userData.length; i++) {
        var possibleTimes = [];
        // Find the durationFree
        var durationFree = userData[i][2] - userData[i][1];
        // This is the earliest ST
        possibleTimes.push(userData[i][1]);

        // Find in intervals of 5 Minutes
        do {
          if (durationFree >= 5) {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + 5);
            durationFree -= 5;
          } else {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + durationFree);
            durationFree -= durationFree;
          }
        } while (possibleTimes[possibleTimes.length - 1] != userData[i][2]);

        // Forms the possible pair only if
        // 1. The duration is equal or more than the meeting duration
        // 2. Ending time is later than the starting time
        for (var x = 0; x < possibleTimes.length; x++) {
          for (var k = x + 1; k < possibleTimes.length; k++) {
            if (possibleTimes[k] - possibleTimes[x] >= meetingDuration && possibleTimes[x] < possibleTimes[k]) {
              possiblePairs.push([userData[i][0], possibleTimes[x], possibleTimes[k]]);
            }
          }
        }
      }

      // Find the most common time pairing
      for (var i = 0; i < possiblePairs.length; i++) {
        for (var j = 1; j < possiblePairs.length; j++) {
          // CONDITIONS REQUIRED:
          // 1. Timing & ID must not be from the same person
          // 2. Starting & Ending Time must be the same
          if (
            possiblePairs[i][0] != possiblePairs[j][0] &&
            possiblePairs[i][1] == possiblePairs[j][1] &&
            possiblePairs[i][2] == possiblePairs[j][2]
          ) {
            possibleAttendees++;
          }

          // Finds the most common starting time & sets the most common starting timing.
          if (attendeesCounter < possibleAttendees) {
            attendeesCounter = possibleAttendees;
            commonStartTiming = possiblePairs[j][2];
            commonEndTiming = possiblePairs[j][2] + meetingDuration;
          }
        }
        possibleAttendees = 1;
      }
      break;

    // If meetingDuration is not a number/undefined
    case false:
    default:
      // FINDS ALL POSSIBLE TIME SLOTS
      for (var i = 0; i < userData.length; i++) {
        var possibleTimes = [];
        // Find the durationFree
        var durationFree = userData[i][2] - userData[i][1];
        // This is the earliest ST
        possibleTimes.push(userData[i][1]);

        // Find in intervals of 5 Minutes
        do {
          if (durationFree >= 5) {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + 5);
            durationFree -= 5;
          } else {
            possibleTimes.push(possibleTimes[possibleTimes.length - 1] + durationFree);
            durationFree -= durationFree;
          }
        } while (possibleTimes[possibleTimes.length - 1] != userData[i][2]);

        // Forms the possible pair only if
        // 1. Ending time is later than the starting time
        for (var x = 0; x < possibleTimes.length; x++) {
          for (var k = x + 1; k < possibleTimes.length; k++) {
            if (possibleTimes[x] < possibleTimes[k]) {
              possiblePairs.push([userData[i][0], possibleTimes[x], possibleTimes[k]]);
            }
          }
        }
      }

      // If userData only has 1 entry
      // Else if userData has more than 1 entry
      if (userData.length == 1) {
        // Find the most common time pairing
        for (var i = 0; i < possiblePairs.length; i++) {
          for (var j = i + 1; j < possiblePairs.length; j++) {
            // CONDITIONS REQUIRED:
            // 1. Timing & ID must not be from the same person
            // 2. Starting & Ending Time must be the same
            if (
              possiblePairs[i][0] != possiblePairs[j][0] &&
              possiblePairs[i][1] == possiblePairs[j][1] &&
              possiblePairs[i][2] == possiblePairs[j][2]
            ) {
              possibleAttendees++;
            }

            // Finds the most common starting time & sets the most common starting timing.
            // CONDITIONS REQUIRED:
            // 1. possibleAttendees must be greater than the attendeeCounter(Previous) OR
            // 2. possibleAttendees must be equal to the attendeeCounter AND be greater than the previous duration.
            if (
              attendeesCounter < possibleAttendees ||
              (attendeesCounter === possibleAttendees &&
                possiblePairs[j][2] - possiblePairs[j][1] > commonEndTiming - commonStartTiming)
            ) {
              attendeesCounter = possibleAttendees;
              commonStartTiming = possiblePairs[j][1];
              commonEndTiming = possiblePairs[j][2];
            }
          }
          possibleAttendees = 1;
        }
      } else if (userData.length > 1) {
        // Find the pairs that exists more than 2 times
        var commonPairs = [];
        for (var x = 0; x < possiblePairs.length; x++) {
          for (var k = x + 1; k < possiblePairs.length; k++) {
            // Must fulfil the folowing criteria when checking:
            // Condition 1: ID must not be from the same person
            // Condition 2: Starting time must be same
            // Condition 3: Ending time must be same
            // Condition 4: The pair must not exist inside the commonPairs array
            if (
              possiblePairs[x][0] != possiblePairs[k][0] &&
              possiblePairs[x][1] == possiblePairs[k][1] &&
              possiblePairs[x][2] == possiblePairs[k][2] &&
              commonPairs.includes(possiblePairs[k]) == false
            ) {
              // If this is the first time its going through
              // & the very 1st pairing with the timing does not exists, then push in the 1st value
              // & next pairing with same start and end time.
              // Else if there is already another pair with the same start and end time already exists,
              // Just push in the value of the latest one (3rd value onwards)
              if (commonPairs.includes(possiblePairs[x]) == false) {
                commonPairs.push(possiblePairs[x]);
                commonPairs.push(possiblePairs[k]);
              } else if (commonPairs.includes(possiblePairs[x]) == true) {
                commonPairs.push(possiblePairs[k]);
              }
            }
          }
        }

        // Check if commonPairs is empty
        // Else if its not empty
        if (commonPairs.length == 0) {
          // Find the most common time pairing
          for (var i = 0; i < possiblePairs.length; i++) {
            for (var j = i + 1; j < possiblePairs.length; j++) {
              // CONDITIONS REQUIRED:
              // 1. Timing & ID must not be from the same person
              // 2. Starting & Ending Time must be the same
              if (
                possiblePairs[i][0] != possiblePairs[j][0] &&
                possiblePairs[i][1] == possiblePairs[j][1] &&
                possiblePairs[i][2] == possiblePairs[j][2]
              ) {
                possibleAttendees++;
              }

              // Finds the most common starting time & sets the most common starting timing.
              // CONDITIONS REQUIRED:
              // 1. possibleAttendees must be greater than the attendeeCounter(Previous) OR
              // 2. possibleAttendees must be equal to the attendeeCounter AND be greater than the previous duration.
              if (
                attendeesCounter < possibleAttendees ||
                (attendeesCounter === possibleAttendees &&
                  possiblePairs[j][2] - possiblePairs[j][1] > commonEndTiming - commonStartTiming)
              ) {
                attendeesCounter = possibleAttendees;
                commonStartTiming = possiblePairs[j][1];
                commonEndTiming = possiblePairs[j][2];
              }
            }
            possibleAttendees = 1;
          }
        } else {
          // Find how many times a pairing occured
          var PairingTimingOccurance = [];
          var PairingOccurance = 1;
          for (var x = 0; x < commonPairs.length; x++) {
            for (var k = x + 1; k < commonPairs.length; k++) {
              // If a pair starting time & ending time is the same, increase PairingOccurance by 1
              if (commonPairs[x][1] == commonPairs[k][1] && commonPairs[x][2] == commonPairs[k][2]) {
                PairingOccurance++;
              }
            }

            // If the PairingTimeOccurace array is empty OR
            // the previous ending time is not the same as the next pair ending time (Prevents duplicates)
            if (
              PairingTimingOccurance.length == 0 ||
              PairingTimingOccurance[PairingTimingOccurance.length - 1][1] != commonPairs[x][2]
            ) {
              // Calculates the time difference & push it into the PairingTimeOccurance
              var timeDiff = commonPairs[x][2] - commonPairs[x][1];
              PairingTimingOccurance.push([commonPairs[x][1], commonPairs[x][2], timeDiff, PairingOccurance]);
            }
            PairingOccurance = 1;
          }

          // Find highest occurance number for pairs
          // Assumes that the 1st pair is the one with highest occurance
          // Loops through everypair in the array; If there is an new occurance number which is larger
          // than the current one set, update it as the largest occurance number.
          var highestPairingOccurance = PairingTimingOccurance[0][3];
          for (var x = 1; x < PairingTimingOccurance.length; x++) {
            if (PairingTimingOccurance[x][3] > highestPairingOccurance) {
              highestPairingOccurance = PairingTimingOccurance[x][3];
            }
          }

          // Filter out all the pairs with the highestPairingOccurance
          // Loops through every one to get the arrays with the highest occurance number
          // Push all the arrays into the new array which stores all the values with the same
          // highest occurance number
          var pairingWithHighestOccurance = [];
          for (var x = 0; x < PairingTimingOccurance.length; x++) {
            if (PairingTimingOccurance[x][3] == highestPairingOccurance) {
              pairingWithHighestOccurance.push(PairingTimingOccurance[x]);
            }
          }

          // Find the ideal time slot
          var longestDuration = pairingWithHighestOccurance[0][2];
          var idealTimeSlot = [];
          var x = 0;
          // Find the longer meeting timing duration base on its difference by default
          // However if there are only 2 participants, we will take the duration where they can both
          // have the longest meeting duration.
          // Do while will stop if the next number is smaller than the current longest duration
          do {
            if (pairingWithHighestOccurance[x][2] > longestDuration) {
              longestDuration = pairingWithHighestOccurance[x][2];
            } else if (pairingWithHighestOccurance[x][3] == 2) {
              // Loops through the array and sets the longest duration
              for (var k = 0; k < pairingWithHighestOccurance.length; k++) {
                if (pairingWithHighestOccurance[k][2] > longestDuration) {
                  longestDuration = pairingWithHighestOccurance[k][2];
                }
              }
            }
            // Increment by 1
            x++;
          } while (pairingWithHighestOccurance[x][2] > longestDuration);

          // If there are only 2 people; loop throgh the array & push the timing with the longest duration
          // into the idealTimeSlot array
          // Else if its more than 2 people (Occurances), push in the array where the do while loop stops at;
          // It needs to minus 1 as x has an increment before leaving the do while loop.
          if (pairingWithHighestOccurance[x][3] == 2) {
            for (var x = 0; x < pairingWithHighestOccurance.length; x++) {
              if (pairingWithHighestOccurance[x][2] == longestDuration) {
                idealTimeSlot.push(pairingWithHighestOccurance[x]);
              }
            }
          } else {
            idealTimeSlot.push(pairingWithHighestOccurance[x - 1]);
          }

          // Sets the commonStartTiming & End Timing
          commonStartTiming = idealTimeSlot[0][0];
          commonEndTiming = idealTimeSlot[0][1];
        }
      }
      break;
  }

  // FIND ALL POSSIBLE ATTENDEES
  //Default counter set to 0
  var counter = 0;
  var attendees = [];

  // Check who the attendees is
  for (var i = 0; i < possiblePairs.length; i++) {
    // To count the attendees, they must fulfil the following requirements
    // 1. Their time free must be before or equal to the starting time.
    // 2. Their time free must be later or equal to the ending time.
    // 3. ID does not exist already
    if (
      possiblePairs[i][1] === commonStartTiming &&
      possiblePairs[i][2] === commonEndTiming &&
      attendees.includes(possiblePairs[i][0]) == false
    ) {
      // push attendees name into an array & increase counter by 1
      attendees.push(possiblePairs[i][0]);
      counter += 1;
    }
  }

  // Converts the start time back to 24 hours clock
  var STMinToHours = Math.floor(commonStartTiming / 60) * 100;
  var STFinalMins = commonStartTiming % 60;
  var startTimein24h = STMinToHours + STFinalMins;
  // Converts the end time back to 24 hours clock
  var ETMinToHours = Math.floor(commonEndTiming / 60) * 100;
  var ETFinalMins = commonEndTiming % 60;
  var endTimein24h = ETMinToHours + ETFinalMins;

  // Result to be returned
  var participantsArray = [];
  var returnResult = {};

  if (!isNaN(startTimein24h) && !isNaN(endTimein24h)) {
    /*console.log('Meeting Duration: ' + meetingDuration + ' minutes.');
    console.log('Meeting Timing: ' + startTimein24h + 'h to ' + endTimein24h + 'h');
    console.log('Attendees Number: ' + counter);
    console.log('Attendees Name: ' + attendees);*/

    for (var i = 0; i < attendees.length; i++) {
      participantsArray.push({ participantId: parseInt(attendees[i]) });
      //returnResult.push({"participantId":attendees[i]});
    }

    //returnResult = {"fromTime":startTimein24h, "toTime":endTimein24h, "meetingId":meetingId, "duration":meetingDuration, "participants":participantsArray};
    if (participantsArray.length > 0) {
      returnResult = {
        fromTime: startTimein24h.toString(),
        toTime: endTimein24h.toString(),
        participants: participantsArray,
      };
    } else {
      returnResult = { meeting: 'No available timings!' };
    }
  } else {
    returnResult = { meeting: 'No available timings!' };
    console.log('No Available Timing!');
  }

  return returnResult;
}

module.exports = {
  computeBasic,
  computeAdvanced,
};
