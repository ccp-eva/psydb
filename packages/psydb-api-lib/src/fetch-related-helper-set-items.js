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

    console.log('AAAAAAAAAAAAAAAAA');
    console.log(helperSetItemIdRelationData);

    var matchSetGroups = groupBy({
        items: helperSetItemIdRelationData,
        byProp: 'setId',
    })

    var helperSetItems = await (
        db.collection('helperSetItem').aggregate([
            { $match: {
                $or: Object.keys(matchSetGroups).map(setId => ({
                    setId,
                    _id: { $in: matchSetGroups[setId].map(it => it.value )}
                }))
            }},
            { $project: {
                events: false,
            }}
        ]).toArray()
    );

    var setGroups = groupBy({
        items: helperSetItems,
        byProp: 'setId',
    });

    for (var setId of Object.keys(setGroups)) {
        setGroups[setId] = keyBy({
            items: setGroups[setId],
            byProp: '_id',
        })
    }

    //console.log(helperSetItemIdRelationData);
    //console.log(helperSetItems);
    //throw new Error();

    return setGroups;
}

module.exports = fetchRelatedHelperSetItems;
