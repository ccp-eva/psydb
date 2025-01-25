'use strict';
var debug = require('debug')('psydb:api:endpoints:study:list');
var { ejson, entries } = require('@mpieva/psydb-core-utils');
var { __fixRelated } = require('@mpieva/psydb-common-compat');

var { match } = require('psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    convertFiltersToQueryPairs,

    fetchRecordsByFilter,
} = require('@mpieva/psydb-api-lib');

var CoreBodySchema = require('./core-body-schema');
var FullBodySchema = require('./full-body-schema');

var gatherDisplayFields = require('./gather-display-fields');
var gatherSharedDisplayFields = require('./gather-shared-display-fields');
var gatherAvailableConstraints = require('./gather-available-constraints');
var fetchRelated = require('./fetch-related');

var listEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    debug('start validating');

    validateOrThrow({
        schema: BodySchema(),
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
    for (var pointer of inspectedFields) {
        var path = convertPointerToPath(pointer);
        PROJECTION[path] = true;
    }

    debug('>>>>>>>>> START FETCH');
    var items = await aggregateToArray({ db, subject: [
        match.isNotRemoved({ hasSubChannels: true }),
        match.isNotDummy(),

        { $match: { recordType }},
        { $project: PROJECTION }
    ]});
    debug('<<<<<<<<< END FETCH')

    var dups = {};
    for (var [ baseIndex, baseItem ] of items.entries()) {
        for (var [ compIndex, compItem ] of items.entries()) {
            if (compIndex <= baseIndex) {
                // skip everything before the current base index
                // since we already inspected those items
                continue;
            }

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
                    dups[baseItem._id] = [ baseItem ];
                }
                dups[baseItem._id].push(compItem)
            }
        }
    }

    //var __related = await fetchRelated({
    //    db, records, definitions: displayFields, i18n
    //});

    context.body = ResponseBody({
        data: {
            records,
            displayFieldData: displayFields,
            recordsCount: records.totalRecordCount,
            //related: __fixRelated(__related, { isResponse: false }),
            ...(__related),
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
