'use strict';

var {
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchRedactedStudies = async (context, options) => {
    var { db, permissions } = context;

    var records = await (
        db.collection('study').aggregate([
            //...SystemPermissionStages({ permissions }),
            { $project: {
                _id: true,
                'state.researchGroupIds': true,
                'state.scientistIds': true,
            }},
            StripEventsStage(),
        ]).toArray()
    );

    // NOTE: cant fetch related here since
    // they might be of different types

    return records;
}

module.exports = fetchRedactedStudies;
