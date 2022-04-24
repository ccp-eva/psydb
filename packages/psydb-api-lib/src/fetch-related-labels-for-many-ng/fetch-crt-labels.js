'use strict';
var {
    keyBy,
    groupBy,
} = require('@mpieva/psydb-core-utils');


var fetchCRTLabels = async (bag) => {
    var { db, filter = {}, keyed = false } = bag;

    var crts = await (
        db.collection('customRecordType').find(
            filter,
            { projection: {
                'collection': true,
                'type': true,
                'state.label': true,
            }}
        ).toArray()
    );
    
    if (keyed) {
        var collectionGroups = groupBy({
            items: crts,
            byProp: 'collection',
        });

        for (var key of Object.keys(collectionGroups)) {
            collectionGroups[key] = keyBy({
                items: collectionGroups[key],
                byProp: 'type',
            })
        }

        return collectionGroups;
    }
    else {
        return crts;
    }
}

module.exports = fetchCRTLabels;
