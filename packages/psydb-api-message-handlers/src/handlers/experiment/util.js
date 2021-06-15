'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var intervalUtils = require('@mpieva/psydb-common-lib/src/interval-utils');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    createId = require('@mpieva/psydb-api-lib/src/create-id'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var {
    StripEventsStage
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');



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

// FIXME: since we disconnected experiments from reservation kinda
// we need to check if there are conflicting experiment in add addition
// to this i think
var checkIntervalHasReservation = async ({
    db,
    interval,
    locationId,
    experimentOperatorTeamId
}) => {
    console.log({
        interval,
        locationId,
        experimentOperatorTeamId
    });

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
                'state.locationId': locationId,
            }}
        ]).toArray()
    );

    console.log(reservations);

    var merged = intervalUtils.merge({
        intervals: reservations.map(it => ({
            start: it.state.interval.start.getTime(),
            end: it.state.interval.end.getTime() + 1, // NOTE: close for merge
        }))
    });

    console.log(merged);

    var intersections = intervalUtils.intersect({
        setA: merged,
        setB: [{
            start: interval.start.getTime(),
            end: interval.end.getTime()
        }]
    });

    console.log(intersections);

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
                'state.interval.end': { $gt: interval.start },
                'state.isCanceled': false,
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
    locationRecordType,
    //subjectGroupIds,
    subjectIds,
    interval,

    lastKnownReservationEventId,
}) => {

    // subjectGroups
    // XXX: keep this around in case we are actually using
    /*var subjectGroups = await (
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
    );*/

    var subjectRecords = await (
        db.collection('subject').find({
            _id: { $in: subjectIds },
        }, { projection: { type: true }}).toArray()
    );

    var pusher = PushMaker({ personnelId });
    
    var SubjectDataItem = (id, type) => ({
        subjectType: type,
        subjectId: id,
        invitationStatus: 'scheduled',
        participationStatus: 'unknown',
        comment: '',
    });

    var subjectDataMessages = [
        // XXX: keep this around in case we are actually using
        /*...subjectGroups.reduce((acc, group) => ([
            ...acc,
            ...pusher.all({
                '/state/subjectData': group.state.subjectIds.map(
                    id => SubjectDataItem(id)
                )
            })
        ]), []),*/
        
        ...pusher.all({
            '/state/subjectData': subjectRecords.map(
                it => SubjectDataItem(it._id, it.type)
            )
        })
    ];

    // TODO: decide if we want to store experimentId in
    // reservation
    //var experimentId = await createId('experiment');
    /*var reservationChannel = (
        rohrpost
        .openCollection('reservation')
        .openChannel({
            id: reservationId
        })
    );*/

    /*await reservationChannel.dispatchMany({
        lastKnownEventId: lastKnownReservationEventId,
        messages: PutMaker({ personnelId }).all({
            '/state/hasExperiment': true
        })
    });*/

    var experimentId = forcedExperimentId || await createId('experiment');

    var experimentChannel = (
        rohrpost
        .openCollection('experiment')
        .openChannel({
            id: experimentId,
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
            //'/state/reservationId': reservationId,
            '/state/studyId': studyId,
            '/state/experimentOperatorTeamId': experimentOperatorTeamId,
            '/state/locationId': locationId,
            '/state/locationRecordType': locationRecordType,
            '/state/interval/start': interval.start,
            '/state/interval/end': interval.end,
        }),

        ...pusher.all({
            //'/state/selectedSubjectGroupIds': subjectGroupIds,
            // TODO: this needs to store invitation status as well
            // as perticipationstatus
            '/state/selectedSubjectIds': subjectIds,
        }),

        ...subjectDataMessages,

    ];

    await experimentChannel.dispatchMany({ messages: channelMessages });
    
    var now = new Date();
    if (type === 'inhouse') {
        // TODO: the last known ids should be in payload
        for (var subjectId of subjectIds) {
            var subjectRecord = await (
                db.collection('subject').findOne({
                    _id: subjectId,
                })
            );

            var lastKnownEventId = subjectRecord.scientific.events[0]._id;

            var subjectChannel = (
                rohrpost
                .openCollection('subject')
                .openChannel({ id: subjectId })
            );

            await subjectChannel.dispatchMany({
                subChannelKey: 'scientific',
                lastKnownEventId,
                messages: [
                    ...pusher.all({
                        '/state/internals/invitedForExperiments': [{
                            type: 'inhouse',
                            studyId,
                            experimentId,
                            timestamp: now,
                            status: 'scheduled',
                        }]
                    })
                ],
            })
        }
    }
}
module.exports = {
    checkIntervalHasReservation,
    checkConflictingLocationReservations,
    checkConflictingSubjectExperiments,

    dispatchAllChannelMessages,
};
