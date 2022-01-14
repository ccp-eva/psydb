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
        lastKnownEventId,
        lastKnownSubChannelEventIds,
        props,
        additionalCreateProps,
    }
}

module.exports = { destructureMessage };
