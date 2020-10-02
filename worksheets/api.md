# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

## Get Basic Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    | /basic/data |

### Parameters
The above endpoint does not take in parameters however,
when filtering data, it does taken in certain GET Parameters through the URL. The parameters are separated by a '?' in the URL. There is a endpoint below to show how the GET Parameter is used. (Table is listed below)

| parameter      | datatype | example    |
| -------------  | -------- | ---------  |
| meetingid      | BIGINT   | 9234567890 |
| participantid  | BIGINT   | 9234567891 |
|availabilityType| BIT      | 0 / 1      | (Optional field, not required)
| page           | INT      | 1          |
| pageSize       | INT      | 25         |

The page and pageSize values are dynamic. It is according to the currentPage and the amount of data the user wants displayed on the current page.

The availabilityType is an optional parameter, it is used to decipher between the available data and unavailable data. (0 represents unavailable, 1 represents available)


### Response Body

```json
{
  "result": [
    {
      "id": 1,
      "meetingid": 1234567890,
      "availabilityid": 1234567894,
      "participantid": 305847630,
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    },
    {
      "id": 2,
      "meetingid": 1234567890,
      "availabilityid": 1095847020,
      "participantid": 305847634,
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    },
    {
      "id": 3,
      "meetingid": 1234567890,
      "availabilityid": 1095847021,
      "participantid": 305847634,
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    },
    {
      "id": 4,
      "meetingid": 1234567890,
      "availabilityid": 1095847022,
      "participantid": 305847634,
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    },
    {
      "id": 5,
      "meetingid": 1234567890,
      "availabilityid": 1095847023,
      "participantid": 305847634,
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    }
  ]
}
```

### Error

```json
{
  "error": "meetingID must be 10 numeric digits",
  "code": 400
}
```

### Sample Request (Basic + Advanced - Displaying Available & Unavailable)

```http
GET http://localhost:3000/basic/data?meetingId=1234567869&participantId=1058476352&page=0&pageSize=5
```

### Sample Response

```json
{
  "result": [
    {
      "id": 15,
      "meetingid": "1234567869",
      "availabilityid": "1213128223",
      "participantid": "1058476352",
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    },
    {
      "id": 15,
      "meetingid": "1234567869",
      "unavailabilityid": "1213128223",
      "participantid": "1058476352",
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    }
  ]
}
```


### Sample Request (Basic - Available Data)

```http
GET http://localhost:3000/basic/data?meetingId=1234567869&participantId=1058476352&page=0&pageSize=5&availabilityType=1
```

### Sample Response

```json
{
  "result": [
    {
      "id": 15,
      "meetingid": "1234567869",
      "availabilityid": "1213128223",
      "participantid": "1058476352",
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    }
  ]
}
```

### Sample Request (Advance - Unavailable Data)

```http
GET http://localhost:3000/basic/data?meetingId=1234567869&participantId=1058476352&page=0&pageSize=5&availabilityType=0
```

### Sample Response

```json
{
  "result": [
    {
      "id": 15,
      "meetingid": "1234567869",
      "unavailabilityid": "1213128223",
      "participantid": "1058476352",
      "starttime": "10:00:00",
      "endtime": "10:30:00"
    }
  ]
}
```

### Sample Error (If meetingID / participantID is not a number or not equal to 10 digits)

```json
{
  "error": "meetingID must be 10 numeric digits",
  "code": 400
}
```



##################################################

## Post Basic Data

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | POST          |
| Endpoint    | /basic/insert |

### Parameters

| parameter      | datatype          | example    |
| -------------  | --------          | ---------  |
| meetingid      | BIGINT            | 9234567893 |
| availabilityid | BIGINT            | 9234567892 |
| participantid  | BIGINT            | 9234567891 |
| startTime      | TIME / STRING     | "1000"     |
| endTime        | TIME / STRING     | "1030"     |

### Response Body

```json
{
  "result": "Added in record(s) successfully"
}
```

### Error

```json
{
  "error": "Invalid / Undefined input parameters!",
  "code": "23502"
}
---------
{
  "error": "Duplicate Entry Error!",
  "code": 23505
}
---------
{
  "error": "Invalid meeting ID",
  "code": 400
}
```

##################################################

## Post Advance Data

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | POST          |
| Endpoint    |/advance/insert|

### Parameters

| parameter        | datatype          | example    |
| -------------    | --------          | ---------  |
| meetingid        | BIGINT            | 9234567891 |
| unavailabilityid | BIGINT            | 9334567892 |
| participantid    | BIGINT            | 9434567893 |
| startTime        | TIME / STRING     | "1000"     |
| endTime          | TIME  / STRING    | "1030"     |

### Response Body

```json
{
  "result": "Added in record(s) successfully"
}
```

### Error

```json
{
  "error": "Invalid meeting ID",
  "code": 400
}
---------
{
  "error": "Duplicate Entry Error!",
  "code": 23505
}
---------
{
  "error": "Invalid availability ID",
  "code": 400
}
```

### Sample Request

```http
POST http://localhost:3000/advance/insert

(As it reads via req.body)

{
    "data": [
        {
        "meetingId": 1000000000,
        "unavailabilityId": 1100000000,
        "participantId": 1200000000,
        "startTime": "1600",
        "endTime": "1630"
        },
        {
        "meetingId": 1000000000,
        "unavailabilityId": 1100000001,
        "participantId": 1200000001,
        "startTime": "1630",
        "endTime": "1700"
        },
        {
        "meetingId": 1000000001,
        "unavailabilityId": 1100000002,
        "participantId": 1200000001,
        "startTime": "1500",
        "endTime": "1545"
        }
    ]
}

```

### Sample Response

```json
{
  "result": "Added in record(s) successfully"
}
```

### Sample Error

```json
{
  "error": "Invalid start time and/or end time",
  "code": 400
}
---------
{
  "error": "Duplicate Entry Error!",
  "code": 23505
}
---------
{
  "error": "Invalid meeting ID",
  "code": 400
}
```


##################################################


## Get Basic Result

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    |/basic/result|

### Parameters
The above endpoint does not take in parameters however,
when filtering data, it does taken in certain GET Parameters through the URL. The parameters are separated by a '?' in the URL. There is a endpoint below to show how the GET Parameter is used. (Table is listed below)

| parameter      | datatype | example    |
| -------------  | -------- | ---------  |
| meetingid      | BIGINT   | 9234567890 |
| duration       | SMALLINT | 1700       | (Optional input)

The page and pageSize values are not specified here as they are handled through Client side.

The duration is optional, not required for the alogrithm to compute the result. If used, it only allows for 0001 to 2359 and omits the semi colon. It is in the 24 hour format which can be taken to be a Integer.


### Sample Request (Without Duration)

```http
GET http://localhost:3000/basic/result?meetingId=1000000690
```

### Sample Response

```json
{
  "result": {
    "fromTime": "1030",
    "toTime": "1100",
    "participants": [
      {
        "participantId": 1100000001
      },
      {
        "participantId": 1100000002
      }
    ]
  }
}
```


### Sample Request (With Duration)

```http
GET http://localhost:3000/basic/result?meetingId=1100000001&duration=15
```

### Sample Response

```json
{
  "result": {
    "fromTime": "1045",
    "toTime": "1100",
    "participants": [
      {
        "participantId": 1100000001
      },
      {
        "participantId": 1100000002
      }
    ]
  }
}
```


### Sample Error (If meetingID / is not a number or not equal to 10 digits)

```json
{
  "error": "meetingID must be 10 numeric digits",
  "code": 400
}
```


### Sample Error (If time is invalid)

```json
{
  "error": "Invalid druation (Cannot be > 24 hours)!",
  "code": 400
}
```



##################################################


## Get Advance Result

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | GET           |
| Endpoint    |/advance/result|

### Parameters
The above endpoint does not take in parameters however,
when filtering data, it does taken in certain GET Parameters through the URL. The parameters are separated by a '?' in the URL. There is a endpoint below to show how the GET Parameter is used. (Table is listed below)

| parameter      | datatype        | example    |
| -------------  | --------        | ---------  |
| meetingid      | BIGINT          | 9934567891 |
| fromTime       | TIME / SMALLINT | 1200       |
| toTime         | TIME / SMALLINT | 1700       |

The page and pageSize values are not specified here as they are handled through Client side.

The fromTime and toTime are in 24 hour format hence they are considered to be small integer as the range would be 0000 to 2359.


### Sample Request (Without Duration)

```http
GET http://localhost:3000/advance/result?meetingId=9999999999&fromTime=1000&toTime=1700
```

### Sample Response

```json
{
  "result": {
    "fromTime": "1000",
    "toTime": "1600",
    "participants": [
      {
        "participantId": 9999999999
      }
    ]
  }
}
```


### Sample Error (If meetingID / is not a number or not equal to 10 digits)

```json
{
  "error": "meetingID must be 10 numeric digits",
  "code": 400
}
```


### Sample Error (If time is invalid)

```json
{
  "error": "Invalid druation (Cannot be > 24 hours)!",
  "code": 400
}
```