'use strict';
var {
    keyBy,
    groupBy,
} = require('@mpieva/psydb-core-utils');

var fetchHelperSetItemLabels = async (bag) => {
    var { db, ids, keyed = false } = bag; 
    var items = await (
        db.collection('helperSetItem').aggregate([
            { $match: {
                _id: { $in: ids }
            }},
            { $project: {
                'setId': true,
                'state.label': true
            }}
        ]).toArray()
    );

    if (keyed) {
        var setGroups = groupBy({
            items,
            byProp: 'setId',
        });

        for (var setId of Object.keys(setGroups)) {
            setGroups[setId] = keyBy({
                items: setGroups[setId],
                byProp: '_id',
            })
        }

        return setGroups;
    }
    else {
        return items;
    }
}

module.exports = fetchHelperSetItemLabels;
