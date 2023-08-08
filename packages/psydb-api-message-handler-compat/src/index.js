'use strict';
module.exports = {
    MessageHandler: require('./message-handler'),
    presets: {
        empty: require('./empty-preset'),
        default: require('./default-preset'),
    }
}
