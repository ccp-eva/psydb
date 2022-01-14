'use strict';
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var dispatchRecordPropMessages = async (options) => {
    var {
        channel,
        collection,
        op,
        lastKnownEventId,
        lastKnownSubChannelEventIds,
        recordPropMessages,
    } = options;

    var {
        hasSubChannels
    } = allSchemaCreators[collection];

    if (hasSubChannels) {
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
                lastKnownEventId: (
                    op !== 'create'
                    ? lastKnownSubChannelEventIds[key]
                    : undefined
                ),
                subChannelKey: key,
                messages: messagesBySubChannel[key]
            });
            //console.log(it);
            //var { subChannelKey, ...message } = it;
            //await channel.dispatch({ subChannelKey, message })
        }
    }
    else {
        await channel.dispatchMany({
            lastKnownEventId,
            messages: recordPropMessages
        });
    }
}

module.exports = { dispatchRecordPropMessages }
