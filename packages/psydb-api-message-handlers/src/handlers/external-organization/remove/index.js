'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    fetchRecordReverseRefs,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'externalOrganization/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var { id } = message.payload;

    var record = await (
        db.collection('externalOrganization')
        .findOne({ _id: id })
    );
    if (!record) {
        throw new ApiError(404);
    }

    var { state } = record;

    var reverseRefs = await fetchRecordReverseRefs({
        db,
        recordId: id,
        refTargetCollection: 'externalOrganization'
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
        collection: 'externalOrganization',
        channelId: id,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
