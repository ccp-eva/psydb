'use strict';
require('mingo/init/system');

var { createUpdater } = require('mingo/updater');
var { unescape } = require('@cdxoo/mongodb-escape-keys');

// FIXME: mingo bug when pulling ObjectId from array
var { ObjectId } = require('mongodb');
var ejson = require('@cdxoo/tiny-ejson');

var spoolEvents = (bag) => {
    var { onto = {}, events } = bag;

    //var updateObject = createUpdater({ cloneMode: "deep" });
    var updateObject = createUpdater();
    for (var it of events) {
        var {
            _id: eventId,
            sessionId,
            timestamp,
            channelId,
            additionalChannelProps,
            message
        } = it;
        
        if (!onto._id) {
            onto._id = channelId;
        }
        if (!onto._rohrpostMetadata) {
            onto._rohrpostMetadata = {
                hasSubChannels: false, // FIXME
                createdAt: timestamp,
                updatedAt: timestamp,
                lastKnownSessionId: sessionId,
                lastKnownEventId: eventId,
                eventIds: [ eventId ],
                unprocessedEventIds: []
            };
        }
        else {
            onto._rohrpostMetadata.updatedAt = timestamp;
            onto._rohrpostMetadata.lastKnownSessionId = sessionId;
            onto._rohrpostMetadata.lastKnownEventId = eventId;
            onto._rohrpostMetadata.eventIds.unshift(eventId)
        }

        if (additionalChannelProps) {
            for (var key of Object.keys(additionalChannelProps)) {
                onto[key] = additionalChannelProps[key];
            }
        }
        //console.dir(ejson(it), { depth: null });

        //NOTE arrayFilters dont exist yet
        var { payload, arrayFilters } = message;
        // FIXME: mingo bug when pulling ObjectId from array
        var ops = ejson(unescape(payload), { prefix: '/' });

        updateObject(onto, ops, arrayFilters);
    }

    onto = ejson.parse(JSON.stringify(onto), {
        prefix: '/',
        createDate: (x) => new Date(x),
        createObjectId: (x) => new ObjectId(x),
    });
    return onto;
}

module.exports = spoolEvents;
