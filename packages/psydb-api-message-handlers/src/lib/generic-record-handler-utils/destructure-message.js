'use strict';
var { parseRecordMessageType } = require('./parse-record-message-type');

var destructureMessage = (options) => {
    var { message } = options;
    var { type: messageType, payload } = message;
    
    var { 
        op, collection, 
        recordType
    } = parseRecordMessageType(messageType);

    var {
        id,
        sequenceNumber,
        // FIXME: this is only for migrating existing onlineIds
        // and can probably removed in the future
        // if its kept we need to restrict this to nanoid specifically
        onlineId,
        lastKnownEventId,
        lastKnownSubChannelEventIds,
        props,
        ...additionalCreateProps
    } = payload;

    return {
        collection,
        recordType,
        op,
        id,
        sequenceNumber,
        onlineId,
        lastKnownEventId,
        lastKnownSubChannelEventIds,
        props,
        additionalCreateProps,
    }
}

module.exports = { destructureMessage };
