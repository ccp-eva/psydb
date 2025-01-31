'use strict';
var debug = require('debug')('psydb:api:endpoints:subject:listDuplicates');
var {
    ejson, jsonpointer, convertPointerToPath, keyBy
} = require('@mpieva/psydb-core-utils');

var { __fixRelated } = require('@mpieva/psydb-common-compat');

var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { match } = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings
} = require('@mpieva/psydb-api-lib');

var { fetchRelated } = require('../../../__lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var listEndpoint = async (context, next) => {
    var { db, request, permissions, apiConfig } = context;
    var {
        dev_enableSubjectDuplicatesSearch,
        dev_subjectDuplicatesSearchFields
    } = apiConfig;

    if (!dev_enableSubjectDuplicatesSearch) {
        throw new ApiError(409, 'NotConfigured');
    }
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

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
        pointer: { $in: (
            dev_subjectDuplicatesSearchFields?.[recordType] || []
        )}
    });

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

    var PROJECTION = {};
    for (var field of inspectedFields) {
        var path = convertPointerToPath(field.pointer);
        PROJECTION[path] = true;
    }

    var stages = [
        match.isNotRemoved({ hasSubChannels: true }),
        match.isNotDummy(),

        { $match: { type: recordType }},
        { $project: PROJECTION }
    ];
    var inspectableRecords = await aggregateToArray({
        db, subject: stages
    });

    var groupedIds = gatherDuplicatesIdGroups({
        records: inspectableRecords,
        inspectedFields
    });

    var displayRecords = await aggregateToArray({ db, subject: [
        { $match: { '_id': { $in: groupedIds.flat() }}},
        { $project: {
            ...PROJECTION,
            ...crt.getRecordLabelProjection({ as: '_labelData' })
        }}
    ]});

    // TODO
    // crt.convertRecordLabels({ records, from: '/_labelData' });
    for (var it of displayRecords) {
        it._label = crt.getLabelForRecord({
            record: it, from: '/_labelData', ...i18n
        });
        delete it._labelData;
    }

    var groupedRecords = populateDuplicatesGroups({
        groupedIds, records: displayRecords
    });

    var related = await fetchRelated({
        db, records: displayRecords, definitions: inspectedFields, i18n
    });

    context.body = ResponseBody({
        data: {
            aggregateItems: groupedRecords,
            inspectedFields,
            related: __fixRelated(related, { isResponse: false }),
        },
    });

    debug('next()');
    await next();
}

var populateDuplicatesGroups = (bag) => {
    var { groupedIds, records } = bag;

    var recordsById = keyBy({ items: records, byProp: '_id' });
    var out = [];
    for (var group of groupedIds) {
        out.push(group.map(_id => recordsById[_id]))
    }

    return out;
}

var gatherDuplicatesIdGroups = (bag) => {
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
            //console.log({ compIndex, baseIndex });

            var matchCount = 0;
            for (var field of inspectedFields) {
                var { pointer } = field;

                var baseValue = jsonpointer.get(baseItem, pointer);
                var compValue = jsonpointer.get(compItem, pointer);

                // TODO: properly handle dates, adress
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
        //console.log('')
    }

    return Object.values(dups);
}

module.exports = listEndpoint;
