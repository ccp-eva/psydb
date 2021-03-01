'use strict';
var nanoid = require('nanoid').nanoid;

var defaultMqSettings = {
    createId: () => nanoid(),
    ephemeralCollectionName: 'mqMessageQueue',
    persistCollectionName: 'mqMessageHistory',
}

var defaultRohrpostSettings = {
    createChannelId: () => nanoid(),
    createChannelEventId: () => nanoid(),
    disableChannelAutoUnlocking: true,
}

module.exports = {
    defaultMqSettings,
    defaultRohrpostSettings,
}
