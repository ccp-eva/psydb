'use strict';
var { keyBy, keySequence } = require('@mpieva/psydb-core-utils');
var { SimpleCache } = require('@mpieva/psydb-common-lib');

var WrappedCache = ({ driver, db = undefined }) => {
    var cache = SimpleCache();

    cache.addCRT = ({ _id, key, as }) => {
        cache.merge({ 'customRecordType': {
            [as || key]: _id
        }});
    }
    cache.addId = ({ collection, recordType, id, as }) => {
        if (!id) {
            id = driver.getCache().lastChannelIds[collection];
        }
        if (recordType) {
            cache.merge({ [collection]: { [recordType]: { [as]: id }}});
        }
        else {
            cache.merge({ [collection]: { [as]: id }});
        }
        return id;
    }

    cache.prepareKeyedIds = async (bag) => {
        var { collection, keyBy: pointer } = bag;

        var keyed = keyBy({
            items: await db.collection(collection).find().toArray(),
            byPointer: pointer, transform: (it) => (it._id)
        });
        
        cache.merge({ [collection]: keyed });
    }
    
    cache.prepareSequenceKeyedIds = async (bag) => {
        var { collection, keys } = bag;

        var records = await db.collection(collection).find().sort({
            'sequenceNumber': 1
        }).toArray();

        var keyed = keySequence({
            sequence: records, transform: (it) => (it._id), keys
        });

        cache.merge({ [collection]: keyed });
    }

    return cache;
}

module.exports = WrappedCache;
