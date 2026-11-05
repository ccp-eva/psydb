'use strict';
var datefns = require('date-fns');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchExperimentRecords = async (bag) => {
    var {
        db,
        start, end, showPast,
        allowedExperimentTypes,
        studyIds,
        locationId,
        experimentOperatorTeamIds,
        subjectRecordType,
    } = bag;

    var now = new Date();
    var experimentRecords = await (
        db.collection('experiment').aggregate([
            MatchIntervalOverlapStage({ start, end }),
            { $match: {
                type: { $in: allowedExperimentTypes },
                'state.studyId': { $in: studyIds },
                'state.isCanceled': false,

                ...(locationId && {
                    'state.locationId': locationId
                }),
                ...(experimentOperatorTeamIds && {
                    'state.experimentOperatorTeamId': { $in: (
                        experimentOperatorTeamIds
                )}
                }),
                // NOTE: experiments without subjects are placeholders
                // which we keep since their study has a setting
                // for the subject type
                ...(subjectRecordType && {
                    $or: [
                        { 'state.subjectData.subjectType': subjectRecordType },
                        { 'state.subjectData': { $size: 0 }},
                    ]
                }),
                ...(!showPast && {
                    'state.interval.start': { $gte: (
                        datefns.startOfDay(now)
                    )}
                })
            }},
            StripEventsStage(),
            { $sort: { 'state.interval.start': 1 }}
        ]).toArray()
    );

    return experimentRecords;
}

module.exports = fetchExperimentRecords;
