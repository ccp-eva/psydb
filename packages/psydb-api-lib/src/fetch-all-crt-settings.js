'use strict';
var jsonpointer = require('jsonpointer');

var {
    InvalidCollection,
    RecordTypeNotFound
} = require('@mpieva/psydb-api-lib-errors');

var {
    convertCRTRecordToSettings,
    CRTSettings
} = require('@mpieva/psydb-common-lib');

var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var fetchAllCRTSettings = async (db, todo, options = {}) => {
    var { wrap = false, asTree = true } = options;
    
    var OR = [];
    for (var it of todo) {
        var { collection, recordTypes } = it;

        var collectionCreatorData = allSchemaCreators[collection];
        if (!(collectionCreatorData?.hasCustomTypes)) {
            throw new InvalidCollection(`
                collection "${collection}" has no crts`
            );
        }

        OR.push({
            collection,
            ...(recordTypes && {
                type: { $in: recordTypes }
            })
        })
    }

    var records = await db.collection('customRecordType').find({
        'state.internals.isRemoved': { $ne: true },
        $or: OR
    }).toArray();

    var mapped = records.map(it => {
        var converted = convertCRTRecordToSettings(it);
        return (
            wrap
            ? CRTSettings({ data: converted })
            : converted
        )
    });

    if (asTree) {
        var out = {}
        for (var it of mapped) {
            var { collection, type } = (wrap ? it.getRaw() : it);
            jsonpointer.set(out,  `/${collection}/${type}`, it);
        }
        return out;
    }
    else {
        return mapped;
    }

}

module.exports = fetchAllCRTSettings
