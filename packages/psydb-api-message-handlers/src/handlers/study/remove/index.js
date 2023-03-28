'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'study/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.hasCollectionFlag('study', 'remove')) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('study')
        .findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404);
    }

    var experiments = await (
        db.collection('experiment').find(
            { 
                'state.studyId': id,
                'state.isCanceled': false,
            },
            { projection: {
                _id: true,
                type: true,
                'state.interval': true,
            }}
        ).toArray()
    );

    if (experiments.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'StudyHasExperiments',
            data: { experiments }
        });
    }

    var participatedSubjects = await (
        db.collection('subject').aggregate([
            { $unwind: '$scientific.state.internals.participatedInStudies' },
            { $match: {
                'scientific.state.internals.participatedInStudies.studyId': id,
                'scientific.state.internals.participatedInStudies.status': 'participated',
            }},
            { $project: {
                _id: true,
                type: true,
            }}
        ]).toArray()
    );

    if (participatedSubjects.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'StudyHasParticipation',
            data: { participatedSubjects }
        });
    }
    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id,
        refTargetCollection: 'study',
        excludedCollections: [ 'experiment' ], // done manually
    });

    if (reverseRefs.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'RecordHasReverseRefs',
            data: { reverseRefs }
        });
    }


}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    cache,
    dispatch
}) => {
    var { id } = message.payload;

    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
