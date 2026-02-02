'use strict';
var datefns = require('date-fns');
var { groupBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var {
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var fetchLabTeamRecords = async (bag) => {
    var { db, studyIds, labTeamIds, labMethods } = bag;

    var labTeams = await aggregateToArray({ db, experimentOperatorTeam : [
        { $match: {
            'studyId': { $in: studyIds },
            $or: [
                { 'state.hidden': { $ne: true }},
                { '_id': labTeamIds }
            ]
        }},
        StripEventsStage(),
    ]});

    // NOTE: dont do that right now
    //var _upcomingLabTeamExperimentCounts = await (
    //    fetchUpcomingLabTeamExperimentCounts({
    //        db, labMethods, labTeamIds: labTeams.map(it => it._id),
    //    })
    //);

    //for (var it of labTeams) {
    //    it._upcomingExperimentCount = (
    //        _upcomingLabTeamExperimentCounts[it._id]
    //    );
    //}

    return labTeams;
}

var fetchUpcomingLabTeamExperimentCounts = async (bag) => {
    var { db, labMethods, labTeamIds } = bag;
    var now = new Date();
    var start = datefns.startOfDay(now);

    var upcoming = await aggregateToArray({ db, experiment: [
        { $match: {
            'state.experimentOperatorTeamId': { $in: labTeamIds },
            'type': { $in: labMethods },
            'state.isCanceled': false,
            'state.interval.start': { $gte: start }
        }},
        { $project: {
            '_id': true,
            'state.experimentOperatorTeamId': true
        }}
    ]});

    var upcomingForLabTeamId = groupBy({
        items: upcoming,
        byPointer: '/state/experimentOperatorTeamId'
    });

    for (var key of Object.keys(upcomingForLabTeamId)) {
        upcomingForLabTeamId[key] = upcomingForLabTeamId[key].length
    }

    return upcomingForLabTeamId;
}

module.exports = fetchLabTeamRecords;
