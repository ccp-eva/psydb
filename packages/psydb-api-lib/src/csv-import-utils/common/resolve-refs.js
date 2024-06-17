'use strict';
var {
    entries,
    jsonpointer,
    convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var withRetracedErrors = require('../../with-retraced-errors');
var aggregateToArray = require('../../aggregate-to-array');


var resolveRefs = async (bag) => {
    var {
        db, recordRefs, hsiRefs,
        extraRecordResolvePointers = {},
    } = bag;

    var resolvedRecords = {};
    for (var [ collection, refs ] of entries(recordRefs)) {
        var extraPointers = extraRecordResolvePointers[collection] || [];
        resolvedRecords[collection] = await withRetracedErrors(
            aggregateFromRefs({ db, [collection]: refs, pointers: [
                '/_id', '/sequenceNumber', ...extraPointers
            ]})
        )
    }

    var resolvedHSIs = {};
    for (var [ setId, refs ] of entries(hsiRefs)) {
        resolvedHSIs[setId] = await withRetracedErrors(
            aggregateFromRefs({
                db, helperSetItem: refs,
                pointers: [
                    '/_id', '/sequenceNumber',
                    '/state/label', '/state/displayNameI18N/de'
                ],
                extraMatch: { setId: ObjectId(setId) }
            })
        )
    }

    return { resolvedRecords, resolvedHSIs }
}

var aggregateFromRefs = async (bag) => {
    var { db, pointers, extraMatch, ...rest } = bag;
    var [ collection, values ] = entries(rest)[0];

    // NOTE: fire one query per possible pointer
    var resolved = await Promise.all(pointers.map(pointer => {
        var path = convertPointerToPath(pointer);
        return aggregateToArray({ db, [collection]: [
            { $match: {
                [path]: { $in: values },
                ...extraMatch,
            }},
            { $project: {
                _id: true,
                [pointer]: '$' + path
            }}
        ]})
    }));

    var out = [];
    for (var r of resolved) {
        out.push(...r.map(it => {
            var { _id, ...rest } = it;
            var [ pointer, value ] = entries(rest)[0];
            return { _id, pointer, value }
        }))
    }
    return out;
}

module.exports = resolveRefs;
