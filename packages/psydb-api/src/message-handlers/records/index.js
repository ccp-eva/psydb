'use strict';
var messageType = require('./message-type'),
    checkSchema = require('./check-schema'),
    parseRecordMessageType = require('./parse-record-message-type'),
    createRecordPropMessages = require('./create-record-prop-messages');

var shouldRun = (message) => {
    return messageType.test(message.type)
}

var checkAllowedAndPlausible = async ({
    db,
    message,
    permissions,
}) => {
    var { type: messageType, payload } = message;

    var { 
        op, collection, 
        recordType, recordSubType 
    } = parseRecordMessageType(messageType);

    if (op === 'create') {
        if (!permissions.hasRootAccess) {
            throw new ApiError(403);
        }
        // TODO
        /*if (!permissions.canCreateRecord({
            collection,
            recordType,
            recordSubType
        })) {
            throw new ApiError(403);
        }*/
    }
    else if (op === 'patch') {
        var record = await (
            db.collection(collection).findOne({ _id: payload.id })
        );
        if (!record) {
            throw new ApiError(400);
        }
        if (!permissions.hasRootAccess) {
            throw new ApiError(403);
        }
        // TODO
        /*if (!permssions.canPatchRecord(record)) {
            throw new ApiError(403);
        }*/
    }
    // TODO: deleteGdpr
    else {
        // unknown op
        throw new ApiError(400); // TODO 
    }
}

var triggerSystemEvents = async ({
    db,
    rohrpost,
    personnelId,
    message
}) => {
    var { type: messageType, payload } = message;
    //console.log(payload);

    var { 
        op, collection, 
        recordType, recordSubType 
    } = parseRecordMessageType(messageType);

    var {
        id,
        props,
        ...additionalCreateProps
    } = payload;

    // FIXME: dispatch silently ignores messages when id is set
    // but record doesnt exist
    var channel = (
        rohrpost
        .openCollection(collection)
        .openChannel({
            id: payload.id,
            isNew: op === 'create',
            additionalChannelProps: (
                op === 'create'
                ? {
                    ...(recordType && { type: recordType }),
                    ...(recordSubType && { subtype: recordSubType }),
                    ...additionalCreateProps
                }
                : undefined
            )
        })
    );

    // TODO: check if personnelId is in the right place in the rohrpost messages
    var recordPropMessages = createRecordPropMessages({
        personnelId,
        props: payload.props
    });

    // FIXME: undefined string shenanigans
    // when subChannelKey === undefined
    var subChannelKeys = [],
        messagesBySubChannel = {};
    for (var it of recordPropMessages) {
        //console.log(it);
        var { subChannelKey, ...message } = it;
        if (!messagesBySubChannel[subChannelKey]) {
            messagesBySubChannel[subChannelKey] = [];
            subChannelKeys.push(subChannelKey)
        }
        messagesBySubChannel[subChannelKey].push(message);
    }

    for (var key of subChannelKeys) {
        await channel.dispatchMany({
            subChannelKey: key,
            messages: messagesBySubChannel[key]
        });
        //console.log(it);
        //var { subChannelKey, ...message } = it;
        //await channel.dispatch({ subChannelKey, message })
    }

    var docs = await db.collection(collection).find().toArray();
    //console.dir(docs, { depth: null });
}

// no-op
var triggerOtherSideEffects = async () => {};

module.exports = {
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
};
