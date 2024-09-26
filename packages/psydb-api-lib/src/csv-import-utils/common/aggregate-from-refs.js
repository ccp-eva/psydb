'use strict';
var { 
    groupBy, entries, convertPointerToPath
} = require('@mpieva/psydb-core-utils');
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

    var merged = [];
    for (var res of resolved) {
        merged.push(...res.map(it => {
            var { _id, type, ...rest } = it;
            var [ pointer, value ] = entries(rest)[0];
            return { _id, type, pointer, value }
        }))
    }
    
    // NOTE: in some cases miltiple pointers can match the same
    // record i.e. when a helperSet is labeled the same in english or german
    var resolvedForId = groupBy({
        items: merged,
        byProp: '_id',
    });

    var out = [];
    for (var [ k, group ] of entries(resolvedForId)) {
        var [ first, ...unused ] = group;
        out.push(first);
    }

    return out;
}

module.exports = aggregateFromRefs;
