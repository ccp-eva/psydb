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
    var { wrap = false } = options;
    
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

    var out = {}
    for (var it of records) {
        var { collection, type } = it;
        var converted = convertCRTRecordToSettings(it);
        jsonpointer.set(out,  `/${collection}/${type}`, (
            wrap ? CRTSettings({ data: converted }) : converted
        ));
    }

    return out;
}

module.exports = fetchAllCRTSettings
