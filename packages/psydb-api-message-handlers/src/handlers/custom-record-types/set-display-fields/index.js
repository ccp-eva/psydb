'use strict';
var debug = require('debug')('psydb:api:message-handlers');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var SimpleHandler = require('../../../lib/simple-handler'),
    PutMaker = require('../../../lib/put-maker');

var createSchema = require('./schema');

var handler = SimpleHandler({
    messageType: 'custom-record-types/set-display-fields',
    createSchema,
});

handler.checkAllowedAndPlausible = async ({
    db,
    permissions,
    cache,
    message
}) => {
    if (!permissions.hasRootAccess) {
        throw new ApiError(403);
    }

    var {
        id,
        lastKnownEventId,
        fields,
    } = message.payload;

    var record = await (
        db.collection('customRecordType').findOne({
            _id: id
        })
    );

    if (!record) {
        throw new ApiError(404, 'CustomRecordTypeNotFound');
    }
    
    if (!compareIds(record.events[0]._id, lastKnownEventId)) {
        throw new ApiError(400, 'RecordHasChanged');
    }

    var {
        hasSubChannels,
        subChannelKeys
    } = allSchemaCreators[record.collection];

    for (var field of fields) {
        var {
            type,
            subChannelKey,
            fieldKey
        } = field;

        if (hasSubChannels) {
            if (!subChannelKey) {
                throw new ApiError(400, 'SubChannelKeyRequired');
            }
            else if (!subChannelKeys.includes(subChannelKey)) {
                throw new ApiError(400, 'UnsupportedSubChannelKey');
            }
        }
        else {
            if (subChannelKey) {
                throw new ApiError(400, 'SubChannelsNotAllowed');
            }
        }

        var existing;
        if (hasSubChannels) {
            existing = (
                record.state.settings.subChannelFields[subChannelKey]
                .find(it => it.key === fieldKey)
            );
        }
        else {
            existing = (
                record.state.settings.fields
                .find(it => it.key === fieldKey)
            );
        }
        if (!existing) {
            throw new ApiError(400, 'InvalidFieldKey');
        }
    }

}

handler.triggerSystemEvents = async ({
    db,
    rohrpost,
    cache,
    message,
}) => {
    var { personnelId, payload } = message;

    var {
        id,
        lastKnownEventId,
        target,
        fields,
    } = payload;

    var channel = (
        rohrpost
        .openCollection('customRecordType')
        .openChannel({
            id
        })
    );

    var pointer = (
        target === 'optionlist'
        ? '/state/optionlistDisplayFields'
        : '/state/tableDisplayFields'
    );
    
    var messages = PutMaker({ personnelId }).all({
        [pointer]: fields
    });

    await channel.dispatchMany({
        lastKnownEventId,
        messages,
    });
}

module.exports = handler;
