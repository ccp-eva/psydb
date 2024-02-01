'use strict';
var { keyBy, ejson } = require('@mpieva/psydb-core-utils');

var keySequence = (bag) => {
    var {
        sequence,
        keys,
        transform = (it) => (it)
    } = bag;

    var out = {};
    for (var [ix, it] of sequence.entries()) {
        out[keys[ix]] = transform(it);
    }
    return out;
}

module.exports = async (context) => {
    var { db, cache } = context;
    
    var fetchAll = (collection) => (
        db.collection(collection)
        .find()
        .sort({ squenceNumber: 1 })
        .toArray()
    )

    var systemRolesByName = keyBy({
        items: await fetchAll('systemRole'),
        byPointer: '/state/name',
        transform: (it) => (it._id)
    });

    var helperSetsByKey = keySequence({
        sequence: await fetchAll('helperSet'),
        transform: (it) => (it._id),
        keys: [
            'language',
        ],
    });

    cache.merge({
        systemRole: systemRolesByName,
        helperSet: helperSetsByKey,
    });

    console.dir(ejson(cache.get()), { depth: null });
}
