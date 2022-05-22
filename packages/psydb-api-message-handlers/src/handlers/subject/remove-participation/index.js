'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'subject/remove-participation',
    createSchema,
});


handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        message,
        cache,
    } = context;

    if (!permissions.hasFlag('canWriteParticipation')) {
        throw new ApiError(403);
    }

    var { participationId } = message.payload;

    var path = 'scientific.state.internals.participatedInStudies';
    var participationDocs = await (
        db.collection('subject')
        .aggregate([
            { $unwind: '$' + path },
            { $match: {
                [path + '._id']:  participationId
            }},
            { $addFields: {
                [path + '.subjectId']: '$_id'
            }},
            { $replaceRoot: {
                newRoot: '$' + path
            }}
        ])
        .toArray()
    );
    if (participationDocs.length !== 1) {
        throw new ApiError(400, 'InvalidParticipationId');
    }

    cache.participation = participationDocs[0];
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        cache,
        dispatch
    } = context;

    var { participation } = cache;
    var { _id: participationId, subjectId, experimentId } = participation;

    if (experimentId) {
        var experiment = await (
            db.collection('experiment').findOne({ _id: experimentId })
        );
        if (experiment.state.subjectData.length <= 1) {
            await dispatch({
                collection: 'location',
                channelId: experiment.state.location,
                payload: { $pull: {
                    'state.internals.visits': { experimentId }
                }}
            })
        }
        await dispatch({
            collection: 'experiment',
            channelId: experimentId,
            payload: { $pull: {
                'state.selectedSubjectIds': { subjectId },
                'state.subjectData': { subjectId }
            }}
        });
    }

    await dispatch({
        collection: 'subject',
        channelId: subjectId,
        subChannelKey: 'scientific',
        payload: { $pull: {
            'scientific.state.internals.participatedInStudies': {
                _id: participationId
            }
        }}
    });

}

module.exports = handler;
