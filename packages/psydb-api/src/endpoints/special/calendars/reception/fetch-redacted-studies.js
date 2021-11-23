'use strict';

var {
    MatchAlwaysStage,
    MatchIntervalAroundStage,
    StripEventsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchRedactedStudies = async (context, options) => {
    var { db, permissions } = context;
    var { hasRootAccess, projectedResearchGroupIds } = permissions;
    var { interval } = options;

    var records = await (
        db.collection('study').aggregate([
            MatchIntervalAroundStage({
                ...interval,
                recordIntervalPath: 'state.runningPeriod',
                recordIntervalEndCanBeNull: true
            }),

            { $project: {
                _id: true,
                'state.researchGroupIds': true,
            }},
            StripEventsStage(),
        ]).toArray()
    );

    // NOTE: cant fetch related here since
    // they might be of different types

    return records;
}

module.exports = fetchRedactedStudies;
