'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var PutMaker = require('../../lib/put-maker'),
    PushMaker = require('../../lib/push-maker');

var checkConflictingLocationReservations = async ({
    db,
    locationId,
    interval
}) => {
    var conflicting = await (
        db.collection('reservation')
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
                // we are switching to half open intervals
                // i.e. ends are set on .000Z
                // therefor $lt is the way to go
                'state.interval.start': { $lt: interval.end },
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
    type,
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

    var pusher = PushMaker({ personnelId });
    
    var SubjectDataItem = (id) => ({
        subjectId: id,
        perticipationStatus: 'unknown',
    });

    var subjectDataMessages = [
        ...subjectGroups.reduce((acc, group) => ([
            ...acc,
            ...pusher.all({
                '/state/subjectData': group.state.subjectIds.map(
                    id => SubjectDataItem(id)
                )
            })
        ]), []),
        
        ...pusher.all({
            '/state/subjectData': subjectIds.map(
                id => SubjectDataItem(id)
            )
        })
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
        messages: PutMaker({ personnelId }).all({
            '/state/hasExperiment': true
        })
    });

    var experimentChannel = (
        rohrpost
        .openCollection('experiment')
        .openChannel({
            id: forcedExperimentId,
            isNew: true,
            additionalChannelProps: {
                type,
                //reservationId: reservation._id
            }
        })
    );

    var channelMessages = [
        ...PutMaker({ personnelId }).all({
            '/state/seriesId': seriesId,
            '/state/reservationId': reservationId,
            '/state/studyId': studyId,
            '/state/experimentOperatorTeamId': experimentOperatorTeamId,
            '/state/locationId': locationId,
            '/state/interval/start': interval.start,
            '/state/interval/end': interval.end,
        }),

        ...pusher.all({
            '/state/selectedSubjectGroupIds': subjectGroupIds,
            '/state/selectedSubjectIds': subjectIds,
        }),

        ...subjectDataMessages,

    ];

    await experimentChannel.dispatchMany({ messages: channelMessages });
}
module.exports = {
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,

    dispatchAllChannelMessages,
};
