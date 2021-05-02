'use strict';
var jsonpointer = require('jsonpointer');
var inline = require('@cdxoo/inline-text');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');

var fetchRelatedCustomRecordTypes = async ({
    db,
    customRecordTypeRelationData,
    labelOnly = false,
}) => {

    if (customRecordTypeRelationData.length < 1) {
        return {};
    }

    var matchCollectionGroups = groupBy({
        items: customRecordTypeRelationData,
        byProp: 'collection',
    })


    var projectLabelStage;
    if (labelOnly) {
        projectLabelStage = { $project: {
            'collection': true,
            'type': true,
            'state.label': true,
        }}
    }

    var customRecordTypes = await (
        db.collection('customRecordType').aggregate([
            { $match: {
                $or: Object.keys(matchCollectionGroups).map(collection => ({
                    collection,
                    type: { $in: (
                        matchCollectionGroups[collection].map(it => it.value )
                    )}
                }))
            }},
            { $project: {
                events: false,
            }},
            ...(
                labelOnly
                ? [ projectLabelStage ]
                : []
            )
        ]).toArray()
    );

    var collectionGroups = groupBy({
        items: customRecordTypes,
        byProp: 'collection',
    });

    for (var key of Object.keys(collectionGroups)) {
        collectionGroups[key] = keyBy({
            items: collectionGroups[key],
            byProp: 'type',
        })
    }

    //console.log(helperSetItemIdRelationData);
    //console.log(helperSetItems);
    //throw new Error();

    return collectionGroups;
}

module.exports = fetchRelatedCustomRecordTypes;
