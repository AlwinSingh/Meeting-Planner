const {Client} = require('pg');
const CONNECTION_STRING = 'postgres://tlxrtuzr:5aX_a9BX80fKBM6pZKiwJADJm7P3Ovyj@john.db.elephantsql.com:5432/tlxrtuzr';

//Establishes a connection
function connect() {
    const client = new Client({
        connectionString: CONNECTION_STRING
    });
    client.connect();
    return client;
}

function resetTable(callback) {
    //Connects to the established connection with DB
    const client = connect();
    const query =
        `DROP TABLE IF EXISTS meeting_time_voter;
        CREATE TABLE meeting_time_voter (
        id  SERIAL PRIMARY KEY,
        meetingId BIGINT not null,
        timeId BIGINT not null,
        participantId BIGINT not null,
        startTime TIME not null,
        endTime TIME not null,
        availabilityType BIT not null,
        Unique(timeId, availabilityType)
    )`;

    client.query(query, (err, res) => {
        callback(err, res);
        console.log(err, res);
        client.end();
    });
}

function insertAvailability(data, callback) {

    let i = 1;
    //Combines the data together via ','
    const dataTemplate = data.map(dataSet => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    //Reduces / 'Flattens' the values and pushes into 'reducedData' to be consumed by the query
    const reducedDataValues = data.reduce((reducedData, e) => {
        reducedData.push(e.meetingId, e.timeId, e.participantId, e.startTime, e.endTime, e.availabilitytype);
        return reducedData;
    }, []);
    //Query takes in the reducedData array
    const query = `INSERT INTO meeting_time_voter (meetingId, timeId, participantId, startTime, endTime, availabilityType) VALUES ${dataTemplate}`;

    const client = connect();
    client.query(query, reducedDataValues, (err, result) => {
        callback(err, result);
        console.log(query);
        client.end();
    });
}


function getData(meetingId, participantId, availabilityType, page, pageSize, callback) {
    let whereClause;
    var values = [];
    let i = 1;

    //Checks which SQL query to run by using String concatenation
    if (!meetingId && !participantId) {
        whereClause = '';
        if (availabilityType) {
            whereClause += ` WHERE availabilityType =$${i++}`
            values.push(availabilityType);
        }
    } else {
        whereClause = 'WHERE ';

        if (availabilityType && !isNaN(availabilityType) && (availabilityType == 0 || availabilityType == 1)) {
            whereClause += `availabilityType =$${i++}`
            values.push(availabilityType);
        }

        if (meetingId) {
            whereClause += (availabilityType) ? ` AND meetingId = $${i++}`: `meetingId = $${i++}`
            values.push(meetingId);
        }

        if (participantId) {
            whereClause += (meetingId || participantId) ? ` AND participantId = $${i++}`: `participantId = $${i++}`
            values.push(participantId);
        }
    }

    let limitOffsetClause = '';

    //Checks for pageSize to provide the limitOffsetClause
    if (pageSize != null) {
        limitOffsetClause = `LIMIT $${i++} offset $${i++}`;
        values.push(pageSize);
        values.push(page * pageSize);
    }

    //Runs the query with the concatenated String values, if any
    const query = `SELECT *  from meeting_time_voter ${whereClause} ${limitOffsetClause}`;

    console.log(query, values);

    const client = connect();
    client.query(query, values, (err, {rows}) => {
        
        callback(err, rows); 

        client.end();
    });
}


function getUsersForComputation(meetingId, availabilityType, callback) {
    const client = connect();
    //client.query(`SELECT * FROM meeting_time_voter WHERE meetingid = $1 LIMIT $2 offset $3`, [meetingId, pageSize, (page * pageSize)], (err, result) => { 
    client.query(`SELECT * FROM meeting_time_voter WHERE meetingid = $1 AND availabilityType = $2`, [meetingId, availabilityType], (err, result) => { 
    client.end();
    if (err) return callback(err, result);
    const { rows } = result;
    callback(err, rows);
    });    
}

//The modules are exported to allow use in other files such as app.js
module.exports = {
    resetTable,
    insertAvailability,
    getData,
    getUsersForComputation
}