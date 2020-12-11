'use strict';
var parseRecordMessageType = require('./parse-record-message-type'),
    createRecordPropMessages = require('./create-record-prop-messages');

var handleRecordsMessage = async ({
    db, rohrpost, message
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

module.exports = handleRecordsMessage;
