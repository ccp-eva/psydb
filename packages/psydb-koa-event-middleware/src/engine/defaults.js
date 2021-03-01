'use strict';
var ObjectId = require('mongodb').ObjectId;

var defaultMqSettings = {
    createId: () => ObjectId(),
    ephemeralCollectionName: 'mqMessageQueue',
    persistCollectionName: 'mqMessageHistory',
}

var defaultRohrpostSettings = {
    createChannelId: () => ObjectId(),
    createChannelEventId: () => ObjectId(),
}

module.exports = {
    defaultMqSettings,
    defaultRohrpostSettings,
}
