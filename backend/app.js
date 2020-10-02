var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');
const resultViewerAlgorithm = require('./resultViewerAlgo');
const regexNumbers = new RegExp('^[0-9]+$');

/*const redis = require("redis");
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.on("connect", function() {
  console.log("You are now connected to Redis");
});*/


var app = express();

//Cors is used to allow Cross Origin Resource Sharing
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	return res.json({
		message: "Welcome to JibaBoom - TheATeam",
		availableEndpoints: [
      `GET basic/data [Parameter: availabilityType = 0 or 1  | page & pageSize | meetingId (10 digits) | participantId (10 digits)],
       POST basic/insert [Parameter: meetingId (10 digits) | availabilityId (10 digits) | participantId (10 digits) | startTime | endTime],
       POST advance/insert [Parameter: meetingId (10 digits) | unavailabilityId (10 digits) | participantId (10 digits) | startTime | endTime],
       GET basic/result [Parameter: meetingId (10 digits) | duration (small int, optional)],
       GET advance/result [Parameter: meetingId (10 digits) | fromTime | toTime | duration (small int, optional)]`
    ]
  });
});

app.get('/reset', (req, res, next) => {
database.resetTable((error, result) => {
  if (error) {
    return error;
  } else {
    var commandDrop = result[0].command;
    var commandCreate = result[1].command;
    if (commandDrop == 'DROP' && commandCreate == 'CREATE') {
    res.json({
      "drop":"dropped table",
      "create":"created table"
      })
    } else {
      res.json({result});
    }
    }
  })
});

//This endpoint is a GET endpoint, it retrieves the respective data according to the query sent to the Database which is dependent on the user's input
app.get('/basic/data', (req, res, next) => {
  //The variables will get their values from the URL
  var {meetingId, participantId, availabilityType, page, pageSize} = req.query;

  if (meetingId) {
  if (isNaN(meetingId) || meetingId.length != 10) {
    res.json({
      "error": `meetingID must be 10 numeric digits`,
      "code": 400
    })
    return 400;
  }
}

if (participantId) {
  if (isNaN(participantId) || participantId.length != 10) {
    res.json({
      "error": `participantID must be 10 numeric digits`,
      "code": 400
    })
    return 400;
  }
}

if (availabilityType) {
  if (availabilityType != '0' && availabilityType != '1') {
    res.json({
      "error": `availabilityType must either be 0 or 1. 0 means unavailable, 1 means available`,
      "code": 400
    })
    return 400;
  }
}

  //This calls the getData function from 'database.js' and takes in the values to run the query
  database.getData(meetingId, participantId, availabilityType, page, pageSize, (error, result) => {
    //If there is an error, it will return a error message and a http status code
    if (error) {
      console.log('There is an error!');
      res.json({
        "error": `${error.message}`,
        "code" : parseInt(error.code)
      });
      return error;
    } else {
      //If there are no errors, it will return a valid client json object which the frontend can then manipulate to display it accordingly

      for (var i = 0; i < result.length; i++) {
        //console.log(json);
        if (result[i].availabilitytype == 1) {
          //result[i].availabilitytype = "Available Timing";
          result[i].availabilityid = result[i].timeid;
          delete result[i].timeid;
          delete result[i].availabilitytype;
        } else {
          //result[i].availabilitytype = "Unavailable Timing";
          result[i].unavailabilityid = result[i].timeid;
          delete result[i].timeid;
          delete result[i].availabilitytype;
        }
      }
      
      //console.log('Adding to redis cache...');
      //add data to Redis
      //redisClient.setex('basicDataCached', 3600, JSON.stringify(result));

      res.json({result});
    }
  });
})

//This is a POST endpoint, it inserts the data accordingly into the Database
app.post('/basic/insert', (req, res, next) => {
  //Apart from standard error messages, we have our own to make it much more user friendly
  var customErrMsg = '';
  //In addition to standard HTTP error codes, we use custom error codes so that we are able to narrow down the problem when faced with one. Rather than a generic error code.
  var customErrCode = 0;
  //It requests for the data from the body
  const {data} = req.body;

    if (data) {
        //For loop, loops through the data requested from the body and checks if they meet the requirements
  for (var i = 0; i < data.length; i++ ) {
        data[i].timeId = data[i].availabilityId;
        delete data[i].availabilityId;

        //If it does not meet the requirement, it will return an error response to the Client
        if(isNaN(data[i].meetingId) || data[i].meetingId.toString().length != 10) {
          customErrMsg = 'Invalid meeting ID';
          //Custom error code 400 refers to a Client Error, so that narrows the debugging process
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }
    
        if(isNaN(data[i].timeId) || data[i].timeId.toString().length != 10) {
          customErrMsg = 'Invalid availability ID';
          //Client error
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }

        if(isNaN(data[i].participantId) || data[i].participantId.toString().length != 10) {
          customErrMsg = 'Invalid participant ID';
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }

        if(data[i].startTime.toString() < 0 || data[i].endTime.toString() < 0 || data[i].startTime.toString().length !=4  || data[i].endTime.toString().length !=4 || isNaN(parseInt(data[i].startTime)) || isNaN(parseInt(data[i].endTime)) || (data[i].startTime) > parseInt(data[i].endTime)) {
          customErrMsg = 'Invalid start time and/or end time';
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }
      }

      console.log("Here");


    } else {
      customErrMsg = 'Empty body, unable to insert!'
      customErrCode = 400;
      res.json({
        "error": `${customErrMsg}`,
        "code": customErrCode
      });
      return customErrCode;
    }

      Object.keys(data).map(
        function(object){
          data[object]["availabilitytype"]=1;
      });

  //Calls the insertAvailability function from 'database.js'
  database.insertAvailability(data, (error, result) => {
    //As a switch case is more efficient for multiple if-else in certain situations, we used it below
    if (error) {
      switch (error.code) {
        case '23505': customErrMsg += 'Duplicate Entry Error!';
        break;
        case '23502': customErrMsg += 'Invalid / Undefined input parameters!';
        break;
        default: customErrMsg = error.message;
      }

      res.json({
        "error": `${customErrMsg}`,
        "code": parseInt(error.code)
      });
      return error;
    } else {
      //If there is no error, it will let you know that the record(s) have been added
      res.json({
        "result": "Added in record(s) successfully"
      });
    }
  });
});


//This is a POST endpoint, it inserts the data accordingly into the Database
app.post('/advance/insert', (req, res, next) => {
  //Apart from standard error messages, we have our own to make it much more user friendly
  var customErrMsg = '';
  //In addition to standard HTTP error codes, we use custom error codes so that we are able to narrow down the problem when faced with one. Rather than a generic error code.
  var customErrCode = 0;
  //It requests for the data from the body
  const {data} = req.body;
  var url = req.params[0];

  if (data) {
    for (var i = 0; i < data.length; i++) {
        data[i].timeId = data[i].unavailabilityId;
        delete data[i].unavailabilityId;
    }
  } else {
    customErrMsg = 'Empty body, unable to insert!'
    customErrCode = 400;
    res.json({
      "error": `${customErrMsg}`,
      "code": customErrCode
    });
    return customErrCode;
  }

  //For loop, loops through the data requested from the body and checks if they meet the requirements
  for (var i = 0; i < data.length; i++ ) {
    //If it does not meet the requirement, it will return an error response to the Client
    if(isNaN(data[i].meetingId) || data[i].meetingId.toString().length != 10) {
      customErrMsg = 'Invalid meeting ID';
      //Custom error code 400 refers to a Client Error, so that narrows the debugging process
      customErrCode = 400;
      res.json({
        "error": `${customErrMsg}`,
        "code": customErrCode
      });
      return customErrCode;
    }
    
        if(isNaN(data[i].timeId) || data[i].timeId.toString().length != 10) {
          customErrMsg = 'Invalid availability ID';
          //Client error
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }

        if(isNaN(data[i].participantId) || data[i].participantId.toString().length != 10) {
          customErrMsg = 'Invalid participant ID';
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }

        try {
        if(data[i].startTime.toString() < 0 || data[i].endTime.toString() < 0 || data[i].startTime.toString().length !=4  || data[i].endTime.toString().length !=4 || isNaN(parseInt(data[i].startTime)) || isNaN(parseInt(data[i].endTime)) || (data[i].startTime) > parseInt(data[i].endTime)) {
          customErrMsg = 'Invalid start time and/or end time';
          customErrCode = 400;
          res.json({
            "error": `${customErrMsg}`,
            "code": customErrCode
          });
          return customErrCode;
        }
      } catch (error) {
        customErrMsg = 'Invalid start time and/or end time';
        customErrCode = 400;
        res.json({
          "error": `${customErrMsg}`,
          "code": customErrCode
        });
        return customErrCode;
      }


      }

      Object.keys(data).map(
        function(object){
          data[object]["availabilitytype"]=0;
      });

  //Calls the insertAvailability function from 'database.js'
  database.insertAvailability(data, (error, result) => {
    //As a switch case is more efficient for multiple if-else in certain situations, we used it below
    if (error) {
      switch (error.code) {
        case '23505': customErrMsg += 'Duplicate Entry Error!';
        break;
        case '23502': customErrMsg += 'Invalid / Undefined input parameters!';
        break;
        default: customErrMsg = error.message;
      }

      res.json({
        "error": `${customErrMsg}`,
        "code": parseInt(error.code)
      });
      return error;
    } else {
      //If there is no error, it will let you know that the record(s) have been added
      res.json({
        "result": "success"
      });
    }
  });
});

app.get('/basic/result', function (req, res, next) {
  const {meetingId, duration} = req.query;
  var availabilityType = 1;
  var meetingDuration = undefined;

  console.log("Duration: " +duration);

  if (duration) {
    if (duration < 1 || isNaN(duration) || duration > 1440) {
      meetingDuration = undefined;

      customErrMsg = 'Invalid duration (Cannot be > 24 hours)!';
      //Client error
      customErrCode = 400;
      res.json({
        "error": `${customErrMsg}`,
        "code": customErrCode
      });
      return customErrCode;

    } else {
      meetingDuration = duration;
    }
  }

  if (meetingId.length != 10 || isNaN(meetingId)) {
    var errCode = 400;
    res.json({
      "error": "MeetingId must be 10 digits",
      "code": errCode
    })
    return errCode;
  } else {
  database.getUsersForComputation(meetingId, availabilityType, (error, result) => {
  if (error) {
    res.json({
      "error": error.message,
      "code": parseInt(error.code)
    });
  } else {
  var userDataArray = [];
  var getduration = meetingDuration;

  for (var i = 0; i < result.length; i++) {
    userDataArray.push([result[i].participantid, 
      (result[i].starttime.replace(/:/g,'')).substring(0,4), 
      (result[i].endtime.replace(/:/g,'')).substring(0,4)]);
  }

  const { error: computationError, result: computationResult } =
  resultViewerAlgorithm.computeBasic(meetingId, userDataArray, getduration);
  if (computationError) return next(computationError);

  return res.json({
    "result": computationResult
    });
   }
  });
}
});


app.get('/advance/result', function (req, res, next) {
  const {meetingId, duration, fromTime, toTime} = req.query;
  var noErrors = false;
  var availablilityType = 0;
  var meetingDuration = undefined;

  if (duration) {
    if (duration < 1 || isNaN(duration)) {
      meetingDuration = undefined;
      noErrors = false;
      customErrMsg = 'Invalid duration!';
      //Client error
      customErrCode = 400;
      res.json({
        "error": `${customErrMsg}`,
        "code": customErrCode
      });
      return customErrCode;
    } else {
      noErrors = true;
      meetingDuration = duration;
    }
  }

  if (meetingId.length != 10 || isNaN(meetingId)) {
    noErrors = false;
    var errCode = 400;
    res.json({
      "error": "MeetingId must be 10 numeric digits",
      "code": errCode
    })
    return errCode;
  } else {
    noErrors = true;
  }

  try {
    if(fromTime.toString().length !=4  || toTime.toString().length !=4 || fromTime < 0 || fromTime > 2359 || toTime < 0 || toTime > 2359 || !regexNumbers.test(fromTime.toString()) || !regexNumbers.test(toTime.toString()) || isNaN(parseInt(fromTime)) || isNaN(parseInt(toTime)) || parseInt(fromTime) > parseInt(toTime) || fromTime == toTime) {
      noErrors = false;
      customErrMsg = 'Invalid from time and/or to time';
      customErrCode = 400;
      res.json({
        "error": `${customErrMsg}`,
        "code": customErrCode
      });
      return customErrCode;
    } else {
      noErrors = true;
    }
  } catch (error) {
    noErrors = false;
    customErrMsg = 'Invalid from time and/or to time';
    customErrCode = 400;
    res.json({
      "error": `${customErrMsg}`,
      "code": customErrCode
    });
    return customErrCode;
  }

  if (noErrors) {
  database.getUsersForComputation(meetingId, availablilityType, (error, result) => {
  if (error) {
    res.json({
      "error": error.message,
      "code": parseInt(error.code)
    });
  } else {
  var userDataArray = [];
  var timeRange = [fromTime.toString(), toTime.toString()];
  var getduration = meetingDuration;

  for (var i = 0; i < result.length; i++) {
    userDataArray.push([result[i].participantid, 
      (result[i].starttime.replace(/:/g,'')).substring(0,4), 
      (result[i].endtime.replace(/:/g,'')).substring(0,4)]);
  }

  const { error: computationError, result: computationResult } =
  resultViewerAlgorithm.computeAdvanced(meetingId, userDataArray, getduration, timeRange);
  if (computationError) return next(computationError);

  return res.json({
    "result": computationResult
    });
   }
  });
}
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: err.message,
    code: err.status || 500
  });
});

module.exports = app;