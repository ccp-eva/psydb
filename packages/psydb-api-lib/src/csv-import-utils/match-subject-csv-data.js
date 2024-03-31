'use strict';
var {
    jsonpointer, arrify, forcePush, entries, convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var withRetracedErrors = require('../with-retraced-errors');
var aggregateToArray = require('../aggregate-to-array');



var matchSubjectCSVData = async (bag) => {
    var { db, parsedLines } = bag;
   
    var recordRefs = {};
    var helperSetItemRefs = {};

    for (var line of parsedLines) {
        for (var lineitem of line) {
            var { definition, value, extraPath } = lineitem;
            var { systemType, props } = definition;
            
            if ([
                'HelperSetItemId',
                'HelperSetItemIdList'
            ].includes(systemType)) {
                var { setId } = props;
                forcePush({
                    into: helperSetItemRefs,  pointer: `/${setId}`,
                    values: arrify(value)
                })
            }
            
            if ([
                'ForeignId',
                'ForeignIdList'
            ].includes(systemType)) {
                var { collection } = props;
                forcePush({
                    into: recordRefs,  pointer: `/${collection}`,
                    values: arrify(value)
                })
            }
        }
    }

    console.log({ helperSetItemRefs, recordRefs })

    var helperSetItemIds = {};
    for (var [ setId, refs ] of entries(helperSetItemRefs)) {
        helperSetItemIds[setId] = await withRetracedErrors(
            aggregateFromRefs({
                db, helperSetItem: refs,
                pointers: [
                    '/_id', '/sequenceNumber',
                    '/state/label', '/state/displayNameI18N'
                ],
                extraMatch: { setId: ObjectId(setId) }
            })
        )
    }

    var recordIds = {};
    for (var [ collection, refs ] of entries(recordRefs)) {
        recordIds[collection] = await withRetracedErrors(
            aggregateFromRefs({ db, [collection]: refs, pointers: [
                '/_id', '/sequenceNumber',
            ]})
        )
    }

    console.log({ helperSetItemIds, recordIds });
}

var aggregateFromRefs = async (bag) => {
    var { db, pointers, extraMatch, ...rest } = bag;
    var [ collection, values ] = entries(rest)[0];

    console.log({ collection, values });;
    var resolved = await Promise.all(pointers.map(pointer => (
        aggregateToArray({ db, [collection]: [
            { $match: {
                [convertPointerToPath(pointer)]: { $in: values },
                ...extraMatch,
            }},
            { $project: {
                _id: true
            }}
        ]})
    )));

    var out = [];
    for (var it of resolved) {
        out.push(...it.map(it => it._id))
    }
    return out;
}

var aggregateHelperSetIds = async (bag) => {
    var { db, stages } = bag;

    return withRetracedErrors(
        aggregateToArray({ db, helperSet: [
            ...stages,
            { $project: { _id: true }}
        ]})
    );
}

module.exports = matchSubjectCSVData;
