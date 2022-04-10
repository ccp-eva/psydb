'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'study/set-excluded-other-study-ids',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        personnelId,
        message,
        cache,
        permissions,
    } = context;

    var { id, excludedOtherStudyIds } = message.payload;
    if (!permissions.hasCollectionFlag('study', 'write')) {
        throw new ApiError(403); 
    }
    // TODO: checks
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        personnelId,
        dispatch
    } = context;
    
    var { id, excludedOtherStudyIds } = message.payload;
    await dispatch({
        collection: 'study',
        channelId: id,
        payload: { $set: {
            'state.excludedOtherStudyIds': excludedOtherStudyIds
        }}
    })
}

module.exports = handler;
