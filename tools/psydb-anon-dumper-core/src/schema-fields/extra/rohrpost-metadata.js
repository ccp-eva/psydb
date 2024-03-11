'use strict';
var { ClosedObject, DefaultArray } = require('../core-composition');
var { MongoId, DateTime, DefaultBool, AnyString } = require('../scalar');

var RohrpostMetadata = () => ClosedObject({
    'hasSubChannels': DefaultBool({ anonKeep: true }),
    'createdAt': DateTime({ anonKeep: true }),
    'updatedAt': DateTime({ anonKeep: true }),
    'lastKnownSessionId': MongoId({ anonKeep: true }),
    'lastKnownEventId': MongoId({ anonKeep: true }),
    'eventIds': DefaultArray({
        items: MongoId({ anonKeep: true }),
    }),
    'unprocessedEventIds': DefaultArray({
        items: MongoId({ anonKeep: true }),
    }),
    'subChannelKeys': DefaultArray({
        items: AnyString({ anonKeep: true }),
    }),
    'subChannelKey': AnyString({ anonKeep: true }),
})

module.exports = RohrpostMetadata;
