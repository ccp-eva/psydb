'use strict';
var debug = require('debug')('psydb:api:endpoints:subject:listDuplicates');
var {
    ejson, entries, jsonpointer, convertPointerToPath, keyBy,
} = require('@mpieva/psydb-core-utils');

var { __fixRelated } = require('@mpieva/psydb-common-compat');

var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { match } = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings
} = require('@mpieva/psydb-api-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

//var fetchRelated = require('./fetch-related');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    debug('start validating');

    validateOrThrow({
        schema: CoreBodySchema(),
        payload: request.body,
        //unmarshalClientTimezone: timezone,
    });

    var { recordType = undefined } = request.body;

    var crt = await fetchCRTSettings({
        db, collectionName: 'subject', recordType, wrap: true
    });

    var availableFields = crt.findCustomFields({
        pointer: { $in: [
            // TODO: from config
            '/gdpr/state/custom/lastname'
        ]}
    });

    console.dir(ejson(availableFields), { depth: null });

    validateOrThrow({
        schema: FullBodySchema({ availableFields }),
        payload: request.body,
        unmarshalClientTimezone: timezone,
    });

    var {
        inspectedPointers,
        //offset, limit,
        //sort,
    } = request.body;

    var inspectedFields = crt.findCustomFields({
        pointer: { $in: inspectedPointers }
    });
    debug('done validating');

    var PROJECTION = {};
    for (var field of inspectedFields) {
        var path = convertPointerToPath(field.pointer);
        PROJECTION[path] = true;
    }

    debug('>>>>>>>>> START FETCH');
    var stages = [
        match.isNotRemoved({ hasSubChannels: true }),
        match.isNotDummy(),

        { $match: { type: recordType }},
        { $project: PROJECTION }
    ];

    var inspectableRecords = await aggregateToArray({ db, subject: stages });
    debug('<<<<<<<<< END FETCH')

    var groupedIds = gatherDuplicateIdGroups({
        records: inspectableRecords,
        inspectedFields
    });

    var displayRecords = await aggregateToArray({ db, subject: [
        { $match: { '_id': { $in: groupedIds.flat() }}},
        // TODO: project something
    ]});

    var groupedRecords = populateDuplicateGroups({
        groupedIds, records: displayRecords
    });

    //var __related = await fetchRelated({
    //    db, records, definitions: displayFields, i18n
    //});

    context.body = ResponseBody({
        data: {
            aggregateItems: groupedRecords
            //displayFieldData: displayFields,
            //recordsCount: records.totalRecordCount,
            
            //related: __fixRelated(__related, { isResponse: false }),
            //...(__related),
        },
    });

    debug('next()');
    await next();
}

var populateDuplicateGroups = (bag) => {
    var { groupedIds, records } = bag;

    var recordsById = keyBy({ items: records, byProp: '_id' });
    var out = [];
    for (var group of groupedIds) {
        out.push(group.map(_id => recordsById[_id]))
    }

    return out;
}

var gatherDuplicateIdGroups = (bag) => {
    var { records, inspectedFields } = bag;
    
    var dups = {};
    var foundDupIndices = [];
    for (var [ baseIndex, baseItem ] of records.entries()) {
        if (foundDupIndices.includes(baseIndex)) {
            // skip item when we already marked the index as dup
            continue;
        }

        for (var [ compIndex, compItem ] of records.entries()) {
            if (compIndex <= baseIndex) {
                // skip everything before the current base index
                // since we already inspected those items
                continue;
            }
            console.log({ compIndex, baseIndex });

            var matchCount = 0;
            for (var field of inspectedFields) {
                var { pointer } = field;

                var baseValue = jsonpointer.get(baseItem, pointer);
                var compValue = jsonpointer.get(compItem, pointer);

                // TODO
                if (String(baseValue) === String(compValue)) {
                    matchCount += 1;
                }
            }

            if (matchCount === inspectedFields.length) {
                // NOTE: this makes: { _id: [ baseItem, dup, dup, ... ] }
                if (!dups[baseItem._id]) {
                    dups[baseItem._id] = [ baseItem._id ];
                }
                dups[baseItem._id].push(compItem._id);
                foundDupIndices.push(compIndex);
            }
        }
        console.log('')
    }

    return Object.values(dups);
}

module.exports = listEndpoint;
