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

}

module.exports = dispatchCreateEvents;
