'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var replaceRefs = (bag) => {
    var {
        inItems: targetObjects,
        resolvedRecords, resolvedHSIs, refMappings,
    } = bag;

    var replacementStatuses = [];
    for (var [ ix, itemRefMapping ] of refMappings.entries()) {
        var itemReplacements = [];
        var itemReplacementErrors = [];
        for (var m of itemRefMapping) {
            var {
                dataPointer,
                collection,
                setId = undefined,
                recordType = undefined,
                value
            } = m;

            var bucket = (
                collection === 'helperSetItem'
                ? resolvedHSIs[setId]
                : resolvedRecords[collection]
            ) || [];
          
            var matchingItems = bucket.filter(it => (
                recordType
                ? (it.type === recordType && isSameValue(it.value, value))
                : isSameValue(it.value, value)
            ));
            if (matchingItems.length === 1) {
                var [ matched ] = matchingItems;
                jsonpointer.set(targetObjects[ix], dataPointer, matched._id);
                itemReplacements.push(matched);
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
            ? ({
                isOk: false,
                replacements: itemReplacements,
                errors: itemReplacementErrors
            })
            : ({
                isOk: true,
                replacements: itemReplacements
            })
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

var isObjectId = (that) => (
    !!that && typeof that === 'object'
    && /^ObjectI[dD]$/.test(that._bsontype)
);

// NOTE: values resolved via '/_id' are ObjectIds, which are distinct
// instances and never '===' the ObjectId parsed from the csv
var isSameValue = (a, b) => (
    isObjectId(a) && isObjectId(b)
    ? String(a) === String(b)
    : a === b
);

module.exports = replaceRefs;
