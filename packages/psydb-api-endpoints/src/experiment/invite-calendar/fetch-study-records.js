'use strict';
var { includes, compareIds } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { MatchIntervalAroundStage }
    = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var fetchStudyRecords = async (bag) => {
    var {
        db, interval, researchGroupIds, labMethods,
        studyId = undefined,
    } = bag;

    var studies = await aggregateToArray({ db, study: [
        { $match: {
            ...(studyId && { '_id': studyId }),

            'state.internals.isRemoved': { $ne: true },
            'state.researchGroupIds': { $in: researchGroupIds }
        }},
        MatchIntervalAroundStage({
            ...interval,
            recordIntervalPath: 'state.runningPeriod',
            recordIntervalEndCanBeNull: true,
        }),
    ]});

    var settings = await aggregateToArray({
        db, experimentVariantSetting: [
            { $match: {
                'studyId': { $in: studies.map(it => it._id) },
                'type': { $in: labMethods },
            }},
            { $project: { 'studyId': true }}
        ]
    });

    var filteredStudies = [];
    var checkStudyIdHasSettings = includes.lambda({
        haystack: settings.map(it => it.studyId),
        compare: compareIds,
    });
    for (var it of studies) {
        if (checkStudyIdHasSettings({ needle: it._id })) {
            filteredStudies.push(it)
        }
    }

    return filteredStudies;
}

module.exports = fetchStudyRecords;
