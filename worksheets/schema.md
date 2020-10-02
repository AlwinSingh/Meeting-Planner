# Schema

This document will gives user a good idea of how your database's structure looks like.

You may refer to the following link to learn more about postgresql schema:

1. [CREATE statements](https://www.postgresqltutorial.com/postgresql-create-table/)
2. [Foreign Keys](https://www.postgresqltutorial.com/postgresql-foreign-key/)

The following are examples of how you can create a table, replace the examples with your own create statements of all your table.

```sql
    CREATE TABLE meeting_time_voter (
        id  SERIAL PRIMARY KEY,
        meetingId BIGINT not null,
        timeId BIGINT not null,
        participantId BIGINT not null,
        startTime TIME not null,
        endTime TIME not null,
        availabilityType BIT not null,
        Unique(timeId, availabilityType)
    );
```


```sql
    CREATE TABLE meeting_time_voter_test_db (
        id  SERIAL PRIMARY KEY,
        meetingId BIGINT not null,
        timeId BIGINT not null,
        participantId BIGINT not null,
        startTime TIME not null,
        endTime TIME not null,
        availabilityType BIT not null,
        Unique(timeId, availabilityType)
    );
```