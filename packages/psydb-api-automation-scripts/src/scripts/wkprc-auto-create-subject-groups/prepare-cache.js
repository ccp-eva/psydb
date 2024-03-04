'use strict';
var { keyBy, ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (context) => {
    var { db, cache } = context;

    var fetchAll = (collection) => (
        db.collection(collection)
        .find()
        .sort({ squenceNumber: 1 })
        .toArray()
    )

    var researchGroupsByShorthand = keyBy({
        items: await fetchAll('researchGroup'),
        byPointer: '/state/shorthand',
        transform: (it) => (it._id)
    });
    
    var locationsById = keyBy({
        items: await fetchAll('location'),
        byPointer: '/_id',
        transform: (it) => ({ _id: it._id, type: it.type })
    });
    
    cache.merge({
        researchGroup: researchGroupsByShorthand,
        location: locationsById,
    });

    console.dir(ejson(cache.get()), { depth: null });
}
