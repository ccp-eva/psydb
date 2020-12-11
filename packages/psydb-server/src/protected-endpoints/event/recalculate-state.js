'use strict';
var jsonpointer = require('jsonpointer');

var recalculateState = ({ events, createDefaultState }) => {
    var state = (
        createDefaultState
        ? createDefaultState() 
        : {}
    );

    events.forEach(({ message }) => {
        var { type, payload } = message,
            handler = typeHandlers[type];

        if (!handler) {
            // TODO: log/error // general handler?
            console.log(`no handler found for "${type}" message type`);
        }
        else {
            state = handler(state, payload);
        }
    });

    return state;
};

var typeHandlers = {
    'put': (state, { prop, value }) => {
        jsonpointer.set(state, prop, value);
        return state;
    },
}

module.exports = recalculateState;
