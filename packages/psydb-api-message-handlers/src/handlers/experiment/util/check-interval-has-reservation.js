'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var intervalUtils = require('@mpieva/psydb-common-lib/src/interval-utils');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

// FIXME: since we disconnected experiments from reservation kinda
// we need to check if there are conflicting experiment in add addition
// to this i think
var checkIntervalHasReservation = async ({
    db,
    interval,
    locationId,
    experimentOperatorTeamId
}) => {
    /*console.log({
        interval,
        locationId,
        experimentOperatorTeamId
    });*/

    var reservations = await (
        db.collection('reservation').aggregate([
            { $match: {
                $or: [
                    // our interval is completely contained
                    { $and: [
                        { 'state.interval.start': { $lte: interval.start }},
                        { 'state.interval.end': { $gte: interval.end }},
                    ]},
                    // overlaps on the start
                    { $and: [
                        { 'state.interval.start': { $lte: interval.start }},
                        { 'state.interval.end': { $gte: interval.start }},
                    ]},
                    // overlaps on the end
                    { $and: [
                        { 'state.interval.start': { $lte: interval.end }},
                        { 'state.interval.end': { $gte: interval.end }},
                    ]},
                ],
                'state.experimentOperatorTeamId': experimentOperatorTeamId,
                ...(
                    locationId
                    ? { 
                        'type': 'inhouse',
                        'state.locationId': locationId }
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
        throw new ApiError(400, 'ReservationConflict');
    }

    if (
        intersections[0].start !== interval.start.getTime()
        || intersections[0].end !== interval.end.getTime()
    ) {
        throw new ApiError(400, 'ReservationConflict');
    }
}

module.exports = checkIntervalHasReservation;
