'use strict';
var { keyBy, keySequence, ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (context) => {
    var { cache } = context;

    await cache.prepareKeyedIds({
        collection: 'customRecordType',
        keyBy: '/type',
    });
   
    await cache.prepareKeyedIds({
        collection: 'helperSet',
        keyBy: '/state/label',
    });

    console.dir(ejson(cache.get()), { depth: null });
}
