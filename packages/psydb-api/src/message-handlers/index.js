'use strict';
var handlers = [
    {
        messageType: /^records\//,
        handler: require('./records')
    },
    {
        messageType: 'set-personnel-password',
        handler: require('./set-personnel-password'),
    },
    /*{
        messageType: /^custom-types\//,
        handler: require('./custom-types'),
    },*/
];

handlers.find = (messageType) => {
    var filtered = handlers.filter(it => {
        if (it.messageType instanceof RegExp) {
            return it.messageType.test(messageType)
        }
        else {
            return it.messageType === messageType
        }
    });

    if (filtered.length < 1) {
        throw new Error(`no message handler "${messageType}"`);
    }
    else if (filtered.length > 1) {
        throw new Error(`multiple message handlers "${messageType}"`);
    }
    else {
        return filtered[0].handler;
    }
}

module.exports = handlers;
