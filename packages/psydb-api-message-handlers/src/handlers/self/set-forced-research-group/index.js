'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError, compareIds } = require('@mpieva/psydb-api-lib');
var { SimpleHandler } = require('../../../lib/');
var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'self/set-forced-research-group',
    createSchema,
});

handler.checkAllowedAndPlausible = async (context) => {
    var {
        db,
        permissions,
        message,
        cache
    } = context;

    var {
        hasRootAccess,
        availableResearchGroupIds
    } = permissions;

    var { researchGroupId } = message.payload;
   
    if (researchGroupId) {
        var hasGroup = !!availableResearchGroupIds.find(allowedId => (
            compareIds(allowedId, researchGroupId)
        ))
        if (!hasGroup && !hasRootAccess) {
            throw new ApiError(403, {
                apiStatus: 'ResearchGroupNotAllowed',
            })
        }
    }
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        personnelId,

        dispatch,
    } = context;
    
    var { researchGroupId } = message.payload;
    await dispatch({
        collection: 'personnel',
        channelId: personnelId,
        subChannelKey: 'scientific',
        payload: { $set: {
            'scientific.state.internals.forcedResearchGroupId': (
                researchGroupId
            )
        }}
    });
}

module.exports = handler;
