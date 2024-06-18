'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var replaceRefs = (bag) => {
    var {
        inItems: targetObjects,
        resolvedRecords, resolvedHSIs, refMappings
    } = bag;

    for (var [ ix, itemRefMapping ] of refMappings.entries()) {
        for (var m of itemRefMapping) {
            var { dataPointer, collection, value } = m;
          
            if (collection === 'helperSetItem') {
                var hsis = resolvedHSIs[m.setId].filter(
                    it => it.value === value
                );
                if (hsis.length !== 1) {
                    throw new Error('multiple or no mappable HSIs');
                }
                jsonpointer.set(
                    targetObjects[ix],
                    dataPointer,
                    hsis[0]._id
                );
            }
            else {
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
    }

    // NOTE: no return as it is in situ
}

module.exports = replaceRefs;
