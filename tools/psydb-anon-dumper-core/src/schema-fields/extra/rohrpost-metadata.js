'use strict';
var { ExactObject, DefaultArray } = require('../core-composition');
var { MongoId, DateTime, DefaultBool } = require('../scalar');

var RohrpostMetadata = () => ExactObject({
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
})

module.exports = RohrpostMetadata;
