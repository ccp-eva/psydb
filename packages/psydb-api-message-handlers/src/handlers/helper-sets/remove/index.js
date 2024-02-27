'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    verifyCollectionAccess,
    verifyRecordExists,
    fetchHelperSetPreRemoveInfo,
} = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');


var handler = SimpleHandler({
    messageType: 'helperSet/remove',
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
        collection: 'helperSet', flag: 'remove'
    });

    var { id } = message.payload;
    await verifyRecordExists({
        db, collection: 'helperSet', recordId: id
    });

    var {
        existingItemCount,
        crtFieldRefs
    } = await fetchHelperSetPreRemoveInfo({ db, setId: id });

    if (existingItemCount) {
        throw new ApiError(409, {
            apiStatus: 'HelperSetItemsExist',
            data: { existingItemCount }
        });
    }

    if (crtFieldRefs.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'HelperSetIsReferenced',
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
    var { id: setId } = message.payload;

    var relatedResearchGroups = await (
        db.collection('researchGroup').find({
            'state.helperSetIds': setId
        }, { _id: true }).toArray()
    );

    for (var rg of relatedResearchGroups) {
        await dispatch({
            collection: 'researchGroup',
            channelId: rg._id,
            payload: { $pull: {
                'state.helperSetIds': setId
            }}
        })
    }

    await dispatch({
        collection: 'helperSet',
        channelId: setId,
        payload: { $set: {
            'state.internals.isRemoved': true
        }}
    });
}


module.exports = handler;
