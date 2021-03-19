'use strict';
var ApiError = require('../../lib/api-error');

var checkStudyExists = async ({
    db,
    studyId
}) => {
    // TODO: what about if the study is hidden?
    var existing = await (
        db.collection('study')
        .findOne(
            { _id: studyId },
            { _id: true }
        )
    );
    if (!existing) {
        throw new ApiError(400, 'InvalidStudy');
    }
}

var checkExperimentOperatorTeamExists = async ({
    db,
    experimentOperatorTeamId
}) => {
    // TODO: what about if the study is hidden?
    var existing = await (
        db.collection('experimentOperatorTeam')
        .findOne(
            { _id: experimentOperatorTeamId },
            { _id: true }
        )
    );
    if (!existing) {
        throw new ApiError(400, 'InvalidExperimentOperatorTeam');
    }
}

var checkLocationExists = async ({
    db,
    locationId
}) => {
    // TODO: what about if the study is hidden?
    var existing = await (
        db.collection('location')
        .findOne(
            { _id: locationId },
            { _id: true }
        )
    );
    if (!existing) {
        throw new ApiError(400, 'InvalidLocation');
    }
}

var checkConflictingTeamReservations = async ({
    db,
    experimentOperatorTeamId,
    interval
}) => {
    var conflicting = await (
        db.collection('reservation')
        .find({
            'state.experimentOperatorTeamId': experimentOperatorTeamId,
            'state.interval.start': { $lte: interval.end },
            'state.interval.end': { $gt: interval.start }
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
            'state.interval.start': { $lte: interval.end },
            'state.interval.end': { $gt: interval.start }
        })
        .toArray()
    );

    if (conflicting.length > 0) {
        throw new ApiError(
            400, 'DuplicateLocationReservation'
        );
    }
}

module.exports = {
    checkStudyExists,
    checkExperimentOperatorTeamExists,
    checkLocationExists,
    checkConflictingTeamReservations,
    checkConflictingLocationReservations,
};
