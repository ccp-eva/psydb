'use strict';
var jsonpointer = require('jsonpointer');
var inline = require('@cdxoo/inline-text');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');

var fetchRelatedHelperSetItems = async ({
    db,
    helperSetItemIdRelationData,
}) => {

    if (helperSetItemIdRelationData.length < 1) {
        return {};
    }

    var matchSetGroups = groupBy({
        items: helperSetItemIdRelationData,
        byProp: 'set',
    })

    var helperSetItems = await (
        db.collection('helperSetItem').aggregate([
            { $match: {
                $or: Object.keys(matchSetGroups).map(set => ({
                    set,
                    key: { $in: matchSetGroups[set].map(it => it.value )}
                }))
            }},
            { $project: {
                events: false,
            }}
        ]).toArray()
    );

    var setGroups = groupBy({
        items: helperSetItems,
        byProp: 'set',
    });

    for (var key of Object.keys(setGroups)) {
        setGroups[key] = keyBy({
            items: setGroups[key],
            byProp: 'key',
        })
    }

    //console.log(helperSetItemIdRelationData);
    //console.log(helperSetItems);
    //throw new Error();

    return setGroups;
}

module.exports = fetchRelatedHelperSetItems;
