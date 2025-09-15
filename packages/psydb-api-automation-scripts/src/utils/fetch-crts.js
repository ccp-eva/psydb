'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { convertCRTRecordToSettings } = require('@mpieva/psydb-common-lib');

var fetchCRTs = async (bag) => {
    var { db } = bag;

    var records = await db.collection('customRecordType').find({
        'state.internals.isRemoved': { $ne: true },
    }).toArray();

    var settings = records.map(convertCRTRecordToSettings);

    var out = {}
    for (var it of settings) {
        var { collection, type } = it;
        jsonpointer.set(out,  `/${collection}/${type}`, it);
    }
    return out;
}

module.exports = fetchCRTs;
