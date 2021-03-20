'use strict';
var ApiError = require('../../lib/api-error');

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

var checkAllSubjectsExist = async ({
    db,
    subjectIds
}) => {
    var existing = await (
        db.collection('subject')
        .find(
            { _id: { $in: subjectIds }}
            { _id: true }
        )
        .toArray()
    );

    var existingIds = existing.map(it => it._id),
        missingIds = [];
    
    for (var wantedId of subjectIds) {
        var exists = false;
        for (var existingId of existingIds) {
            if (compareIds(wantedId, existingId)) {
                exists = true;
                break;
            }
        }
        if (exists === false) {
            missingIds.push(wantedId);
        }
    }

    if (missingIds.length > 0) {
        // TODO: missingIds needs to be passed to ResponseBody
        // TODO: we need to pass the index instead (?)
        // EDIT: with rsjf this is actually required i think maybe
        throw new ApiError(400, 'InvalidSubjectIds')
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

var checkConflictingSubjectExperiments = async ({
    db,
    subjectIds,
    interval
}) => {
    var conflicting = await (
        db.collection('experiment')
        .aggregate([
            { $match: {
                'state.interval.start': { $lte: interval.end },
                'state.interval.end': { $gt: interval.start }
            }},
            { $unwind: '$state.subjects' },
            { $match: {
                'state.subjects.subjectId': { $in: subjectIds },
            }}
            { $project: {
                subjectId: '$state.subjects.subjectId',
            }}
        ])
        .toArray()
    );

    if (conflicting.length > 0) {
        // TODO: subject ids => response body
        throw new ApiError(400, 'ConflictingExperiments');
    }
};

module.exports = {
    checkLocationExists,
    checkAllSubjectsExist,
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments
};
