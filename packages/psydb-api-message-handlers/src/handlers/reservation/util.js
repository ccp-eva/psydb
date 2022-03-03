'use strict';
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var checkConflictingTeamReservations = async ({
    db,
    experimentOperatorTeamId,
    interval,
    types,
}) => {
    var conflicting = await (
        db.collection('reservation')
        .find({
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            $or: [
                // our interval is completely contained
                { $and: [
                    { 'state.interval.start': { $lte: interval.start }},
                    { 'state.interval.end': { $gte: interval.end }},
                ]},
                // our interval is around
                { $and: [
                    { 'state.interval.start': { $gte: interval.start }},
                    { 'state.interval.end': { $lte: interval.end }},
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
            'type': { $in: types }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            400, 'DuplicateExperimentOperatorTeamReservation'
        );
    }
}

var checkConflictingLocationReservations = async ({
    db,
    locationId,
    interval
}) => {
    var conflicting = await (
        db.collection('reservation')
        .find({
            'state.locationId': locationId,
            $or: [
                // our interval is completely contained
                { $and: [
                    { 'state.interval.start': { $lte: interval.start }},
                    { 'state.interval.end': { $gte: interval.end }},
                ]},
                // our interval is around
                { $and: [
                    { 'state.interval.start': { $gte: interval.start }},
                    { 'state.interval.end': { $lte: interval.end }},
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
            ]
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            400, 'DuplicateLocationReservation'
        );
    }
}

// FIXME: redunant
var checkConflictingLocationExperiments = async ({
    db,
    locationId,
    interval
}) => {
    var conflicting = await (
        db.collection('experiment')
        .find({
            'state.locationId': locationId,
            // we are switching to half open intervals
            // i.e. ends are set on .000Z
            // therefor $lt is the way to go
            'state.interval.start': { $lt: interval.end },
            'state.interval.end': { $gt: interval.start }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            409, 'ConflictingLocationExperiment'
        );
    }
}

module.exports = {
    checkConflictingTeamReservations,
    checkConflictingLocationReservations,
    checkConflictingLocationExperiments,
};
