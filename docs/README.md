# Github Pages

## HOSTED URLs
1. Github hosted frontend URL - https://ades-fsp.github.io/jibaboom-theateam/
2. Heroku hosted backend URL - https://theateam-ades.herokuapp.com/
3. APK Download URL - https://github.com/ADES-FSP/jibaboom-theateam/releases/tag/V1
4. Alternative APK Download URL - https://github.com/ADES-FSP/jibaboom-theateam/blob/master/mobile/APK/debug/app-debug.apk

## Available Endpoints
       GET basic/data [Parameter: availabilityType = 0 or 1  | page & pageSize | meetingId (10 digits) | participantId (10 digits)],
       POST basic/insert [Parameter: meetingId (10 digits) | availabilityId (10 digits) | participantId (10 digits) | startTime | endTime],
       POST advance/insert [Parameter: meetingId (10 digits) | unavailabilityId (10 digits) | participantId (10 digits) | startTime | endTime],
       GET basic/result [Parameter: meetingId (10 digits) | duration (small int, optional)],
       GET advance/result [Parameter: meetingId (10 digits) | fromTime | toTime | duration (small int, optional)]