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
    enableTransactions: false,
    enableOptimisticLocking: false
}

module.exports = {
    defaultMqSettings,
    defaultRohrpostSettings,
}
