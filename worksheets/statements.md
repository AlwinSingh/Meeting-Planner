# SQL Statements

## DROP
```sql
DROP TABLE IF EXISTS meeting_time_voter;
```

## SELECT
```sql
SELECT * from meeting_time_voter;
```

## SELECT with AvailabilityType
Example:

```sql
SELECT * from meeting_time_voter WHERE availabilityType = $1
```

## SELECT with AvailabilityType & Pagination
Example:

```sql
SELECT * from meeting_time_voter WHERE availabilityType = $1 LIMIT $2 offset $3
```

## SELECT with Filtering (Meeting Id)
Example:

```sql
SELECT * from meeting_time_voter WHERE meetingId = $1
```


## SELECT with Filtering (Meeting Id + AvailablilityType)
Example:

```sql
SELECT * from meeting_time_voter WHERE meetingId = $1 AND availabilityType = $2
```

## SELECT with Filtering (Participant Id)
Example:

```sql
SELECT * from meeting_time_voter WHERE participantId = $1
```

## SELECT with Filtering (Participant Id + AvailabilityType)
Example:

```sql
SELECT * from meeting_time_voter WHERE participantId = $1 AND availabilityType = $2
```

## SELECT with Filtering (Meeting Id & ParticipantId)
Example:

```sql
SELECT * from meeting_time_voter WHERE meetingId = $1 AND participantId = $2
```

## SELECT with Pagination
Example:

```sql
SELECT * from meeting_time_voter LIMIT $1 offset $2
```

## SELECT with Filtering & Pagination
Example:

```sql
SELECT * from meeting_time_voter WHERE meetingId = $1 AND participantId = $2 LIMIT $3 offset $4
```

## SELECT with Filtering & Pagination & AvailabilityType
Example:

```sql
SELECT * from meeting_time_voter WHERE meetingId = $1 AND availabilityType = $2 AND participantId = $3 LIMIT $4 offset $5
```


## INSERT
Example:

```sql
INSERT INTO meeting_time_voter (meetingId, timeId, participantId, startTime, endTime, availabilityType) VALUES ($1, $2, $3, $4, $5, $6)
```