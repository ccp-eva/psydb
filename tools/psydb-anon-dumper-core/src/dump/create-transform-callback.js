'use strict';
var { jsonpointer, ejson } = require('@mpieva/psydb-core-utils');
var { getSeedForDocId } = require('../utils');


var createTransformCallback = (options) => (bag) => {
    var { schemas, anonymizers, cache, collectionsToCache } = options;
    var { collection, doc } = bag;

    console.log({ collection, _id: doc._id });
    
    var Schema = schemas[collection];
    var anonymizer = anonymizers[collection];
    var docSeed = getSeedForDocId(doc);

    anonymizer.setupCache({ value: doc, dumperCache: cache });
    anonymizer.seed(docSeed);
    //anonymizer.disablePropertyReseed(); // XXX

    var { value: anonymized } = Schema().transformValue({
        transform: anonymizer.anonymize,
        value: doc,
    });

    //console.dir(ejson(anonymized), { depth: null });

    //jsonpointer.set(cache, `/original/${collection}/${doc._id}`, doc);
    if (collectionsToCache.includes(collection)) {
        jsonpointer.set(
            cache, `/faked/${collection}/${doc._id}`, anonymized
        );
    }

    return anonymized;
}

module.exports = createTransformCallback;
