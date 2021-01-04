'use strict';
var jsonpointer = require('jsonpointer'),
    clone = require('clone-deep');

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
                console.log(`no handler found for "${type}" message type`);
            }
            else {
                nextState = handler(nextState, payload);
            }
        }
    });

    return { nextState, nextCommit };
};

var typeHandlers = {
    'put': (state, { prop, value }) => {
        jsonpointer.set(state, prop, value);
        return state;
    },
}

module.exports = calculateState;
