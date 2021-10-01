'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    createId = require('@mpieva/psydb-api-lib/src/create-id'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var dispatchCreateEvents = async ({
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
    subjectData,
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

    var subjectIds = subjectData.map(it => it.subjectId);

    var subjectRecords = await (
        db.collection('subject').find({
            _id: { $in: subjectIds },
        }, { projection: { type: true }}).toArray()
    );

    var subjectRecordsById = keyBy({
        items: subjectRecords,
        byProp: '_id'
    });

    var pusher = PushMaker({ personnelId });
    
    var SubjectDataItem = ({ subjectId, comment, autoConfirm }) => ({
        subjectId,
        subjectType: subjectRecordsById[subjectId],
        invitationStatus: autoConfirm ? 'confirmed': 'scheduled',
        participationStatus: 'unknown',
        comment: comment || '',
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
            '/state/subjectData': subjectData.map(
                it => SubjectDataItem(it)
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
        for (var it of subjectData) {
            var { subjectId, comment, autoConfirm } = it;

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
                            status: autoConfirm ? 'confrmed' : 'scheduled',
                        }]
                    })
                ],
            })
        }
    }
}

module.exports = dispatchCreateEvents;
