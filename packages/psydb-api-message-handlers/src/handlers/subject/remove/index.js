'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var {
    ApiError,
    compareIds,
    createSchemaForRecordType
} = require('@mpieva/psydb-api-lib');

var SimpleHandler = require('../../../lib/simple-handler');
var checkForeignIdsExist = require('../../../lib/check-foreign-ids-exist');
var PutMaker = require('../../../lib/put-maker');

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
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownGdprEventId,
        lastKnownScientificEventId,
    } = message.payload;

    var crts = await (
        db.collection('customRecordType')
        .find({}, { projection: { events: false }})
        .toArray()
    );

    for (var crt of crts) {
        var schema = createSchemaForRecordType({
            db,
            collectionName: crt.collection,
            recordType: crt.type,
            fullSchema: true,
            prefetchedCustomRecordTypes: [ crt ]
        });
        
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
    cache,
}) => {
}

module.exports = handler;
