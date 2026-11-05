'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'subject/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.hasCollectionFlag('subject', 'remove')) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('subject')
        .findOne(
            { _id: id },
            { projection: {
                'scientific.events': false,
                'gdpr.events': false
            }}
        )
    );
    if (!record) {
        throw new ApiError(404);
    }

    var { scientific: { state }} = record;
    var { internals: {
        invitedForExperiments,
        participatedInStudies
    }} = state;

    console.log({
        invitedForExperiments,
        participatedInStudies
    });

    if (invitedForExperiments.length > 0) {
        var now = new Date();
        var experiments = await (
            db.collection('experiment').find(
                { 
                    _id: { $in: invitedForExperiments.map(it => (
                        it.experimentId
                    ))},
                    'state.isCanceled': false,
                    $or: [
                        { 'state.selectedSubjectIds': id },
                        { 'state.subjectData.subjectId': id },
                    ]
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
                apiStatus: 'SubjectHasExperimentInvitations',
                data: { experiments }
            });
        }
    }

    if (participatedInStudies.length > 0) {
        var participated = participatedInStudies.filter(it => (
            it.status === 'participated'
        ));
        if (participated.length > 0) {
            throw new ApiError(409, {
                apiStatus: 'SubjectHasStudyParticipation',
                data: { participatedInStudies: participated }
            });
        }
    }
    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id,
        refTargetCollection: 'subject',
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
        collection: 'subject',
        channelId: id,
        subChannelKey: 'scientific',
        payload: { $set: {
            'scientific.state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
