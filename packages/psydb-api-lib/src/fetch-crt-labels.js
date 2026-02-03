'use strict';
var { keyBy, groupBy } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var fetchCRTLabels = async (bag) => {
    var { db, filter = {}, keyed = false } = bag;

    var crts = await aggregateToArray({ db, customRecordType: [
        { $match: filter },
        { $project: {
            'collection': true,
            'type': true,
            'state.label': true,
            'state.displayNameI18N': true,
        }}
    ]});
    
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
