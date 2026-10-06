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

    console.dir(ejson(cache.get()), { depth: null });
}
