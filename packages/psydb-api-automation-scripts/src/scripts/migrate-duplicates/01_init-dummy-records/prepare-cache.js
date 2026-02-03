'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');

module.exports = async (context) => {
    var { cache } = context;

    await cache.prepareKeyedIds({
        collection: 'researchGroup',
        keyBy: '/state/shorthand',
    });
    
    await cache.prepareKeyedIds({
        collection: 'helperSetItem',
        keyBy: '/state/label',
    });

    console.dir(ejson(cache.get()), { depth: null });
}
