'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    verifyCollectionAccess,
    verifyRecordExists,
    fetchCRTPreRemoveInfo,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'custom-record-types/remove',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message,
    cache,
}) => {
    verifyCollectionAccess({
        permissions,
        collection: 'customRecordType', flag: 'remove'
    });

    var { id } = message.payload;
    await verifyRecordExists({
        db, collection: 'customRecordType', recordId: id
    });

    var {
        existingRecordCount,
        crtFieldRefs
    } = await fetchCRTPreRemoveInfo({ db, crtId: id });

    if (existingRecordCount) {
        throw new ApiError(409, {
            apiStatus: 'CRTRecordsExist',
            data: { existingRecordsCount }
        });
    }

    if (crtFieldRefs.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'CRTIsReferenced',
            data: { crtFieldRefs }
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
        collection: 'customRecordType',
        channelId: id,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
