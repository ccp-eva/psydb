'use strict';
var { parseRecordMessageType } = require('./parse-record-message-type');

var destructureMessage = (options) => {
    var { message } = options;
    var { type: messageType, payload, timezone } = message;
    
    var { 
        op, collection, 
        recordType
    } = parseRecordMessageType(messageType);

    var {
        id,
        sequenceNumber,
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
        lastKnownEventId,
        lastKnownSubChannelEventIds,
        props,
        additionalCreateProps,
        timezone
    }
}

module.exports = { destructureMessage };
