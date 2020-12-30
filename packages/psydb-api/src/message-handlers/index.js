'use strict';
var fs = require('fs'),
    fspath = require('path'),
    inline = require('@cdxoo/inline-text');

class InvalidHandlerInterface extends Error {}

var addAllHandlers = (registry) => {
     var subdirs = (
        fs.readdirSync(__dirname)
        .map(it => (
            fspath.join(__dirname, it)
        ))
        .filter(it => (
            fs.lstatSync(it).isDirectory()
        ))
    );

    subdirs.forEach(dir => {
        var indexFile = fspath.join(dir, 'index.js');
        
        var handler = require(indexFile);
        try { 
            registry.add(handler);
        }
        catch (error) {
            if (error instanceof InvalidHandlerInterface) {
                throw new InvalidHandlerInterface(inline`
                    invalid handler in ${indexFile}:
                    ${error.message}
                `)
            }
            else {
                throw error;
            }
        }
    })
}

var addHandler = (handlerList) => (handler) => {
    if (!handler || typeof handler !== 'object') {
        throw new InvalidHandlerInterface(inline`
            handler is undefined or not an object
        `);
    }

    if (
        !handler.type 
        || (
            typeof handler.type !== 'string'
            && !(handler.type instanceof RegExp)
        )
    ) {
        throw new InvalidHandlerInterface(inline`
            property "type" is undefined
            or is neither a string nor a RegExp
        `);
    }

    [
        'isAllowed',
        'isValid',
        'handleMessage'
    ].forEach(prop => {
        if (!handler[prop]) {
            throw new InvalidHandlerInterface(inline`
                property "${prop}" is undefined
                or is not a function
            `);
        }
    })

    handlerList.push(handler);
};

var Registry = () => {
    var registry = {},
        handlers = [];

    registry.add = addHandler(handlers);
    //registry.find = findHandler(handlers);

    addAllHandlers(registry);
}

var r = Registry();

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
