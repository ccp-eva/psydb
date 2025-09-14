'use strict';
var { keyBy, keySequence, groupBy, jsonpointer }
    = require('@mpieva/psydb-core-utils');
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
        
        cache.addToRefCache({ collection, recordType, ids: [ id ] });

        return id;
    }

    cache.initRefCache = (refcache) => {
        cache.merge({ refcache });
    }

    cache.addToRefCache = (bag) => {
        var { collection, recordType, ids } = bag;

        var { refcache } = cache.get();
        var pointer = (
            recordType ? `/${collection}/${recordType}` : `/${collection}`
        );
        
        var target = jsonpointer.get(refcache, pointer);
        if (!target) {
            target = []
            jsonpointer.set(refcache, pointer, target);
        }

        target.push(...ids);
    }

    cache.prepareKeyedIds = async (bag) => {
        var { collection, keyBy: pointer } = bag;
        
        var records = await db.collection(collection).find().toArray();

        var keyed = keyBy({
            items: records,
            byPointer: pointer, transform: (it) => (it._id)
        });
        
        cache.merge({ [collection]: keyed });
        
        var groups = groupBy({ items: records, byProp: 'recordType' });
        for (var [ recordType, groupItems ] of Object.entries(groups)) {
            
            cache.addToRefCache({
                collection,
                ids: groupItems.map(it => it._id),
                recordType: (
                    recordType === 'undefined' ? undefined : recordType
                ),
            })
        }
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
        
        var groups = groupBy({ items: records, byProp: 'recordType' });
        for (var [ recordType, groupItems ] of Object.entries(groups)) {
            
            cache.addToRefCache({
                collection,
                ids: groupItems.map(it => it._id),
                recordType: (
                    recordType === 'undefined' ? undefined : recordType
                ),
            })
        }
    }

    cache.initRefCache({});
    return cache;
}

module.exports = WrappedCache;
