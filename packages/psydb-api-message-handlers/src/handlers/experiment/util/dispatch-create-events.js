'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { keyBy } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    createId,
    compareIds,
    mongoEscapeDeep,
} = require('@mpieva/psydb-api-lib');

var PutMaker = require('../../../lib/put-maker'),
    PushMaker = require('../../../lib/push-maker');

var dispatchCreateEvents = async ({
    db,
    rohrpost,
    personnelId,
    dispatch,
    dispatchProps,

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
    comment,
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

    //var pusher = PushMaker({ personnelId });
   
    var SubjectDataItem = ({ subjectId, comment, autoConfirm }) => ({
        subjectId,
        subjectType: subjectRecordsById[subjectId].type,
        invitationStatus: autoConfirm ? 'confirmed': 'scheduled',
        participationStatus: 'unknown',
        comment: comment || '',
    });

    var experimentProps = {
        seriesId,
        studyId,
        experimentOperatorTeamId,
        locationId,
        locationRecordType,
        interval,
        ...(type === 'away-team' && {
            comment
        }),
        selectedSubjectIds: subjectIds,
        subjectData: subjectData.map(SubjectDataItem),
    };

    var experimentId = forcedExperimentId || await createId('experiment');

    await dispatchProps({
        collection: 'experiment',
        isNew: true,
        channelId: experimentId,
        additionalChannelProps: {
            type,
        },
        props: experimentProps,

        initialize: true,
        recordType: type,
    });

    //var subjectDataMessages = [
    //    // XXX: keep this around in case we are actually using
    //    /*...subjectGroups.reduce((acc, group) => ([
    //        ...acc,
    //        ...pusher.all({
    //            '/state/subjectData': group.state.subjectIds.map(
    //                id => SubjectDataItem(id)
    //            )
    //        })
    //    ]), []),*/
    //    
    //    ...pusher.all({
    //        '/state/subjectData': subjectData.map(
    //            it => SubjectDataItem(it)
    //        )
    //    })
    //];

    //var experimentId = forcedExperimentId || await createId('experiment');

    //var experimentChannel = (
    //    rohrpost
    //    .openCollection('experiment')
    //    .openChannel({
    //        id: experimentId,
    //        isNew: true,
    //        additionalChannelProps: {
    //            type,
    //        }
    //    })
    //);

    //var channelMessages = [
    //    ...PutMaker({ personnelId }).all({
    //        '/state/seriesId': seriesId,
    //        '/state/studyId': studyId,
    //        '/state/experimentOperatorTeamId': experimentOperatorTeamId,
    //        '/state/locationId': locationId,
    //        '/state/locationRecordType': locationRecordType,
    //        '/state/interval/start': interval.start,
    //        '/state/interval/end': interval.end,
    //        ...(type === 'away-team' && {
    //            '/state/comment': comment
    //        })
    //    }),

    //    ...pusher.all({
    //        //'/state/selectedSubjectGroupIds': subjectGroupIds,
    //        // TODO: this needs to store invitation status as well
    //        // as perticipationstatus
    //        '/state/selectedSubjectIds': subjectIds,
    //    }),

    //    ...subjectDataMessages,

    //];

    //await experimentChannel.dispatchMany({ messages: channelMessages });
    
    var now = new Date();
    if (type === 'inhouse') {
        var autoConfirm = subjectData[0].autoConfirm; // FIXME

        var update = { $push: {
            'scientific.state.internals.invitedForExperiments': {
                type: 'inhouse',
                studyId,
                experimentId,
                timestamp: now,
                status: autoConfirm ? 'confrmed' : 'scheduled',
            }
        }};

        await rohrpost._experimental_dispatchMultiplexed({
            collection: 'subject',
            channelIds: subjectIds,
            subChannelKey: 'scientific',
            messages: [ { personnelId, payload: mongoEscapeDeep(update) }],
            mongoExtraUpdate: {
                ...update,
                $set: {
                    'scientific._rohrpostMetadata.unprocessedEventIds': []
                }
            }
        });
    }

    /*var subjectRecords = await (
        db.collection('subject').find({
            _id: { $in: subjectIds },
        }).toArray()
    );
    console.dir(subjectRecords, { depth: null })
    throw new Error();*/

    /*if (type === 'inhouse') {
        // TODO: the last known ids should be in payload
        for (var it of subjectData) {
            var { subjectId, comment, autoConfirm } = it;

            var subjectChannel = (
                rohrpost
                .openCollection('subject')
                .openChannel({ id: subjectId })
            );

            await subjectChannel.dispatchMany({
                subChannelKey: 'scientific',
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
    }*/
}

module.exports = dispatchCreateEvents;
