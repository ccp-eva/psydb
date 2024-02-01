'use strict';
require('mingo/init/system');
var jsonpointer = require('jsonpointer');

var { createUpdater } = require('mingo/updater');
var { unescape } = require('@cdxoo/mongodb-escape-keys');

// FIXME: mingo bug when pulling ObjectId from array
var { ObjectId } = require('mongodb');
var ejson = require('@cdxoo/tiny-ejson');

var Injector = (target) => {
    var set = (pointer, value) => {
        jsonpointer.set(target, pointer, value);
    }

    var maybeSet = (pointer, value) => {
        if (undefined === jsonpointer.get(target, pointer)) {
            set(pointer, value)
        }
    }

    var unshift = (pointer, value) => {
        if (!jsonpointer.get(target, pointer)) {
            jsonpointer.set(target, pointer, []);
        }
        jsonpointer.get(target, pointer).unshift(value);
    }

    return {
        set,
        maybeSet,
        unshift,
    }
}

var spoolEvents = (bag) => {
    var { onto = {}, events } = bag;

    var { set, maybeSet, unshift } = Injector(onto);

    //var updateObject = createUpdater({ cloneMode: "deep" });
    var updateObject = createUpdater();
    for (var it of events) {
        var {
            _id: eventId,
            sessionId,
            timestamp,
            channelId,
            subChannelKey,
            additionalChannelProps,
            message
        } = it;

        maybeSet('/_id', channelId);
        maybeSet('/_rohrpostMetadata', {});

        if (additionalChannelProps) {
            for (var key of Object.keys(additionalChannelProps)) {
                onto[key] = additionalChannelProps[key];
            }
        }

        var t = undefined;
        if (subChannelKey) {
            set('/_rohrpostMetadata/hasSubChannels', true);
            maybeSet('/_rohrpostMetadata/createdAt', timestamp);

            t = `/${subChannelKey}/_rohrpostMetadata`;
            maybeSet(`${t}`, {});
            maybeSet(`${t}/subChannelKey`, subChannelKey);
        }
        else {
            t = `/_rohrpostMetadata`;
            maybeSet(`${t}/hasSubChannels`, false);
            maybeSet(`${t}/createdAt`, timestamp);
        }

        set(`${t}/updatedAt`, timestamp);
        set(`${t}/lastKnownSessionId`, sessionId);
        set(`${t}/lastKnownEventId`, eventId);
        unshift(`${t}/eventIds`, eventId);
        maybeSet(`${t}/unprocessedEventIds`, []);

        //console.dir(ejson(it), { depth: null });

        //NOTE arrayFilters dont exist yet
        var { payload, arrayFilters } = message;
        // FIXME: mingo bug when pulling ObjectId from array
        var ops = ejson(unescape(payload), { prefix: '/' });

        if (Object.keys(ops).length > 1) {
            // NOTE: updateObject() cant handle multiple
            // update expressions at once so we have to split them
            for (var key of Object.keys(ops)) {
                var subop = { [key]: ops[key] };
                console.dir(subop, { depth: null });
                updateObject(onto, subop, arrayFilters)
            }
        }
        else {
            updateObject(onto, ops, arrayFilters);
        }
    }

    onto = ejson.parse(JSON.stringify(onto), {
        prefix: '/',
        createDate: (x) => new Date(x),
        createObjectId: (x) => new ObjectId(x),
    });
    return onto;
}

module.exports = spoolEvents;
