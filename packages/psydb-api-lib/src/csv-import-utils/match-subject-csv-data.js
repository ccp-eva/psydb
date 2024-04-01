'use strict';
var {
    jsonpointer, arrify, forcePush, entries, convertPointerToPath, ejson
} = require('@mpieva/psydb-core-utils');

var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var withRetracedErrors = require('../with-retraced-errors');
var aggregateToArray = require('../aggregate-to-array');



var matchSubjectCSVData = async (bag) => {
    var { db, parsedLines } = bag;
  
    var { recordRefs, hsiRefs } = gatherRefs({
        parsedLines
    });

    var { resolvedRecords, resolvedHSIs } = resolveRefs({
        db, recordRefs, hsiRefs
    });

    console.dir(
        ejson({ resolvedRecords, resolvedHSIs }),
        { depth: null }
    );

    for (var line of parsedLines) {
        for (var lineitem of line) {
            var { definition, value, extraPath } = lineitem;
            var { systemType, props } = definition;
           
            if (hasHSIValues(systemType)) {
                var refs = arrify(value);
                var resolved = [];
                for (var r of refs) {
                    var { setId } = props;
                    var resolved = resolvedHSIs[setId].filter(sift({
                        value
                    }));
                    if (resolved.length < 1) {
                        throw new Error('could not resolve');
                    }
                    if (resolved.length > 1) {
                        throw new Error('resolve is ambigous');
                    }
                }
            }
        }
    }
}

var aggregateFromRefs = async (bag) => {
    var { db, pointers, extraMatch, ...rest } = bag;
    var [ collection, values ] = entries(rest)[0];

    console.log({ collection, values });
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

var gatherRefs = (bag) => {
    var { parsedLines } = bag;
    
    var recordRefs = {};
    var helperSetItemRefs = {};

    for (var line of parsedLines) {
        for (var lineitem of line) {
            var { definition, value, extraPath } = lineitem;
            var { systemType, props } = definition;
    
            if (hasHelperSetItemValues(systemType)) {
                var { setId } = props;
                forcePush({
                    into: helperSetItemRefs,  pointer: `/${setId}`,
                    values: arrify(value)
                })
            }
            if (hasRecordValues(systemType)) {
                var { collection } = props;
                forcePush({
                    into: recordRefs,  pointer: `/${collection}`,
                    values: arrify(value)
                })
            }
        }
    }

    return { recordRefs, helperSetItemRefs }
} 

var resolveRefs = async (bag) => {
    var { db, recordRefs, hsiRefs } = bag;

    var resolvedRecords = {};
    for (var [ collection, refs ] of entries(recordRefs)) {
        resolvedRecords[collection] = await withRetracedErrors(
            aggregateFromRefs({ db, [collection]: refs, pointers: [
                '/_id', '/sequenceNumber',
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

var matchRefs = (bag) => {
    var { from, refs } = bag;

}

var hasHelperSetItemValues = (systemType) => ([
    'HelperSetItemId', 'HelperSetItemIdList'
].includes(systemType))

var hasRecordValues = (systemType) => ([
    'ForeignId', 'ForeignIdList'
].includes(systemType))


module.exports = matchSubjectCSVData;
