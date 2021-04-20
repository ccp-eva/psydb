'use strict';
var { 
    MatchIntervalOverlapStage,
    StripEventsStage,
} = require('./fetch-record-helpers');

var fetchRecordsInInterval = async ({
    db,
    collection,
    start,
    end,
    additionalStages,
}) => {
    additionalStages = additionalStages || [];

    var records = await db.collection(collection).aggregate([
        MatchIntervalOverlapStage({ start, end }),
        StripEventsStage(),
        ...additionalStages,
    ]).toArray();

    return records;
}

module.exports = fetchRecordsInInterval;
