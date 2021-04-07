'use strict';

var convertConstraintsToMongoPath = require('@mpieva/psydb-api-lib/src/convert-constraints-to-mongo-path');

var fetchAvailableFieldRecords = async ({
    db,
    collection,
    recordType,
    constraints
}) => {
    constraints = convertConstraintsToMongoPath(constraints);

    var records = await (
        db.collection(collection).aggregate([
            { $match: {
                ...(recordType && { type: recordType }),
                ...constraints
            }},
            { $project: {
                events: false
            }},
        ]).toArray()
    );

    return records;
}

module.exports = fetchAvailableFieldRecords;
