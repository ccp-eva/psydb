'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'location/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.hasCollectionFlag('location', 'remove')) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('location')
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

    var experiments = await (
        db.collection('experiment').find(
            { 
                'state.locationId': id,
                'state.isCanceled': { $ne: true },
                $or: [
                    { 'state.isPostprocessed': { $ne: true }},
                    {
                        'state.isPostprocessed': true,
                        'state.subjectData.participationStatus': (
                            'participated'
                        ),
                    }
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
            apiStatus: 'LocationHasExperiments',
            data: { experiments }
        });
    }

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id,
        refTargetCollection: 'location',
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
        collection: 'location',
        channelId: id,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
