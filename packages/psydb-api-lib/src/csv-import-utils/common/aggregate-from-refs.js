'use strict';
var { entries, convertPointerToPath } = require('@mpieva/psydb-core-utils');
var aggregateToArray = require('../../aggregate-to-array');

var aggregateFromRefs = async (bag) => {
    var { db, pointers, extraMatch, ...rest } = bag;
    var [ collection, values ] = entries(rest)[0];

    // NOTE: fire one query per possible pointer
    var resolved = await Promise.all(pointers.map(pointer => {
        var path = convertPointerToPath(pointer);
        return aggregateToArray({ db, [collection]: [
            { $match: {
                [path]: { $in: values },
                ...extraMatch,
            }},
            { $project: {
                _id: true,
                // NOTE: we use this for multi typed collections
                // easily access recordType in dwn stream operations
                type: true,
                [pointer]: '$' + path
            }}
        ]})
    }));

    var out = [];
    for (var r of resolved) {
        out.push(...r.map(it => {
            var { _id, type, ...rest } = it;
            var [ pointer, value ] = entries(rest)[0];
            return { _id, type, pointer, value }
        }))
    }
    return out;
}

module.exports = aggregateFromRefs;
