'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var replaceRefs = (bag) => {
    var {
        inItems: targetObjects,
        resolvedRecords, resolvedHSIs, tokenMapping
    } = bag;

    for (var [ ix, recordTokenMapping ] of tokenMapping.entries()) {
        for (var m of recordTokenMapping) {
            var { dataPointer, collection, value } = m;
            
            var records = resolvedRecords[collection].filter(
                it => it.value === value
            );
            if (records.length !== 1) {
                throw new Error('multiple or no mappable records');
            }

            jsonpointer.set(
                targetObjects[ix],
                dataPointer,
                records[0]._id
            );
        }
    }

    // NOTE: no return as it is in situ
}

module.exports = replaceRefs;
