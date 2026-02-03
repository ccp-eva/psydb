'use strict';
var { entries, groupBy } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var SmartArray = require('../../../smart-array');
var aggregateFromRefs = require('./aggregate-from-refs');

var resolveRefs = async (bag) => {
    var {
        db, recordRefs, hsiRefs, tokenMapping,
        extraRecordResolvePointers = {},
    } = bag;

    if (tokenMapping) {
        var { helperSetItem: hsiIntermediate, ...recordRefs } = groupBy({
            items: SmartArray(tokenMapping, { spreadArrayItems: true }),
            createKey: (it) => (
                it.recordType
                ? `${it.collection}#${it.recordType}` : it.collection
            ),
            transform: it => (it.setId ? it : it.value)
        });

        var hsiRefs = groupBy({
            items: hsiIntermediate || [],
            byProp: 'setId',
            transform: it => it.value
        });
    }

    var resolvedRecords = {};
    for (var [ key, refs ] of entries(recordRefs)) {
        // XXX
        var [ collection, recordType = undefined ] = key.split('#');

        var extraPointers = extraRecordResolvePointers[collection] || [];
        if (!resolvedRecords[collection]) {
            resolvedRecords[collection] = [];
        }
        var recordsForCurrentRefs = await (
            aggregateFromRefs({
                db, [collection]: refs,
                pointers: [
                    '/_id', '/sequenceNumber', ...extraPointers
                ],
                ...(recordType && {
                    extraMatch: { type: recordType }
                })
            })
        );
        resolvedRecords[collection].push(...recordsForCurrentRefs)
    }

    var resolvedHSIs = {};
    for (var [ setId, refs ] of entries(hsiRefs)) {
        resolvedHSIs[setId] = await (
            aggregateFromRefs({
                db, helperSetItem: refs,
                pointers: [
                    '/_id', '/sequenceNumber',
                    '/state/label', '/state/displayNameI18N/de'
                ],
                extraMatch: { setId: ObjectId(setId) }
            })
        );
    }

    return { resolvedRecords, resolvedHSIs }
}

module.exports = resolveRefs;
