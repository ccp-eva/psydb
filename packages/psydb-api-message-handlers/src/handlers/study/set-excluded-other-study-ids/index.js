'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var { ApiError } = require('@mpieva/psydb-api-lib');
var { SimpleHandler, PutMaker } = require('../../../lib/');

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
    } = context;

    var { id, lastKnownEventId, excludedOtherStudyIds } = message.payload;

    // TODO: checks
}

handler.triggerSystemEvents = async (context) => {
    var {
        db,
        rohrpost,
        message,
        personnelId,
    } = context;
    
    var { id, lastKnownEventId, excludedOtherStudyIds } = message.payload;

    var channel = (
        rohrpost
        .openCollection('study')
        .openChannel({ id })
    );

    await channel.dispatchMany({
        lastKnownEventId: lastKnownEventId,
        messages: PutMaker({ personnelId }).all({
            '/state/excludedOtherStudyIds': excludedOtherStudyIds
        })
    });
}

module.exports = handler;
