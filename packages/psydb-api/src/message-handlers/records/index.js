'use strict';
var messageType = require('./message-type'),
    createSchema = require('./create-schema'),
    parseRecordMessageType = require('./parse-record-message-type'),
    createRecordPropMessages = require('./create-record-prop-messages');

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions,
}) => {
    var { type: messageType, payload } = message;

    var { 
        op, collection, 
        recordType, recordSubtype 
    } = parseRecordMessageType(messageType);

    if (op === 'create') {
        if (!permissions.canCreateRecord({
            collection,
            recordType,
            recordSubType
        })) {
            throw new ApiError(403);
        }
    }

    if (op === 'patch') {
        var record = await (
            db.collection(collection).findOne({ _id: payload.id })
        );
        if (!record) {
            throw new ApiError(400);
        }
        if (!permssions.canPatchRecord(record)) {
            throw new ApiError(403);
        }
    }

    // TODO: delete-gdpr
    
}

var handleMessage = async ({
    db,
    rohrpost,
    message
}) => {
    var { type: messageType, personnelId, payload } = message;

    var { 
        op, collection, 
        recordType, recordSubtype 
    } = parseRecordMessageType(messageType);

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection(collection)
        .openChannel({ id: payload.id, isNew: op === 'create' })
    );

    var recordPropMessages = createRecordPropMessages({
        personnelId,
        props: payload.props
    });
    
    for (var it of recordPropMessages) {
        //console.log(it);
        var { subChannelKey, ...message } = it;
        await channel.dispatch({ subChannelKey, message })
    }
}

module.exports = {
    messageType,
    createSchema,
    checkAllowedAndPlausible,
    handleMessage,
};
