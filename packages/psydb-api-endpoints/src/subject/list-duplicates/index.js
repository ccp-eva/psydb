'use strict';
var debug = require('debug')('psydb:api:endpoints:subject:listDuplicates');
var {
    ejson, jsonpointer, convertPointerToPath, keyBy
} = require('@mpieva/psydb-core-utils');

var { __fixRelated } = require('@mpieva/psydb-common-compat');

var { aggregateToArray, aggregateToCursor } = require('@mpieva/psydb-mongo-adapter');
var { match, expressions } = require('@mpieva/psydb-mongo-stages');

var {
    ResponseBody,
    validateOrThrow,
    fetchCRTSettings,
    withRetracedErrors
} = require('@mpieva/psydb-api-lib');

var { fetchRelated } = require('@mpieva/psydb-api-endpoint-lib');

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

    var PREMATCH = {};
    var GROUP_ID = {};
    var PROJECTION = {};
    for (var field of inspectedFields) {
        var path = convertPointerToPath(field.pointer);
        PROJECTION[path] = true;
        GROUP_ID[field.pointer] = `$${path}`;

        PREMATCH[path] = { $ne: '' }
    }

    var stages = [
        match.isNotRemoved({ hasSubChannels: true }),
        match.isNotDummy(),

        { $match: { type: recordType, ...PREMATCH }},
        { $project: {
            ...PROJECTION,
            ...crt.getRecordLabelProjection({ as: '_labelData' }),
            'scientific.state.internals.nonDuplicateIds': true,
        }},

        { $group: {
            _id: GROUP_ID,
            possibleDuplicates: { $push: '$$ROOT' },
            
            __possibleDuplicateIds: { $push: '$_id' },
            __nonDuplicateIds: { $push: (
                '$scientific.state.internals.nonDuplicateIds'
            )}
        }},

        { $project: {
            _id: true, possibleDuplicates: true,
            
            __size: { $size: '$__possibleDuplicateIds' },
            __possibleDuplicateIds: true,
            __nonDuplicateIds: { $reduce: {
                input: "$__nonDuplicateIds",
                initialValue: [],
                in: { $concatArrays: [ "$$value", "$$this" ] }
            }}
        }},
        
        { $match: { $expr: expressions.hasIntersectionLength({
            sets: [ '$__possibleDuplicateIds', '$__nonDuplicateIds' ],
            $lt: '$__size'
            //$eq: '$__size'
        })}},

        { $project: {
            '__size': false,
            '__possibleDuplicateIds': false,
            '__nonDuplicateIds': false,
        }},

        { $match: {
            'possibleDuplicates.1': { $exists: true }
        }},
        { $limit: 100 }
    ];

    var aggregateItems = await withRetracedErrors(
        aggregateToCursor({
            db, subject: stages, mongoSettings: { allowDiskUse: true }
        }).map(it => it.possibleDuplicates).toArray()
    );

    for (var group of aggregateItems) {
        for (var dup of group) {
            dup._label = crt.getLabelForRecord({
                record: dup, from: '/_labelData', ...i18n
            });
            delete dup._labelData;
        }
    }
    
    var related = await fetchRelated({
        db, records: aggregateItems.flat(), definitions: inspectedFields, i18n
    });

    context.body = ResponseBody({
        data: {
            aggregateItems,
            inspectedFields,
            related: __fixRelated(related, { isResponse: false }),
        },
    });

    debug('next()');
    await next();
}

module.exports = listEndpoint;
