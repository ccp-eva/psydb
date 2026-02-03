'use strict';
var { arrify, unique, convertPointerToPath }
    = require('@mpieva/psydb-core-utils');

var { entries } = Object;
var mingo = require('mingo'); require('mingo/init/system');

var fetchCRTLabels = require('./fetch-crt-labels');

var fetchCRTLabelsManual = async (bag) => {
    var {
        db,
        keys: keymap,
        records, pointers: pointermap,
        i18n
    } = bag;

    if (!(keymap || records && pointermap)) {
        throw new Error('provide either "keys" or "records" and "pointers" ')
    }

    if (!keymap) {
        keymap = getMappedKeys(arrify(records), pointermap);
    }

    var OR = [];
    for (var [ collection, keys ] of entries(keymap)) {
        OR.push({ collection, type: { $in: keys }});
    }

    // TODO: phase out; also make backend do translation and
    // just return label instead of object
    var related = await fetchCRTLabels({
        db, filter: { $or: OR }, ...i18n, keyed: true
    });

    return related;
}

// TODO: this coule be its own utility for reuse
var getMappedKeys = (records, mapping) => {
    var out = {};
    for (var [ collection, pointers ] of entries(mapping)) {
        out[collection] = [];
        for (var ptr of pointers) {
            var keys = mingo.aggregate(records, [
                { $project: {
                    'key': '$' + convertPointerToPath(ptr)
                }},
                { $unwind: '$key' }
            ]).map(it => it.key);

            out[collection].push(...keys);
        }
        out[collection] = unique(out[collection]);
    }
    return out;
}

module.exports = fetchCRTLabelsManual;
