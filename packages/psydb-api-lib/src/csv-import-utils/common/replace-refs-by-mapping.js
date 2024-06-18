'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var replaceRefs = (bag) => {
    var {
        inItems: targetObjects,
        resolvedRecords, resolvedHSIs, refMappings,
    } = bag;

    var replacementStatuses = [];
    for (var [ ix, itemRefMapping ] of refMappings.entries()) {
        var itemReplacementErrors = [];
        for (var m of itemRefMapping) {
            var { dataPointer, collection, setId = undefined, value } = m;
            var bucket = (
                collection === 'helperSetItem'
                ? resolvedHSIs[setId]
                : resolvedRecords[collection]
            ) || [];
          
            var matchingItems = bucket.filter(it => it.value === value);
            if (matchingItems.length === 1) {
                var [{ _id }] = matchingItems;
                jsonpointer.set(targetObjects[ix], dataPointer, _id);
            }
            else {
                itemReplacementErrors.push({
                    type: 'CouldNotMatch',
                    mapping: m,
                    matchingItems
                });
            }
        }
        replacementStatuses.push(
            itemReplacementErrors.length > 0
            ? ({ isOk: false, errors: itemReplacementErrors })
            : ({ isOk: true })
        );
    }

    // NOTE: even though we operator in situ we return obj
    // for completeness;
    var out = [];
    for (var [ ix, obj ] of targetObjects.entries()) {
        out.push({ obj, ...replacementStatuses[ix] });
    }
    return out;
}

module.exports = replaceRefs;
