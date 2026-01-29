'use strict';
var { hasNone } = require('@mpieva/psydb-core-utils');
var {
    MatchIntervalAroundStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var fetchStudyRecords = async (bag) => {
    var { db, allowedResearchGroupIds, studyId, start, end } = bag;

    var studyRecords = []
    if (studyId) {
        studyRecords = await (
            db.collection('study').aggregate([
                { $match: {
                    _id: studyId,
                    'state.researchGroupIds': { $in: (
                        allowedResearchGroupIds
                    )}
                }},
                { $sort: {
                    'state.shorthand': 1
                }}
            ], {
                collation: { locale: 'de@collation=phonebook' }
            })
            .toArray()
        );
    }
    else {
        studyRecords = await (
            db.collection('study').aggregate([
                MatchIntervalAroundStage({
                    recordIntervalPath: 'state.runningPeriod',
                    recordIntervalEndCanBeNull: true,
                    start,
                    end,
                }),
                { $match: {
                    'state.researchGroupIds': { $in: (
                        allowedResearchGroupIds
                    )}
                }},
            ]).toArray()
        );
    }

    return studyRecords;
}

module.exports = fetchStudyRecords;
