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

    var crtsByType = keyBy({
        items: await fetchAll('customRecordType'),
        byPointer: '/type',
        transform: (it) => (it._id)
    });

    var systemRolesByName = keyBy({
        items: await fetchAll('systemRole'),
        byPointer: '/state/name',
        transform: (it) => (it._id)
    });

    var researchGroupsByName = keyBy({
        items: await fetchAll('researchGroup'),
        byPointer: '/state/name',
        transform: (it) => (it._id)
    });

    var helperSetsByLabel = keyBy({
        items: await fetchAll('helperSet'),
        byPointer: '/state/label',
        transform: (it) => (it._id)
    });

    cache.merge({
        customRecordType: crtsByType,
        systemRole: systemRolesByName,
        researchGroup: researchGroupsByName,
        helperSet: helperSetsByLabel,
    });

    console.dir(ejson(cache.get()), { depth: null });
}
