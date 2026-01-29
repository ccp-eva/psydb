'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { MatchIntervalAroundStage }
    = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var fetchStudyRecords = async (bag) => {
    var { db, allowedResearchGroupIds, studyId, start, end } = bag;

    var studyRecords = [];
    if (studyId) {
        studyRecords = await aggregateToArray({ db, study: [
            { $match: {
                '_id': studyId,
                'state.internals.isRemoved': { $ne: true },
                'state.researchGroupIds': { $in: allowedResearchGroupIds }
            }},
        ]});
    }
    else {
        studyRecords = await aggregateToArray({ db, study: [
            { $match: {
                'state.internals.isRemoved': { $ne: true },
                'state.researchGroupIds': { $in: allowedResearchGroupIds }
            }},
            MatchIntervalAroundStage({
                recordIntervalPath: 'state.runningPeriod',
                recordIntervalEndCanBeNull: true,
                start,
                end,
            })
        ]});
    }

    return studyRecords;
}

module.exports = fetchStudyRecords;
