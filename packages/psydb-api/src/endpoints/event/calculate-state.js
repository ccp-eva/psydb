'use strict';
var inline = require('@cdxoo/inline-text'),
    jsonpointer = require('jsonpointer'),
    cleateClone = require('copy-anything');

var {
    isArray,
    isPlainObject
} = require('is-what');

var calculateState = ({ events, createDefaultState }) => {
    var nextState = (
        createDefaultState
        ? createDefaultState() 
        : {}
    );
    var nextCommit = undefined;

    events.forEach(({ message }) => {
        var { type, payload } = message;
        if (type === 'commit') {
            nextCommit = clone(nextState);
        }
        else {
            var handler = typeHandlers[type];

            if (!handler) {
                // TODO: log/error // general handler?
                throw new Error(`no handler found for "${type}" event type`);
            }
            else {
                nextState = handler(nextState, payload);
            }
        }
    });

    //console.dir(nextState, { depth: null });
    return { nextState, nextCommit };
};

// TODO: this can fail we need to wrap it and handle exceptions
// TODO: exception types
// TODO: figure out if non immutability of jsoinpointer set
// matters in some cases
var typeHandlers = {
    'put': (state, { prop, value }) => {
        jsonpointer.set(state, prop, value);
        return state;
    },
    'push': (state, { prop, value }) => {
        jsonpointer.set(state, `${prop}/-`, value);
        return state;
    },
    'remove': (state, { prop }) => {
        if (prop === '/') {
            // this actually returns undefined not the root object
            throw new Error(inline`
                invalid prop pointer "/",
                its not possible to remove the root object itself
            `);
        }
        if (prop === '') {
            throw new Error(inline`
                invalid prop pointer "",
                its not possible to remove the root object itself
            `);
        }
        
        var tokens = prop.split('/'),
            removeKey = tokens.splice(-1)[0],
            containerProp = tokens.join('/');

        var value = jsonpointer.get(state, containerProp);
        if (isArray(value)) {
            // non-immutable; abuses the fact that we can manipulate refs
            value.splice(removeKey, 1);
        }
        else if (isPlainObject(value)) {
            // non-immutable; abuses the fact that we can manipulate refs
            delete value[removeKey];
        }
        else {
            throw new Error(inline`
                property in pointer is not contained
                in an object or array`
            );
        }
            
        return state;
    }
}

module.exports = calculateState;
