'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { compareIds } = require('@mpieva/psydb-core-utils');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error');
var { SimpleHandler, PutMaker } = require('../../../lib/');

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
    } = context;
    
    var { researchGroupId } = message.payload;

    var self = await (
        db.collection('personnel')
        .findOne({ _id: personnelId })
    );

    var channel = (
        rohrpost
        .openCollection('personnel')
        .openChannel({
            id: personnelId
        })
    )

    await channel.dispatchMany({
        lastKnownEventId: self.scientific.events[0]._id,
        subChannelKey: 'scientific',
        messages: PutMaker({ personnelId }).all({
            '/state/internals/forcedResearchGroupId': researchGroupId
        })
    })
}

module.exports = handler;
