'use strict';

var {
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchStudies = async (context) => {
    var { db, permissions } = context;

    var studies = await (
        db.collection('study').aggregate([
            //...SystemPermissionStages({ permissions }),
            { $project: {
                _id: true,
                'state.researchGroupIds': true
            }},
            StripEventsStage(),
        ]).toArray()
    );

    return studies;
}

module.exports = fetchStudies;
