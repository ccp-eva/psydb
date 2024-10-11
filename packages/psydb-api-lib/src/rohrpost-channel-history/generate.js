'usr strict';
var { copy } = require('copy-anything');
var diff = require('deep-diff');
var { entries, omit, ejson } = require('@mpieva/psydb-core-utils');

var SET = require('./set');
var UNSET = require('./unset');
var PUSH = require('./push');
var PULL = require('./pull');

var generate = (bag = {}) => {
    var { events, omitPaths } = bag;

    var doOmit = (from) => omit({ from, paths: omitPaths });

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
        //if (omitPaths) {
        //    virtualChannel = omit({
        //        from: virtualChannel,
        //        paths: omitPaths
        //    });
        //}

        // NOTE: diff is not safe when in situ changing diffed objects
        var clone = copy(virtualChannel);
        history.push({
            event: {
                ...(isNewChannel && { isNewChannel }),
                ...other,
                message,
                ...(additionalChannelProps && { additionalChannelProps }),
            },
            version: doOmit(clone),
            diff: diff(doOmit(preUpdate), doOmit(clone)),
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
