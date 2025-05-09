'use strict';
var intervalUtils = require('@mpieva/psydb-common-lib/src/interval-utils');
var { 
    MatchIntervalAroundStage,
} = require('./fetch-record-helpers');

var checkIntervalHasReservation = async ({
    db,
    interval,
    locationId,
    experimentOperatorTeamId
}) => {
    //console.log({
    //    interval,
    //    locationId,
    //    experimentOperatorTeamId
    //});

    var reservations = await (
        db.collection('reservation').aggregate([
            MatchIntervalAroundStage(interval),
            { $match: {
                'state.experimentOperatorTeamId': experimentOperatorTeamId,
                ...(
                    locationId
                    ? { 
                        'type': 'inhouse',
                        'state.locationId': locationId
                    }
                    : {
                        'type': 'awayTeam'
                    }
                )
            }},
            { $project: { events: false }},
        ]).toArray()
    );

    var merged = intervalUtils.merge({
        intervals: reservations.map(it => ({
            start: it.state.interval.start.getTime(),
            end: it.state.interval.end.getTime() + 1, // NOTE: close for merge
        }))
    });

    //console.log(merged);

    var intersections = intervalUtils.intersect({
        setA: merged,
        setB: [{
            start: interval.start.getTime(),
            end: interval.end.getTime()
        }]
    });

    //console.log(intersections);

    if (intersections.length !== 1) {
        return false
    }

    if (
        intersections[0].start !== interval.start.getTime()
        || intersections[0].end !== interval.end.getTime()
    ) {
        return false
    }

    return true;
}

module.exports = checkIntervalHasReservation;
