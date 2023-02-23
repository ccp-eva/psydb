'usr strict';
var { copy } = require('copy-anything');
var diff = require('deep-diff');
var { entries } = require('@mpieva/psydb-core-utils');

var SET = require('./set');
var UNSET = require('./unset');
var PUSH = require('./push');
var PULL = require('./pull');

var generate = (bag = {}) => {
    var { events } = bag;

    var history = [];
    var virtualChannel = {};
    for (var it of events.reverse()) {
        var {
            message,
            isNewChannel,
            additionalChannelProps,
            ...other
        } = it;

        var preUpdate = copy(virtualChannel);

        applyUpdate(
            virtualChannel,
            message.payload,
            additionalChannelProps
        );
        console.dir(virtualChannel, { depth: null });

        history.push({
            event: {
                ...(isNewChannel && { isNewChannel }),
                ...other,
                message,
                ...(additionalChannelProps && { additionalChannelProps }),
            },
            version: copy(virtualChannel),
            diff: diff(preUpdate, virtualChannel),
        });
    }

    return history;
}

var applyUpdate = (channel, payload, extraProps) => {
    if (extraProps) {
        for (var [key, value] of entries(extraProps)) {
            channel[key] = value;
        };
    }
    for (var [ op, opData ] of entries(payload)) {
        var args = [ channel, opData ];
        switch (op) {
            case '/$set':
                return SET(...args);
            case '/$unset':
                return UNSET(...args);
            case '/$push':
                return PUSH(...args);
            case '/$pull':
                return PULL(...args);
            default:
                throw new Error(`unsupprted op "${op}"`);
        }
    }
}

module.exports = generate;
