'use strict';
var { groupBy, jsonpointer } = require('@mpieva/psydb-core-utils');

var gatherRefCache = async (bag) => {
    var { db } = bag;

    var collections = await db.listCollections({
        name: { $nin: [
            'mqMessageQueue', 'mqMessageHistory', 'rohrpostEvents'
        ]}
    }).map(it => it.name);
    
    var data = {}
    for await (var cname of collections) {
        var records = await db.collection(cname).find({}, {
            projection: { _id: true, type: true }
        }).toArray();

        var byType = groupBy({ items: records, byProp: 'type' });
        for (var [ type, items ] of Object.entries(byType)) {
            var pointer = (
                type === 'undefined'
                ? `/${cname}`
                : `/${cname}/${type}`
            );
            jsonpointer.set(data, pointer, items.map(it => it._id));
        }
    }

    var refcache = {};
    refcache.data = () => {
        return data;
    }

    return refcache;
}

module.exports = gatherRefCache;
