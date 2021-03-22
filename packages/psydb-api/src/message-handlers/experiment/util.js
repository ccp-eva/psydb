'use strict';
var ApiError = require('../../lib/api-error'),
    compareIds = require('../../lib/compare-ids');

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
            { _id: { $in: subjectIds }},
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

var checkAllSubjectGroupsExist = async ({
    db,
    subjectGroupIds
}) => {
    var existing = await (
        db.collection('subjectGroup')
        .find(
            { _id: { $in: subjectGroupIds }},
            { _id: true }
        )
        .toArray()
    );

    var existingIds = existing.map(it => it._id),
        missingIds = [];
    
    for (var wantedId of subjectGroupIds) {
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
        throw new ApiError(400, 'InvalidSubjectGroupIds')
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
            }},
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

var dispatchAllChannelMessages = async ({
    db,
    rohrpost,
    personnelId,

    forcedExperimentId,
    seriesId,
    reservationId,
    studyId,
    experimentOperatorTeamId,
    locationId,
    subjectGroupIds,
    subjectIds,
    interval,

    lastKnownReservationEventId,
}) => {

    var subjectGroups = await (
        db.collection('subjectGroups')
        .aggregate([
            { $match: {
                _id: { $in: subjectGroupIds }
            }},
            // FIXME: we might need to unwind this and check for
            // active group members
            { $project: {
                'state.subjectIds': true 
            }}
        ])
        .toArray()
    );

    var subjectDataMessages = [];
    for (var group of subjectGroups) {
        subjectDataMessages = [
            ...subjectDataMessages,
            ...group.state.subjectIds.map(id => ({
                type: 'push',
                personnelId,
                payload: {
                    prop: '/state/subjectData',
                    value: {
                        subjectId: id,
                        perticipationStatus: 'unknown',
                    }
                }
            }))
        ];
    }

    subjectDataMessages = [
        ...subjectDataMessages,
        ...subjectIds.map(id => ({
            type: 'push',
            personnelId,
            payload: {
                prop: '/state/subjectData',
                value: {
                    subjectId: id,
                    perticipationStatus: 'unknown',
                }
            }
        }))
    ];

    // TODO: decide if we want to store experimentId in
    // reservation
    //var experimentId = await createId('experiment');
    var reservationChannel = (
        rohrpost
        .openCollection('reservation')
        .openChannel({
            id: reservationId
        })
    );

    await reservationChannel.dispatchMany({
        lastKnownEventId: lastKnownReservationEventId,
        messages: [
            {
                type: 'put',
                personnelId,
                payload: {
                    prop: '/state/hasExperiment',
                    value: true
                }
            }
        ]
    })

    var experimentChannel = (
        rohrpost
        .openCollection('experiment')
        .openChannel({
            id: forcedExperimentId,
            isNew: true,
            additionalChannelProps: {
                //reservationId: reservation._id
            }
        })
    );

    var channelMessages = [
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/seriesId',
                value: seriesId,
            }
        },
        // FIXME: not sure about this deleted thing
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/reservationId',
                value: reservationId
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/studyId',
                value: studyId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/experimentOperatorTeamId',
                value: experimentOperatorTeamId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/locationId',
                value: locationId,
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/interval/start',
                value: interval.start
            }
        },
        {
            type: 'put',
            personnelId,
            payload: {
                prop: '/state/interval/end',
                value: interval.end
            }
        },

        ...subjectGroupIds.map(id => ({
            type: 'push',
            personnelid,
            payload: {
                prop: '/state/selectedSubjectGroupIds',
                value: id,
            }
        })),

        ...subjectIds.map(id => ({
            type: 'push',
            personnelId,
            payload: {
                prop: '/state/selectedSubjectIds',
                value: id,
            }
        })),

        ...subjectDataMessages,

    ];

    await experimentChannel.dispatchMany({ messages: channelMessages });
}
module.exports = {
    checkLocationExists,
    checkAllSubjectsExist,
    checkAllSubjectGroupsExist,
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,

    dispatchAllChannelMessages,
};
