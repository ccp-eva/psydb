'use strict';
var jsonpointer = require('jsonpointer');
var inline = require('@cdxoo/inline-text');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');

var fetchRelatedHelperSetItems = async ({
    db,
    helperSetItemIdRelationData,
}) => {

    var setGroups = groupBy({
        items: helperSetItemIdRelationData,
        byProp: 'set',
    })

    var helperSetItems = await (
        db.collection('helperSetItem').aggregate([
            { $match: {
                $or: Object.keys(setGroups).map(set => ({
                    set,
                    _id: { $in: setGroups[set].map(it => it.value )}
                }))
            }},
            { $project: {
                events: false,
            }}
        ]).toArray()
    );

    console.log(helperSetItemIdRelationData);
    console.log(helperSetItems);
    throw new Error();

    return keyBy({
        items: helperSetItems,
        byProp: '_id',
    })
}

module.exports = fetchRelatedHelperSetItems;
