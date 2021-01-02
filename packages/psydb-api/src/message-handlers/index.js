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
        !handler.messageType 
        || (
            typeof handler.messageType !== 'string'
            && !(handler.messageType instanceof RegExp)
        )
    ) {
        throw new InvalidHandlerInterface(inline`
            property "messageType" is undefined
            or is neither a string nor a RegExp
        `);
    }

    [
        'createSchema',
        'checkAllowedAndPlausible',
        'triggerSystemEvents',
        'triggerOtherSideEffects',
    ].forEach(prop => {
        if (!handler[prop] && typeof handler[prop] !== 'function') {
            throw new InvalidHandlerInterface(inline`
                property "${prop}" is undefined
                or is not a function
            `);
        }
    })

    handlerList.push(handler);
};

var findHandler = (handlerList) => (messageType) => {
    var filtered = handlerList.filter(it => {
        if (it.messageType instanceof RegExp) {
            return it.messageType.test(messageType)
        }
        else {
            return it.messageType === messageType
        }
    });

    if (filtered.length < 1) {
        throw new Error(`no message handler for "${messageType}"`);
    }
    else if (filtered.length > 1) {
        throw new Error(`multiple message handlers for "${messageType}"`);
    }
    else {
        return filtered[0];
    }
}

var Registry = () => {
    var registry = {},
        handlers = [];

    registry.add = addHandler(handlers);
    registry.find = findHandler(handlers);

    addAllHandlers(registry);

    return registry;
}

module.exports = Registry;
