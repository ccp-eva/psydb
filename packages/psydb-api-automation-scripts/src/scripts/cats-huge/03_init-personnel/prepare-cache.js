'use strict';
var { keyBy, keySequence, ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (context) => {
    var { cache } = context;

    await cache.prepareKeyedIds({
        collection: 'customRecordType',
        keyBy: '/type',
    });

    await cache.prepareSequenceKeyedIds({
        collection: 'helperSet',
        keys: [ 'catOwner_acquisition', 'cat_rearingHistory' ]
    });

    await cache.prepareKeyedIds({
        collection: 'researchGroup',
        keyBy: '/state/shorthand',
    });
    
    await cache.prepareKeyedIds({
        collection: 'systemRole',
        keyBy: '/state/name',
    });

    console.dir(ejson(cache.get()), { depth: null });
}
