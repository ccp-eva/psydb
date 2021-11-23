'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/create',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    message
}) => {
    if (!permissions.hasRootAccess) {
        //throw new ApiError(403);
    }

    var {
        collection,
        type,
    } = message.payload;

    var existing = await (
        db.collection('customRecordType').find({
            collection,
            type
        }).toArray()
    );

    if (existing.length > 0) {
        throw new ApiError(400, 'DuplicateCustomRecordType');
    }
}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    personnelId,
}) => {
    var { id, collection, type, props } = message.payload;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id,
            isNew: true,
            additionalChannelProps: { collection, type }
        })
    );

    var messages = PutMaker({ personnelId }).all({
        '/state/label': props.label
    });

    await channel.dispatchMany({ messages });

    /*{
        type: 'put',
        payload: {
            // datensatz-beschriftung
            prop: '/nextSettings/recordLabelDefinition',
            value: props.recordLabelDefinition
        }
    }*/

}

module.exports = handler;
